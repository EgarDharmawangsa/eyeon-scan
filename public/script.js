const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const buttonDelete = document.getElementById("button-delete");
const video = document.getElementById("video");
const buttonCapture = document.getElementById("button-capture");
const resultLabel = document.getElementById("result-label");
const result = document.getElementById("result");

preview.style.display = "none";
buttonDelete.style.display = "none";
video.style.display = "none"
buttonCapture.style.display = "none"
resultLabel.style.display = "none";
result.style.display = "none";

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            preview.src = reader.result;
            preview.style.display = "block";
            buttonDelete.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

deleteImage = () => {
    imageInput.value = "";
    preview.style.display = "none";
    preview.src = ""
    buttonDelete.style.display = "none";
    resultLabel.style.display = "none";
    result.style.display = "none";
    result.innerText = "";
}

startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.style.display = "block";
            buttonCapture.style.display = "block";
            video.srcObject = stream;
        })
        .catch(() => {
            alert("Gagal mengakses kamera");
        });
}

captureImage = () => {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    preview.src = imageData;
    preview.style.display = "block";
    video.style.display = "none";
    buttonCapture.style.display = "none";
}

scanImage = () => {
    if (!preview.src || preview.src.includes("data:image") === false) {
        alert("Pilih gambar terlebih dahulu!");
    } else {
        Tesseract.recognize(
            preview.src,
            'eng'
        ).then(({ data: { text } }) => {
            resultLabel.style.display = "block";
            result.style.display = "block";
            result.innerText = text;
        }).catch(err => {
            result.style.display = "block";
            result.innerText = err;
        });
    }
};
