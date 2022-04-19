import rectTempHandle from "./js/temp/tempHandle.js";
import { penHandle, penRender } from "./js/handle/penHandle";
import { rectHandle } from "./js/handle/rectHandle";
import circleHandle from "./js/handle/circleHandle.js";
import Pen from "./js/entity/pen.js";
import { Begin } from "./js/entity/common.js";
import Rect from "./js/entity/rect.js";
import choiceHandle from "./js/handle/choiceHandle.js";
import Circle from "./js/entity/circle.js";

export function createCanvas(root, option) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const eleQueue = [];
    let size = 1;
    let choiceEle = null;

    const { width, height } = option;
    canvas.width = width;
    canvas.height = height;
    canvas.style.border = "1px solid gray";
    const pen = () =>
        penHandle(canvas, ctx, size, (position) => {
            if (position != null) {
                const { x, y } = position;
                eleQueue.push(new Pen(x, y));
            } else {
                eleQueue.push(new Begin());
            }
        });
    const rect = () => {
        createTempCanvas(
            root, {
                width: 600,
                height: 600,
            },
            (position) => {
                const { startX, startY, sizeX, sizeY } = position;
                eleQueue.push(new Rect(startX, startY, sizeX, sizeY));
                rectHandle(ctx, position);
                eventInit(canvas, eleQueue);
            }
        );
    };

    const clearAll = () => {
        ctx.clearRect(0, 0, width, height);
    };
    const circle = () => {
        createTempCanvas(root, { width: 600, height: 600 }, (position) => {
            const { startX, startY, sizeX, sizeY } = position;
            eleQueue.push(new Circle(startX, startY, sizeX, sizeY));
            circleHandle(ctx, position);
            eventInit(canvas, eleQueue);
        });
    };
    const exportImg = () => {
        let imgUrl = canvas.toDataURL("image/png");
        let download = document.createElement("a");
        let name = prompt("export name:");
        if (name) {
            download.download = name;
            download.href = imgUrl;
            download.click();
        }
    };
    const importImg = () => {
        let file = document.createElement("input");
        file.type = "file";
        file.click();
        file.onchange = function(e) {
            const render = new FileReader();
            render.readAsDataURL(file.files[0]);
            render.onload = function() {
                const img = new Image();
                img.src = this.result;
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, width, height);
                };
            };
        };
    };

    const show = () => {
        console.log(eleQueue);
    };

    const render = () => {
        clearAll();
        ctx.setLineDash([]);
        ctx.strokeStyle = "black";
        ctx.beginPath();
        for (let i = 0; i < eleQueue.length; i++) {
            switch (eleQueue[i].type) {
                case "pen":
                    penRender(ctx, eleQueue[i]);
                    break;
                case "begin":
                    ctx.beginPath();
                    break;
                case "rect":
                    rectHandle(ctx, eleQueue[i]);
                    break;
                case "circle":
                    circleHandle(ctx, eleQueue[i]);
                    break;
                default:
            }
        }
    };

    const drawBorder = () => {
        render();
        ctx.strokeStyle = "blue";
        const { position, index } = choiceEle;
        const { sizeX, sizeY, startX, startY } = position;
        ctx.setLineDash([10, 10]);
        switch (position.type) {
            case "rect":
                ctx.strokeRect(startX - 10, startY - 10, sizeX + 20, sizeY + 20);
                rectHandle(ctx, position);
                break;
            case "circle":
                ctx.strokeRect(startX - 10, startY - 10, sizeX + 20, sizeY + 20);
                break;
            default:
        }
    };

    const eventInit = () => {
        canvas.onmousedown = function(e) {
            const x = e.offsetX;
            const y = e.offsetY;
            choiceEle = findEle(eleQueue, { x, y });
            if (choiceEle.position) {
                drawBorder();
                const { startX, startY } = choiceEle.position;
                if (choiceEle.position.isChoice({ x, y })) {
                    canvas.onmouseup = function() {
                        canvas.onmousemove = null;
                    };
                    canvas.onmousemove = function(e) {
                        const nowX = e.offsetX;
                        const nowY = e.offsetY;

                        choiceEle.position.startX = startX + nowX - x;
                        choiceEle.position.startY = startY + nowY - y;
                        drawBorder();
                    };
                }
            } else {
                render();
            }
        };
    };

    root.appendChild(canvas);
    return {
        pen,
        rect,
        clearAll,
        circle,
        exportImg,
        importImg,
        show,
        render,
    };
}

function createTempCanvas(root, option, callback) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let size = 1;
    const { width, height } = option;
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = "absolute";
    canvas.style.backgroundColor = "transparent";
    canvas.style.top = 0;
    canvas.style.left = 0;

    rectTempHandle(canvas, ctx, size, (rectObj) => {
        canvas.remove();
        callback(rectObj);
    });
    root.appendChild(canvas);
}

function findEle(eleQueue, position) {
    const { x, y } = position;
    for (let i = eleQueue.length - 1; i >= 0; i--) {
        if (eleQueue[i].isControl && eleQueue[i].isChoice({ x, y })) {
            return { index: i, position: eleQueue[i] };
        }
    }
    return { index: null, position: null };
}