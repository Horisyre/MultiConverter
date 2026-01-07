import os
import uuid
from werkzeug.utils import secure_filename

class UploadedFile:
    def __init__(self, file):
        self.file = file
        self.filename = file.filename
        self.safe_name = secure_filename(self.filename)

    def get_safe_path(self, upload_folder):
        ext = os.path.splitext(self.filename)[1]
        new_filename = f"{uuid.uuid4().hex}{ext}"

        safe_path = os.path.join(
            upload_folder,
            new_filename
        )
        return safe_path
    
    def check_filetype(self, extensions):
        return os.path.splitext(self.filename)[1] in extensions