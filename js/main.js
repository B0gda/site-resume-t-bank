document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.getElementById("download-btn");
  downloadBtn.addEventListener("click", async function () {
    downloadBtn.disabled = true;
    downloadBtn.style.display = "none";
    downloadBtn.classList.add("loading");
    const homeTag = document.querySelector(".home-tag");
    if (homeTag) {
      homeTag.style.marginBottom = "-1px";
    }
    try {
      const canvas = await html2canvas(document.body);
      const imgData = canvas.toDataURL("image/png");

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();

      const scale = 1.4;

      const originalWidth = 400;
      const originalHeight = (canvas.height / canvas.width) * originalWidth;

      const scaledWidth = originalWidth * scale;
      const scaledHeight = originalHeight * scale;

      pdf.addImage(imgData, "PNG", -176, -5, scaledWidth, scaledHeight);

      pdf.save("resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.classList.remove("loading");
      downloadBtn.style.display = "block";
      const homeTag = document.querySelector(".home-tag");
      homeTag.style.marginBottom = "-6px";
    }
  });
});

document.getElementById("zoom-in").addEventListener("click", function () {
  document.body.style.zoom = (
    parseFloat(getComputedStyle(document.body).zoom || 1) + 0.1
  ).toString();
});

document.getElementById("zoom-out").addEventListener("click", function () {
  document.body.style.zoom = (
    parseFloat(getComputedStyle(document.body).zoom || 1) - 0.1
  ).toString();
});

document.getElementById("scroll-up").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
let currentTextElement = null;
const editableTexts = document.querySelectorAll(".editable-text");
const modal = document.getElementById("modal");
const textInput = document.getElementById("text-input");
const saveButton = document.getElementById("save-button");

const initializeLocalStorage = () => {
  editableTexts.forEach((textElement) => {
    const savedText = localStorage.getItem(textElement.id);
    if (savedText === null) {
      localStorage.setItem(textElement.id, textElement.innerText);
    }
  });
};

const loadTextsFromLocalStorage = () => {
  editableTexts.forEach((textElement) => {
    const savedText = localStorage.getItem(textElement.id);
    if (savedText !== null) {
      textElement.innerText = savedText;
    }
    textElement.classList.add("visible");
  });
};

const saveTextToLocalStorage = (element) => {
  localStorage.setItem(element.id, element.innerText);
};

const openModal = (element) => {
  currentTextElement = element;
  textInput.value = element.innerText;
  modal.style.display = "flex";
  textInput.focus();
};

const applyRippleEffect = (element) => {
  element.classList.add("ripple-effect");
  setTimeout(() => {
    element.classList.remove("ripple-effect");
  }, 3000);
};

editableTexts.forEach((textElement) => {
  textElement.addEventListener("click", () => openModal(textElement));
});

saveButton.addEventListener("click", () => {
  if (currentTextElement) {
    currentTextElement.innerText = textInput.value;
    saveTextToLocalStorage(currentTextElement);
    modal.style.display = "none";
    applyRippleEffect(currentTextElement);
    currentTextElement = null;
  }
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
    currentTextElement = null;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initializeLocalStorage();
  loadTextsFromLocalStorage();
});
