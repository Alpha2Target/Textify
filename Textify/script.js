let selectedTextBox = null;
let history = [];
let historyIndex = -1;

function makeMovable(element) {
    let offsetX, offsetY;

    element.onmousedown = function (e) {
        e.preventDefault();
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;

        document.onmousemove = function (e) {
            e.preventDefault();
            element.style.left = e.clientX - offsetX + 'px';
            element.style.top = e.clientY - offsetY + 'px';
        };

        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    element.ondblclick = function () {
        if (selectedTextBox) selectedTextBox.contentEditable = false;
        selectedTextBox = element;
        element.contentEditable = true;
        element.style.cursor = 'text';
    };
}

addTextBtn.onclick = function () {
    const newText = document.createElement('div');
    newText.contentEditable = true;
    newText.className = 'movable-text';
    newText.innerText = 'Edit me!';
    textArea.appendChild(newText);
    makeMovable(newText);
    saveState();
};

function saveState() {
    history = history.slice(0, historyIndex + 1);
    const state = {
        content: textArea.innerHTML,
        elements: Array.from(document.querySelectorAll('.movable-text')).map(element => ({
            text: element.innerText,
            styles: {
                fontFamily: element.style.fontFamily,
                fontSize: element.style.fontSize,
                fontWeight: element.style.fontWeight,
                fontStyle: element.style.fontStyle,
                textAlign: element.style.textAlign,
                textDecoration: element.style.textDecoration,
                position: { left: element.style.left, top: element.style.top }
            }
        }))
    };
    history.push(state);
    historyIndex++;
}

function restoreState(state) {
    textArea.innerHTML = state.content;
    const elements = Array.from(document.querySelectorAll('.movable-text'));
    state.elements.forEach((data, index) => {
        const element = elements[index];
        element.innerText = data.text;
        element.style.fontFamily = data.styles.fontFamily;
        element.style.fontSize = data.styles.fontSize;
        element.style.fontWeight = data.styles.fontWeight;
        element.style.fontStyle = data.styles.fontStyle;
        element.style.textAlign = data.styles.textAlign;
        element.style.textDecoration = data.styles.textDecoration;
        element.style.left = data.styles.position.left;
        element.style.top = data.styles.position.top;
        makeMovable(element);
    });
}

undoBtn.onclick = function () {
    if (historyIndex > 0) {
        historyIndex--;
        restoreState(history[historyIndex]);
    }
};

redoBtn.onclick = function () {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        restoreState(history[historyIndex]);
    }
};

document.getElementById('fontSelector').onchange = function () {
    const selectedFont = this.value;
    if (selectedTextBox) selectedTextBox.style.fontFamily = selectedFont;
};

document.getElementById('fontSizeSelector').onchange = function () {
    const selectedSize = this.value;
    if (selectedTextBox) selectedTextBox.style.fontSize = selectedSize;
};

document.getElementById('boldBtn').onclick = function () {
    if (selectedTextBox) selectedTextBox.style.fontWeight = selectedTextBox.style.fontWeight === 'bold' ? 'normal' : 'bold';
};

document.getElementById('italicBtn').onclick = function () {
    if (selectedTextBox) selectedTextBox.style.fontStyle = selectedTextBox.style.fontStyle === 'italic' ? 'normal' : 'italic';
};

document.getElementById('justifyBtn').onclick = function () {
    if (selectedTextBox) selectedTextBox.style.textAlign = selectedTextBox.style.textAlign === 'justify' ? 'left' : 'justify';
};

document.getElementById('strikeBtn').onclick = function () {
    if (selectedTextBox) selectedTextBox.style.textDecoration = selectedTextBox.style.textDecoration === 'line-through' ? 'none' : 'line-through';
};

document.getElementById('textArea').onclick = function (e) {
    if (e.target.id === 'textArea' && selectedTextBox) {
        selectedTextBox.contentEditable = true;
        selectedTextBox = null;
    }
};
