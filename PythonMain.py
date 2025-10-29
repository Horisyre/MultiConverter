from flask import Flask,request,jsonify,render_template
import config,uuid
import cloudconvert,os
from dotenv import load_dotenv
app = Flask(__name__)
app.config.from_object(config.DevelopmentConfig)
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
    uploaded_file = request.files.get('file')
    output_format=request.form.get('OutputFileType')
    uid = str(uuid.uuid4())  

    if not uploaded_file or not output_format:
        return jsonify({"error": "Missing file or output format"}), 400

    # Define the job
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

    # Find the import/upload task
    upload_task = next(task for task in job['tasks'] if task['name'] == 'import-my-file')













    """IM HERE UPLOADING THE FILE TO CLOUD CONVERT"""

















    # Upload your local file to CloudConvert
    cloudconvert.Task.upload(
        uploaded_file.filename,
        upload_task
    )
    # Wait until the job is finished
    job = cloudconvert.Job.wait(id=job['id'])

    # Get the downloadable file URL
    export_task = next(task for task in job['tasks'] if task['name'] == 'export-my-file')
    file_info = export_task['result']['files'][0]
    return jsonify({
        "message": "File converted successfully",
        "download_url": file_info['url']
    })


@app.route('/get-options', methods=['GET'])
def submit():
    File_type = request.args.get('type')
    options = FileTypeDict[File_type]
    return jsonify(filetypes=options)
