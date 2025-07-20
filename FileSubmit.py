from flask import Flask,request
import config
import json 


app = Flask(__name__)

@app.route('/api/SubmitFile', methods=['POST'])
def upload():
    input_type = request.form.get('inputFileType')
    uploaded_file = request.files.get('file')
    convertedFile=None
    if uploaded_file:
        #use api conversion
        pass
    if convertedFile:
        return convertedFile