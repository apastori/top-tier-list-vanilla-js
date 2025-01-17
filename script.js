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

const tier = () => {
    return selector(".top-tier-container");
}

const rowsTier = () => {
    return selectorList(".top-tier-container > .tier-row");
};

const resetButton = () => {
    return selector("#reset-tier-button");
};

const saveButton = () => {
    return selector("#save-tier-button");
}

const deleteButton = () => {
    return selector("#delete-items-button");
}

const defaultButton = () => {
    return selector("#default-tier-button");
}

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
    itemSectionEle.addEventListener('drop', (event) => {
        handleDropFromDesktop(event);
    });
    itemSectionEle.addEventListener('dragover', (event) => {
        handleDragOverFromDesktop(event);
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

const useFilesToCreateItems = (files) => {
    if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (eventReader) => {
                handleFileLoad(eventReader.target.result);
            }
            // readAsDataURL triggers onload function before this line 
            reader.readAsDataURL(file);
        });
    }
}

const handleImageChange = (event) => {
    const { files } = event.target;
    useFilesToCreateItems(files);
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
    itemsSection().classList.remove("drag-files");
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

resetButton().addEventListener("click", () => {
    resetButtonHandler();
});

saveButton().addEventListener("click", () => {
    saveButtonHandler();
});

deleteButton().addEventListener("click", () => {
    deleteButtonHandler();
});

defaultButton().addEventListener("click", () => {
    defaultImages();
})

function resetButtonHandler() {
    const itemImages = tier().getElementsByClassName("item-image");
    Array.from(itemImages).forEach((item) => {
        item.remove();
        itemsSection().appendChild(item);
    });
}

function saveButtonHandler() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    import('https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/+esm')
        .then(({ default: html2canvas }) => {
          html2canvas(tier(), { backgroundColor: null }).then(canvas => {
            context.drawImage(canvas, 0, 0)
            const imgURL = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.download = 'tier.png'
            downloadLink.href = imgURL
            downloadLink.click()
        });
    });
}

function deleteButtonHandler() {
    const itemSection = itemsSection();
    const images = itemSection.getElementsByTagName('img');
    while (images.length > 0) {
        itemSection.removeChild(images[0]);
    }
}

function handleDragOverFromDesktop(event) {
    event.preventDefault();
    const { currentTarget, dataTransfer} = event;
    if (dataTransfer.types.includes('Files')) {
        currentTarget.classList.add("drag-files");
    }
}

function handleDropFromDesktop(event) {
    event.preventDefault();
    const { currentTarget, dataTransfer} = event;
    if (dataTransfer.types.includes('Files')) {
        currentTarget.classList.remove("drag-files");
        const { files } = dataTransfer
        useFilesToCreateItems(files)
    }
    //itemsSection().classList.remove("drag-files");
}

function defaultImages() {
    deleteButtonHandler();
    languages.forEach((language) => {
        let languagePath;
        language !== "Python" && language !== "Go" ? 
            languagePath = `./images/${language}.png`
            : languagePath = `./images/${language}.jpg`
        handleFileLoad(languagePath);
    }); 
}
