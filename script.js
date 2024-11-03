const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);

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

const handleImageChange = (event) => {
    const [file] = event.target.files;
    if (!file) return;
    const reader = new FileReader();
    const handleFileLoad = (eventReader) => {
        const imageElement = document.createElement("img");
        imageElement.setAttribute('src', eventReader.target.result);
        imageElement.className = "item-image";
        itemsSection().appendChild(imageElement);
    };
    reader.onload = handleFileLoad;
    // readAsDataURL triggers onload function before this line 
    reader.readAsDataURL(file);
};

imageInput().addEventListener("change", (event) => {
    handleImageChange(event);
});

