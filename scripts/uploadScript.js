const InputArea=document.getElementById('inputBox');
const UploadBtn=document.getElementById('uploadBtn');
const Input=document.getElementById('FileInput');
const Filename=document.getElementById('FileName');
const Right= document.getElementById('right');

InputArea.addEventListener('click', function(){
    Input.click();
} );

UploadBtn.addEventListener('click', function(){
    Input.click();
} );

Input.addEventListener('change', function(){
    if (Input.files.length > 0){
        Filename.textContent= Input.files[0].name;
        //open a div in the right with the submit button
        Right.style.display='block';
        Right.style.pointerEvents='auto';
    }else{
        Filename.textContent= "No File Chosen";
    }
} );