from flask import Flask,request,jsonify,render_template
import cloudconvert,os,uuid
from dotenv import load_dotenv
from classes.UploadedFile import UploadedFile 
from classes.Job import convertJob
UPLOAD_FOLDER='uploads'
app = Flask(__name__)
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
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

def validate(uploaded_file, output_format):
    if uploaded_file is None or uploaded_file.filename == '':
        return "No file uploaded"
    
    if output_format is None or output_format.strip() == '':
        return "Output format not specified"
    
    return None

@app.route('/api/SubmitFile', methods=['POST'])
def upload():
    upload_task = None
    uploaded_file = request.files.get('file')
    
    output_format=request.form.get('OutputFileType')

    error = validate(uploaded_file, output_format)
    if error:
        return jsonify({"error": error}), 400
    
    uploaded_file_instance = UploadedFile(uploaded_file)
    # Saving file persistently
    save_path = uploaded_file_instance.get_safe_path(app.config['UPLOAD_FOLDER'])
    uploaded_file.save(save_path)

    job = convertJob(output_format).create_job()    

    if isinstance(job, dict):
        upload_task = job.get_task('import-my-file')
    else:
        return jsonify({"error": "Failed to create job"}), 500 
    

    
    if upload_task is None:
        return jsonify({"error": "Upload task not found"}), 500   
    try:
        success = cloudconvert.Task.upload(
            file_name=save_path,
            task=upload_task
        )

        if not success:
            app.logger.error("Upload returned False")
            return jsonify({"error": "Upload failed"}), 500
    except Exception as e:
        app.logger.error(f"Upload failed: {e}")
        return jsonify({"error": "Upload failed"}), 500




    #reassign job.job_data to cloudconvert.Job.wait(id=job.getId())  to get updated status        
    finsihedJob= cloudconvert.Job.wait(id=job.getId()) 
    export_task = None

    if 'tasks' in job:
        for task in finsihedJob['tasks']:
            if task['name'] == 'export-my-file':
                export_task = task
                break
            else:
                print("unsuccesffuly found job")
                print(job['tasks'])
                return jsonify({"error": "Failed to find job"}), 500 
    else:
        return jsonify({"error": "No tasks found in job"}), 500


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

    

