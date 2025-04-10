// Aquí ponemos el link de tu modelo exportado desde Teachable Machine
const URL = "./my_model/";  // Asegúrate de que tu modelo esté en la carpeta "my_model"

let model, maxPredictions;

// Cargar el modelo de Teachable Machine
async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// Función para cargar la imagen seleccionada por el usuario
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                // Mostrar la imagen subida
                const imageContainer = document.getElementById("imageContainer");
                imageContainer.innerHTML = "";
                imageContainer.appendChild(img);

                // Hacer la predicción
                predict(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Predecir el tipo de herida usando el modelo
async function predict(img) {
    const prediction = await model.predict(img);
    const labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ""; // Limpiar cualquier predicción anterior

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.appendChild(document.createElement("div")).innerHTML = classPrediction;
    }

    // Mostrar recomendaciones basadas en la predicción
    displayRecomendation(prediction);
}

// Función para mostrar recomendaciones según la predicción
function displayRecomendation(prediction) {
    const highestPrediction = prediction[0]; // La predicción con mayor probabilidad
    const recommendationElement = document.getElementById("recomendaciones");

    // Mostrar recomendaciones dependiendo de la clase de la herida
    let recommendationText = "";
    switch (highestPrediction.className) {
        case "Herida superficial":
            recommendationText = "Recomendación: Limpiar la herida con agua y jabón, aplicar un antiséptico y cubrir con un vendaje.";
            break;
        case "Herida profunda":
            recommendationText = "Recomendación: Buscar atención médica inmediatamente, ya que puede requerir puntos de sutura.";
            break;
        case "Quemadura leve":
            recommendationText = "Recomendación: Enfriar con agua fría, aplicar una pomada para quemaduras y cubrir con un apósito estéril.";
            break;
        case "Quemadura grave":
            recommendationText = "Recomendación: Buscar atención médica urgente, ya que se necesita tratamiento especializado.";
            break;
        default:
            recommendationText = "No se pudo identificar la herida. Intenta nuevamente.";
            break;
    }

    recommendationElement.innerHTML = recommendationText;
}

// Cargar el modelo cuando la página se cargue
window.onload = loadModel;
