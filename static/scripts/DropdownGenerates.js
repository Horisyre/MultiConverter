document.querySelectorAll('.dropdown').forEach(dropdown=>{dropdown.addEventListener("mouseenter", function() {
    if(!this.dataset.isInitialised){
        generateList(this);  
    }
    });
});


function UploadToType(e){
    const button=e.target;
    ConvertFrom.textContent="Converting to file format type: "+ button.textContent;
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

document.querySelectorAll('.dropdown').forEach(dropdown => {
    let timeoutId;//each dropdown has its own independent timer

    dropdown.addEventListener("mouseenter", () => {
        // Show this dropdown immediately
        dropdown.classList.add('keep-visible');

        // Clear any previous hide timer
        if (timeoutId) clearTimeout(timeoutId);
    });

    dropdown.addEventListener("mouseleave", () => {
        // Hide this dropdown after 15 seconds
        timeoutId = setTimeout(() => {
            dropdown.classList.remove('keep-visible');
        }, 300);
    });
});

