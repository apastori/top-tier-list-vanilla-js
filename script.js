const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);

let draggedElement = null;
let sourceContainer = null;

const selector = (selector) => {
    return document.querySelector(selector);
};

const selectorList = (selector) => {
    return document.querySelectorAll(selector);
};

const imageInput = () => {
    return selector("#image-input");
};

const itemsSection = () => {
    return selector("#selector-items");
};

const rowsTier = () => {
    return selectorList(".top-tier-container > .tier-row");
}

console.log(rowsTier());

// Drop and Move Logic for Tier Board
(() => {
    Array.from(rowsTier()).forEach((row) => {
        row.addEventListener("drop", (event) => {
            handleDrop(event);
        });
        row.addEventListener("dragover", (event) => {
            handleDragOver(event);
        });
        row.addEventListener("dragleave", (event) => {
            handleDragLeave(event);
        });
    });
})();

// Drop and Move Logic for Elements Board
(() => {
        const itemSectionEle = itemsSection();
        itemSectionEle.addEventListener("drop", (event) => {
            handleDrop(event);
        });
        itemSectionEle.addEventListener("dragover", (event) => {
            handleDragOver(event);
        });
        itemSectionEle.addEventListener("dragleave", (event) => {
            handleDragLeave(event);
        });
    }
)();

const handleFileLoad = (filePath) => {
    const imageElement = document.createElement("img");
    imageElement.draggable = true;
    imageElement.setAttribute('src', filePath);
    imageElement.className = "item-image";
    imageElement.addEventListener("dragstart", (event) => {
        handleDragStart(event);
    });
    imageElement.addEventListener("dragend", (event) => {
        handleDragEnd(event);
    });
    itemsSection().appendChild(imageElement);
    return imageElement;
};

const handleImageChange = (event) => {
    const [file] = event.target.files;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (eventReader) => {
        handleFileLoad(eventReader.target.result);
    }
    // readAsDataURL triggers onload function before this line 
    reader.readAsDataURL(file);
};

imageInput().addEventListener("change", (event) => {
    handleImageChange(event);
});

function handleDragStart(event) {
    console.log("Drag Start");
    //event.target is image element being dragged
    draggedElement = event.target;
    sourceContainer = draggedElement.parentNode;
    event.dataTransfer.setData('text/plain', draggedElement.src);
};

function handleDragEnd(event) {
    console.log("Drag End");
    draggedElement = null;
    sourceContainer = null;
};

function handleDrop(event) {
    event.preventDefault();
    const { currentTarget, dataTransfer } = event;
    console.log("currentTarget", currentTarget);
    console.log("dataTransfer", dataTransfer);
    if (sourceContainer && draggedElement) {
        sourceContainer.removeChild(draggedElement); 
    }
    if (draggedElement) {
        const src = dataTransfer.getData("text/plain");
        const imageElement = handleFileLoad(src);
        currentTarget.appendChild(imageElement);
    }
    currentTarget.classList.remove("drag-over");
    currentTarget.querySelector('.drag-preview')?.remove()
};

function handleDragOver(event) {
    event.preventDefault();
    const { currentTarget, dataTransfer } = event;
    if (sourceContainer === currentTarget) return;
    currentTarget.classList.add("drag-over");
    const dragPreview = document.querySelector(".drag-preview");
    if (draggedElement && !dragPreview) {
        const previewElement = draggedElement.cloneNode(true);
        previewElement.classList.add("drag-preview");
        currentTarget.appendChild(previewElement)
    }
};

function handleDragLeave(event) {
    event.preventDefault();
    const { currentTarget } = event;
    currentTarget.classList.remove("drag-over");
    currentTarget.querySelector('.drag-preview')?.remove()
};

