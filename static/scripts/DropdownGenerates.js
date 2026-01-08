document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener("mouseenter", function() {
        if (!this.dataset.isInitialised) {
            generateList(this);
        }
    });
});

function UploadToType(e) {
    const button = e.target;
    const ConvertFrom = document.getElementById("ConvertFrom");
    ConvertFrom.textContent = button.textContent;
    
    const inputError = document.getElementById("inputError");
    if (inputError) {
        inputError.textContent = "";
    }
}

function generateList(dropdownElement) {
    dropdownElement.dataset.isInitialised = true;
    const child = dropdownElement.querySelector('.dropdownItems');
    const conversionType = child.id;
    
    fetch(`/get-options?type=${encodeURIComponent(conversionType)}`)
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById(conversionType);
            dropdown.innerHTML = '';
            
            data.filetypes.forEach(option => {
                const button = document.createElement("button");
                button.textContent = option;
                button.addEventListener('click', UploadToType);
                dropdown.appendChild(button);
            });
        })
        .catch(error => console.error('Error loading dropdown options:', error));
}

document.querySelectorAll('.dropdown').forEach(dropdown => {
    let timeoutId;

    dropdown.addEventListener("mouseenter", () => {
        dropdown.classList.add('keep-visible');
        if (timeoutId) clearTimeout(timeoutId);
    });

    dropdown.addEventListener("mouseleave", () => {
        timeoutId = setTimeout(() => {
            dropdown.classList.remove('keep-visible');
        }, 300);
    });
});

