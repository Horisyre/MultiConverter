import cloudconvert
import os
from dotenv import load_dotenv

load_dotenv("MineP.env")
api_key = os.getenv("SECRET_KEY")
cloudconvert.configure(api_key = api_key, sandbox = False)



class convertJob:
    def __init__(self,output_format):
        self.output_format=output_format
        self.payload={
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
        }
    
    def create_job(self):
        self.job_data = cloudconvert.Job.create(payload=self.payload)
        return self.job_data
        
    def getId(self):
        return self.job_data['id']
    
    def get_task(self,taskName):
        if not self.job_data or 'tasks' not in self.job_data:
            return None
        for task in self.job_data['tasks']:
            if 'name' in task and task['name'] == taskName:
                return task
        return None

    def find_task_by_name(self, name):
        for task in self.get_tasks():
            if task.get('name') == name:
                return task
        return None
    