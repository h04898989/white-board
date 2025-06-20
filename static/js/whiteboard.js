const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const socket = io();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#000000';
let brushSize = 2;
let isEraser = false;

// 縮放相關
let scale = 1.0;
const scaleStep = 0.1;
const minScale = 0.1;
const maxScale = 10.0;
let offsetX = 0;
let offsetY = 0;

// 格線設定
const baseGridSize = 40; // 每格 40px

// 用來儲存所有線條
let lines = [];
let currentLine = null;

// 畫格線
function drawGrid() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath();
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    const gridSize = baseGridSize * scale;
    const startX = offsetX % gridSize;
    const startY = offsetY % gridSize;
    for (let x = startX; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = startY; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
    ctx.restore();
}

// 重繪所有內容（格線+所有線條）
function redrawAll() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 畫所有線條（帶 transform）
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    for (const line of lines) {
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);
        for (let i = 1; i < line.points.length; i++) {
            ctx.lineTo(line.points[i].x, line.points[i].y);
        }
        ctx.stroke();
    }
    ctx.restore();

    // 最後畫格線，永遠在最上層
    drawGrid();
}

// 畫一條線並存下來
function drawLine(x1, y1, x2, y2) {
    lines.push({
        x1, y1, x2, y2,
        color: currentColor,
        size: brushSize
    });
    redrawAll();
}

// 滑鼠事件座標轉換（螢幕座標轉canvas座標）
function toCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offsetX) / scale;
    const y = (e.clientY - rect.top - offsetY) / scale;
    return { x, y };
}

// 滑鼠事件
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    const pt = toCanvasCoords(e);
    currentLine = {
        color: currentColor,
        size: brushSize,
        points: [pt]
    };
    lines.push(currentLine);
});
canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const pt = toCanvasCoords(e);
    currentLine.points.push(pt);
    redrawAll();
});
canvas.addEventListener('mouseup', () => {
    drawing = false;
    currentLine = null;
});
canvas.addEventListener('mouseleave', () => {
    drawing = false;
    currentLine = null;
});

// 清除畫布
document.getElementById('clear').addEventListener('click', () => {
    lines = [];
    redrawAll();
});

// 顏色選擇
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        isEraser = false;
        currentColor = this.getAttribute('data-color');
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        document.querySelectorAll('.eraser-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});
document.querySelectorAll('.eraser-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        isEraser = true;
        currentColor = "#fff";
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        document.querySelectorAll('.eraser-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});
document.querySelector('.color-btn').classList.add('selected');

// 畫筆粗細調整
const brushSizeInput = document.getElementById('brush-size');
const brushSizeValue = document.getElementById('brush-size-value');
brushSizeInput.addEventListener('input', function() {
    brushSize = parseInt(this.value, 10);
    brushSizeValue.textContent = this.value;
});

// 滾輪縮放（以滑鼠為中心）
canvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - offsetX) / scale;
    const mouseY = (e.clientY - rect.top - offsetY) / scale;

    let newScale = scale;
    if (e.deltaY < 0) {
        newScale = Math.min(scale + scaleStep, maxScale);
    } else {
        newScale = Math.max(scale - scaleStep, minScale);
    }

    // 以滑鼠為中心縮放時，調整 offset
    offsetX -= (mouseX * newScale - mouseX * scale);
    offsetY -= (mouseY * newScale - mouseY * scale);

    scale = newScale;
    redrawAll();
}, { passive: false });

// 初始繪製
redrawAll();

// 視窗大小改變時重繪
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawAll();
});

// 當本地畫線時，送出線條資料給 server
canvas.addEventListener('mouseup', () => {
    drawing = false;
    if (currentLine && currentLine.points.length > 1) {
        socket.emit('draw_line', currentLine);
    }
    currentLine = null;
});

// 接收其他使用者畫的線條
socket.on('draw_line', function(line) {
    lines.push(line);
    redrawAll();
});