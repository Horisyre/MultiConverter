/*
    ConversionPairs stores the different types of possible conversions
*/

document.getElementById("ConvertBtn").addEventListener("submit",SubmitFile());

let InputFileType=""; 
let OutputFileType="";

path="/api/SubmitFile";

async function SubmitFile(){
    //validate name info and return early if condititions not met
    if (Filename.textContent == "No File Chosen"){
        return;
        }else{
            //send to backend, using fetch()
            const formData=new formData();
            formData.append("file", Input);
            formData.append("inputFileType",Filename);

            job = cloudconvert.Job.create(payload={
                "tasks": {
                    'import-my-file': {
                        'operation': 'import/url',
                        'url': 'https://my.url/file.docx'
                    },
                    'convert-my-file': {
                        'operation': 'convert',
                        'input': 'import-my-file',
                        'input_format': 'docx',
                        'output_format': 'pdf'
                    },
                    'export-my-file': {
                        'operation': 'export/url',
                        'input': 'convert-my-file'
                    }
                }
            })
            
        }
}

const conversionPairs=[]




