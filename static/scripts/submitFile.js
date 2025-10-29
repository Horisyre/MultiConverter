document.getElementById("ConvertBtn").addEventListener("click",SubmitFile);



const ConvertFrom=document.getElementById("ConvertFrom");

path="/api/SubmitFile";
const OutputFileType = ConvertFrom.textContent.slice(ConvertFrom.textContent.lastIndexOf(":") + 2);


async function SubmitFile(){
    //validate name info and return early if condititions not met
    const fileName = Input.files[0].name;
    const InputFileType = fileName.slice(fileName.lastIndexOf("."))
    if (Filename.textContent == "No File Chosen"){
        return;
        }else{
            //send to backend, using fetch()
            const formData=new FormData();
            formData.append("file", Input.files[0]);
            formData.append("inputFileType",InputFileType);
            formData.append("OutputFileType",OutputFileType)
                try {
                    const response = await fetch(path, {
                        method: "POST",
                        body: formData
                    });
                    const result = await response.json();
                    if (result.download_url) {
                        // MIGHT LOOK LIKE---->{ "status": "success", "download_url": "/downloads/output.pdf" }
                        console.log("Server response:", result);
                        document.getElementById("downloadFile").href = result.download_url;
                    } else {
                        console.error("Server error:", response.status);
                    }
                } catch (error) {
                    console.error("Error sending file:", error);
                }
            }
}

const conversionPairs=[]




