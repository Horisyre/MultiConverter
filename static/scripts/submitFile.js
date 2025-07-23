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
            //--------------------------TO DO ---------------------------//
            /*
            const response= await fetch({path,
                method: "POST",
                body:formData
            });
            
            
            const result = await response.blob();
            if result: //successful hold response in vaar and open the downlaod in a new route 
                pass;
            else:
                alert(result.message);
            */
        }
}
const ConvertFromButton=document.getElementById("ConvertFrom");
const conversionPairs=[]

function UploadToType(e){
    InputFileType= e.innerText;
    ConvertFromButton.innerText=e.innerText;
    //hhere we need to submit the file type and whethere its Document/audiuo/image
    //a puython endppoint will generate the list for the given document types and send it to conversionPairs
    //conveesionpairs will update the #right . dropdownItems innerhtml 
}

function UploadToType(e){
    OutputFileType= e.innerText;
    ConvertFromButton.innerText=e.innerText;
    //hhere we need to submit the file type and whethere its Document/audiuo/image
    //a puython endppoint will generate the list for the given document types and send it to conversionPairs
    //conveesionpairs will update the #right . dropdownItems innerhtml 
}


