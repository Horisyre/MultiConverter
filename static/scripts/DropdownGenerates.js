document.querySelector('.dropdown').addEventListener("mouseenter", function() {
    generateList(this);
});
//TO DO:
//SET A BOOLEAN VALUE
// IF THE BOOLEAN FUNCTION IS TRUE  WE WILL NOT RUN THIS FUNCTION AGAIN
function generateList(e){
    child=e.querySelector('.dropdownItems');
    console.log(conversionType);
    fetch(`/get-options?type=${encodeURIComponent(conversionType)}`)
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById(conversionType);
            data.filetypes.forEach(option => {
                const button = document.createElement("button");
                button.textContent = option;
                dropdown.appendChild(button);
            });
        });
};