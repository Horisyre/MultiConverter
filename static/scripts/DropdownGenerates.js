document.querySelectorAll('.dropdown').forEach(dropdown=>{dropdown.addEventListener("mouseenter", function() {
    if(!this.dataset.isInitialised){
        generateList(this);  
    }
    });
});
const ConvertFromButton=document.getElementById("ConvertFrom");
function UploadToType(e){
    const button=e.target;
    ConvertFromButton.textContent=button.textContent;
}//then define a callback function, if the response was ok take the buttons text content and apply it to the possible dropdown options for the convert to button dropwn(left dropdown)

// IF THE BOOLEAN FUNCTION IS TRUE  WE WILL NOT RUN THIS FUNCTION AGAIN
function generateList(e){
    e.dataset.isInitialised=true
    child=e.querySelector('.dropdownItems');
    conversionType=child.id;
    fetch(`/get-options?type=${encodeURIComponent(conversionType)}`)
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById(conversionType);
            data.filetypes.forEach(option => {
                const button = document.createElement("button");
                button.textContent = option;
                button.addEventListener('click', UploadToType);
                dropdown.appendChild(button);
            });
        });
};