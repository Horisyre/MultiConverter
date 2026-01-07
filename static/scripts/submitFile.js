document.getElementById("ConvertBtn").addEventListener("click", SubmitFile);

const ConvertFrom = document.getElementById("ConvertFrom");
const path = "/api/SubmitFile";

async function SubmitFile() {
    if (Filename.textContent === "No File Chosen") {
        document.getElementById("inputError").textContent = "Please select a file first";
        return;
    }

    
    const OutputFileType = ConvertFrom.textContent.trim();
    
    if (!OutputFileType || OutputFileType === "Select a format") {
        document.getElementById("inputError").textContent = "Please select a conversion format";
        return;
    }

    const fileName = Input.files[0].name;
    const InputFileType = fileName.slice(fileName.lastIndexOf("."));

    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.classList.add('visible');
    }

    
    const convertBtn = document.getElementById("ConvertBtn");
    convertBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append("file", Input.files[0]);
        formData.append("inputFileType", InputFileType);
        formData.append("OutputFileType", OutputFileType);

        const response = await fetch(path, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
            }

        
        if (!CheckHeaders(response.headers)) {
            console.log(response.headers);
            throw new Error("Invalid headers detected!");
        }

        // Parse the JSON after headers are verified
        const result = await response.json();

        if (checkValidUrl(result.download_url)) { 
            document.getElementById("inputError").textContent = "";
            
            
            const downloadSection = document.querySelector('.download-section');
            const downloadLink = document.querySelector('.download-link');
            
            if (downloadSection && downloadLink) {
                downloadLink.href = result.download_url;
                downloadSection.classList.add('visible');
            }
            console.log("Conversion successful:", result);
        } else {
            const errorMsg = result.error || "Conversion failed. Please try again.";
            document.getElementById("inputError").textContent = errorMsg;
            console.error("Server error:", result);
        }
    } catch (error) {
        document.getElementById("inputError").textContent = "Error sending file: " + error.message;
        console.error("Error sending file:", error);
    } finally {
        if (progressContainer) {
            progressContainer.classList.remove('visible');
        }
        convertBtn.disabled = false;
    }
}

function checkValidUrl(url) { 
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;  
    }   
}

function CheckHeaders(response) {
    if (!response || !response.headers || typeof response.headers.get !== 'function') {
        return false; // invalid response object
    }

    const contentType = response.headers.get('content-type') || '';
    return /^(image|text|audio|video|application\/(pdf|msword|vnd\.openxmlformats-officedocument))/.test(contentType);
}
