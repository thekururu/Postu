const form = document.getElementById('staffForm');
const steps = document.querySelectorAll('.step');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
let currentStep = 0;

function showStep(n) {
    steps.forEach((step, i) => step.classList.remove('active'));
    steps[n].classList.add('active');
    prevBtn.style.display = n === 0 ? 'none' : 'inline-block';
    nextBtn.textContent = n === steps.length - 1 ? 'Enviar' : 'Siguiente';
}

nextBtn.addEventListener('click', () => {
    if (!validateStep()) return;
    if (currentStep === steps.length - 1) {
        sendForm();
    } else {
        currentStep++;
        showStep(currentStep);
    }
});

prevBtn.addEventListener('click', () => {
    currentStep--;
    showStep(currentStep);
});

function validateStep() {
    const inputs = steps[currentStep].querySelectorAll('input, textarea');
    for (let input of inputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            return false;
        }
    }
    return true;
}

showStep(currentStep);

// Enviar al webhook con embed rojo
async function sendForm() {
    const formData = new FormData(form);
    let fields = [];
    formData.forEach((value, key) => {
        fields.push({ name: key, value: value.toString() || "No especificado", inline: false });
    });

    const webhookURL = "https://discord.com/api/webhooks/1462958027945672896/5MGtV3UO8DMcbO91b3LVjF4CTuyqTbKNbgmdvdLTya8woyEG6TcCOMGzaZ6CVtGhDBDK";

    try {
        await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                embeds: [{
                    title: "Nueva postulación de staff",
                    color: 16711680, // rojo
                    fields: fields,
                    timestamp: new Date()
                }]
            })
        });
        alert("Formulario enviado correctamente!");
        form.reset();
        currentStep = 0;
        showStep(currentStep);
    } catch (err) {
        alert("Error al enviar el formulario.");
        console.error(err);
    }
}