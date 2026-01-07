from importlib.metadata import files
from flask import Flask,request,jsonify,render_template
import cloudconvert,os,tempfile,uuid
from dotenv import load_dotenv
from flask_uploads import UploadSet, configure_uploads, ALL
from werkzeug.utils import secure_filename

UPLOAD_FOLDER='uploads'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.png', '.gif']
load_dotenv("MineP.env")
api_key = os.getenv("SECRET_KEY")
cloudconvert.configure(api_key = api_key, sandbox = False)



FileTypeDict = {
    'document': ['pdf', 'docx', 'txt'],
    'music': ['mp3', 'wav', 'aac'],
    'image': ['jpg', 'png', 'gif'],
    'video': ['mp4', 'mov', 'avi']
}
@app.route("/",methods=['GET'])
def main():
    return render_template('MainPage.html')




@app.route('/api/SubmitFile', methods=['POST'])
def upload():
    upload_task = None
    uploaded_file = request.files.get('file')
    output_format=request.form.get('OutputFileType')

    if not check_filetype(uploaded_file.filename):
        return jsonify({"error": "Invalid file type"}), 400
    
    
    if not uploaded_file or not output_format:
        return jsonify({"error": "Missing file or output format"}), 400

    job = cloudconvert.Job.create(payload={
        "tasks": {
            "import-my-file": {"operation": "import/upload"},
            "convert-my-file": {
                "operation": "convert",
                "input": ["import-my-file"],
                "output_format": output_format
            },
            "export-my-file": {
                "operation": "export/url",
                "input": ["convert-my-file"]
            }
        }
    })

    if isinstance(job, dict) and 'tasks' in job:
        for task in job['tasks']:
            if 'name' in task and task['name'] == 'import-my-file':
                task_data = task
                upload_task = task_data
                break
        if upload_task:
            print("succesffuly found job")
    else:
        print("unsuccesffuly found job")
        return jsonify({"error": "Failed to create job"}), 500 
       
        
    original_filename = uploaded_file.filename

    tmp_dir = tempfile.gettempdir()
    tmp_path = os.path.join(tmp_dir, original_filename)

    uploaded_file.save(tmp_path)

    try:
        success = cloudconvert.Task.upload(
            file_name=tmp_path,
            task=upload_task
        )

        if not success:
            app.logger.error("Upload returned False")
            return jsonify({"error": "Upload failed"}), 500
    finally:
        os.remove(tmp_path)

        
    finsihedJob= cloudconvert.Job.wait(id=job['id'])

    export_task = None

    if 'tasks' in job:
        for task in finsihedJob['tasks']:
            if task['name'] == 'export-my-file':
                export_task = task
                break
            if export_task:
                print("succesffuly found job")
            else:
                print("unsuccesffuly found job")
                print(job['tasks'])
                return jsonify({"error": "Failed to find job"}), 500 
        
    if export_task is None or 'result' not in export_task or 'files' not in export_task['result']:
        return jsonify({"error": "No files found in export task"}), 500
    file_info=export_task["result"]["files"][0]
    files = export_task["result"]["files"][0]["url"]


    if files is None or 'url' not in file_info:
        return jsonify({"error": "No file info found"}), 500
    
    return jsonify({
        "message": "File converted successfully",
        "download_url": file_info['url']
    })


@app.route('/get-options', methods=['GET'])
def submit():
    File_type = request.args.get('type')
    options = FileTypeDict[File_type]
    return jsonify(filetypes=options)

def check_filetype(filename):
    return os.path.splitext(filename)[1] in app.config['UPLOAD_EXTENSIONS']
