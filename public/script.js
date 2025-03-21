const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const buttonDelete = document.getElementById("button-delete");
const buttonCamera = document.getElementById("button-camera");
const video = document.getElementById("video");
const buttonCapture = document.getElementById("button-capture");
const resultLabel = document.getElementById("result-label");
const result = document.getElementById("result");
const canvas = document.createElement("canvas");

let stream = null;

preview.style.display = "none";
buttonDelete.style.display = "none";
video.style.display = "none";
buttonCapture.style.display = "none";
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

const deleteImage = () => {
    imageInput.value = "";
    preview.style.display = "none";
    preview.src = "";
    buttonDelete.style.display = "none";
    resultLabel.style.display = "none";
    result.style.display = "none";
    result.innerText = "";
};

const toggleCamera = async () => {
    if (stream) {
        stopCamera();
    } else {
        await startCamera();
    }
};

const startCamera = async () => {
    try {
        if (stream) return;

        const devices = await navigator.mediaDevices.enumerateDevices();
        let videoConstraints = { facingMode: "user" };
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        if (isMobile) {
            const backCamera = devices.find(device =>
                device.kind === "videoinput" && device.label.toLowerCase().includes("back")
            );
            if (backCamera) {
                videoConstraints = { deviceId: { exact: backCamera.deviceId } };
            } else {
                videoConstraints = { facingMode: "environment" };
            }
        }

        stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        video.srcObject = stream;
        video.style.display = "block";
        buttonCapture.style.display = "block";
        buttonCamera.innerText = "Close Camera";
    } catch (error) {
        alert("Gagal mengakses kamera");
    }
};

const stopCamera = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    video.style.display = "none";
    buttonCapture.style.display = "none";
    buttonCamera.innerText = "Open Camera";
};

buttonCamera.addEventListener("click", toggleCamera);

const captureImage = () => {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    preview.src = canvas.toDataURL("image/png");
    preview.style.display = "block";
    buttonDelete.style.display = "block";

    stopCamera();
};

buttonCapture.addEventListener("click", captureImage);

const scanImage = () => {
    if (!preview.src || !preview.src.startsWith("data:image")) {
        alert("Pilih gambar terlebih dahulu!");
        return;
    }

    Tesseract.recognize(preview.src, "eng")
        .then(({ data: { text } }) => {
            resultLabel.style.display = "block";
            result.style.display = "block";
            result.innerText = text;
        })
        .catch(err => {
            result.style.display = "block";
            result.innerText = err;
        });
};
