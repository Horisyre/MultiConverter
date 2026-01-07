const InputArea = document.getElementById('inputBox');
const Input = document.getElementById('FileInput');
const Filename = document.getElementById('FileName');
const Right = document.getElementById('right');

InputArea.addEventListener('click', function() {
    Input.click();
});

Input.addEventListener('change', function() {
    if (Input.files.length > 0) {
        Filename.textContent = Input.files[0].name;
        Right.classList.add('visible');
    } else {
        Filename.textContent = "No File Chosen";
        Right.classList.remove('visible');
    }
});