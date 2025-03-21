const inputs = document.querySelectorAll("#fileInput, #cameraInput");
const preview = document.getElementById("preview");
const buttonCamera = document.getElementById("button-camera");
const buttonDelete = document.getElementById("button-delete");
const buttonScan = document.getElementById("button-scan");
const resultLabel = document.getElementById("result-label");
const result = document.getElementById("result");

inputs.forEach(input => {
    input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
                [preview, buttonDelete, buttonScan].forEach(el => el.style.display = "block");

                inputs.forEach(otherInput => {
                    if (otherInput !== input) {
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        otherInput.files = dataTransfer.files;
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    });
});

buttonCamera.addEventListener("click", () => inputs[1].click());

buttonDelete.addEventListener("click", () => {
    inputs.forEach(input => input.value = "");
    preview.src = "";
    [preview, buttonDelete, buttonScan, resultLabel, result].forEach(el => el.style.display = "none");
    result.innerText = "";
});

buttonScan.addEventListener("click", () => {
    Tesseract.recognize(preview.src, "eng")
        .then(({ data: { text } }) => {
            [resultLabel, result].forEach(el => el.style.display = "block");
            result.innerText = text;
        })
        .catch(err => result.innerText = err);
});
