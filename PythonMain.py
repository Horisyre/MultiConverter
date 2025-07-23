from flask import Flask,request,jsonify,render_template
import config
import json 

app = Flask(__name__)
app.config.from_object(config.DevelopmentConfig)


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
    input_type = request.form.get('inputFileType')
    uploaded_file = request.files.get('file')
    convertedFile=None
    """if uploaded_file:
        #use api conversion
        pass
        if convertedFile:
        return convertedFile"""


@app.route('/get-options', methods=['GET'])
def submit():
    File_type = request.args.get('type')
    options = FileTypeDict[File_type]
    return jsonify(filetypes=options)
