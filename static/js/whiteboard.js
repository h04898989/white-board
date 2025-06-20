const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

let drawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#000000';

function drawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    drawLine(lastX, lastY, e.offsetX, e.offsetY);
    [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 顏色選擇功能
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        currentColor = this.getAttribute('data-color');
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});
// 預設選中第一個顏色
document.querySelector('.color-btn').classList.add('selected');

let isEraser = false;

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
        currentColor = "#fff"; // 與 canvas 背景色一致
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        document.querySelectorAll('.eraser-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// 預設選中第一個顏色
document.querySelector('.color-btn').classList.add('selected');