class RectAndCircle {
    startX = 0;
    startY = 0;
    sizeX = 0;
    sizeY = 0;
    isControl = true;
    lineWidth = 2;
    strokeStyle;
    fillStyle;
    lineDash = [];
    init = false;
    constructor(startX, startY, sizeX, sizeY) {
        if (sizeX <= 0) {
            this.startX = startX + sizeX;
            this.sizeX = -sizeX;
        } else {
            this.sizeX = sizeX;
            this.startX = startX;
        }
        if (sizeY <= 0) {
            this.startY = startY + sizeY;
            this.sizeY = -sizeY;
        } else {
            this.startY = startY;
            this.sizeY = sizeY;
        }
    }

    _init(ctx) {
        if (!this.init) {
            const { lineWidth, strokeStyle, fillStyle } = ctx;
            this.lineWidth = lineWidth;
            this.strokeStyle = strokeStyle;
            this.fillStyle = fillStyle;
            this.init = true;
        }
    }

    isChoice(mousePoint) {
        let flag = false;
        const { x, y } = mousePoint;
        if (
            x >= this.startX &&
            x <= this.startX + this.sizeX &&
            y >= this.startY &&
            y <= this.startY + this.sizeY
        ) {
            flag = true;
        }
        return flag;
    }

    choiceBorder(ctx) {
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 1;
        ctx.setLineDash([10, 10]);
        const { startX, startY, sizeX, sizeY } = this;
        ctx.strokeRect(startX - 10, startY - 10, sizeX + 20, sizeY + 20);
    }

    static handle(canvas, ctx, callback) {
        const maxWidth = canvas.width;
        const maxHeight = canvas.height;

        canvas.onmousedown = function(e) {
            let moveX = 0;
            let moveY = 0;
            canvas.onmouseup = function() {
                ctx.clearRect(0, 0, maxWidth, maxHeight);
                canvas.onmousemove = null;
                ctx.strokeRect(startX, startY, moveX - startX, moveY - startY);

                callback({
                    startX,
                    startY,
                    sizeX: moveX - startX,
                    sizeY: moveY - startY,
                });
            };
            ctx.setLineDash([10, 10]);
            const startX = e.offsetX;
            const startY = e.offsetY;

            canvas.onmousemove = function(e) {
                moveX = e.offsetX;
                moveY = e.offsetY;
                ctx.clearRect(0, 0, maxWidth, maxHeight);
                ctx.strokeRect(startX, startY, moveX - startX, moveY - startY);
            };
        };
    }
}

class Pen {
    type = "pen";
    x;
    y;
    lineWidth = 1;
    strokeStyle;
    lineDash = [];
    isControl = false;
    constructor(x, y, ctx) {
        const { lineWidth, strokeStyle } = ctx;
        this.x = x;
        this.y = y;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
    }

    static handle(canvas, ctx, callback) {
        canvas.onmousedown = function(e) {
            canvas.onmouseup = function() {
                ctx.closePath();
                canvas.onmousedown = null;
                canvas.onmousemove = null;
                callback(null);
            };
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
            callback({ x: e.offsetX, y: e.offsetY });
            canvas.onmousemove = function(e) {
                ctx.lineTo(e.offsetX, e.offsetY);
                callback({ x: e.offsetX, y: e.offsetY });
                ctx.stroke();
            };
        };
    }

    render(ctx) {
        ctx.setLineDash(this.lineDash);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }
}

class Begin {
    type = "begin";
    constructor() {}

    render(ctx) {
        ctx.beginPath();
    }
}

class Rect extends RectAndCircle {
    type = "rect";

    constructor(startX, startY, sizeX, sizeY) {
        super(startX, startY, sizeX, sizeY);
    }

    render(ctx) {
        this._init(ctx);

        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.setLineDash(this.lineDash);
        ctx.beginPath();
        ctx.strokeRect(this.startX, this.startY, this.sizeX, this.sizeY);
        ctx.closePath();
    }
}

class Circle extends RectAndCircle {
    type = "circle";

    constructor(startX, startY, sizeX, sizeY) {
        super(startX, startY, sizeX, sizeY);
    }

    render(ctx) {
        this._init(ctx);

        const halfSX = Math.round(this.sizeX / 2.0);
        const halfSY = Math.round(this.sizeY / 2.0);
        ctx.beginPath();
        ctx.setLineDash(this.lineDash);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.ellipse(
            this.startX + halfSX,
            this.startY + halfSY,
            halfSX,
            halfSY,
            0,
            0,
            Math.PI * 2
        );
        ctx.stroke();
        ctx.closePath();
    }
}

function createTempCanvas(root, option, callback) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const { width, height } = option;
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = "absolute";
    canvas.style.backgroundColor = "transparent";
    canvas.style.top = 0;
    canvas.style.left = 0;

    RectAndCircle.handle(canvas, ctx, (rectObj) => {
        canvas.remove();
        callback(rectObj);
    });
    root.appendChild(canvas);
}

function createCanvas(root, option) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const eleQueue = [];
    let choiceEle = null;

    const { width, height } = option;
    canvas.width = width;
    canvas.height = height;

    const pen = () => {
        eleQueue.push(new Begin());
        let timer = null;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        Pen.handle(canvas, ctx, (position) => {
            if (position != null) {
                const { x, y } = position;
                eleQueue.push(new Pen(x, y, ctx));
            } else {
                if (!timer) {
                    timer = setTimeout(() => {
                        eleQueue.push(new Begin());
                    }, 0);
                }
            }
            eventInit();
        });
    };

    const rect = () => {
        createTempCanvas(
            root, {
                width: width,
                height: height,
            },
            (position) => {
                const { startX, startY, sizeX, sizeY } = position;
                ctx.lineWidth = 2;
                ctx.strokeStyle = "black";
                ctx.setLineDash([]);

                const formatPosition = new Rect(startX, startY, sizeX, sizeY);
                eleQueue.push(formatPosition);
                formatPosition.render(ctx);
                eventInit();
            }
        );
    };

    const circle = () => {
        createTempCanvas(
            root, {
                width: width,
                height: height,
            },
            (position) => {
                const { startX, startY, sizeX, sizeY } = position;
                ctx.lineWidth = 2;
                ctx.strokeStyle = "black";
                ctx.setLineDash([]);
                const formatPosition = new Circle(startX, startY, sizeX, sizeY);
                eleQueue.push(formatPosition);
                formatPosition.render(ctx);
                eventInit();
            }
        );
    };

    const clearAll = () => {
        ctx.clearRect(0, 0, width, height);
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
        for (let i = 0; i < eleQueue.length; i++) {
            eleQueue[i].render(ctx);
        }
    };

    const drawBorder = () => {
        render();
        choiceEle.choiceBorder(ctx);
    };

    const eventInit = () => {
        ctx.strokeStyle = "black";
        ctx.setLineDash([]);
        canvas.onmousedown = function(e) {
            const x = e.offsetX;
            const y = e.offsetY;
            choiceEle = findEle(eleQueue, { x, y });
            if (choiceEle) {
                drawBorder();
                const { startX, startY } = choiceEle;
                canvas.onmouseup = function() {
                    canvas.onmousemove = null;
                };
                canvas.onmousemove = function(e) {
                    const nowX = e.offsetX;
                    const nowY = e.offsetY;
                    choiceEle.startX = startX + nowX - x;
                    choiceEle.startY = startY + nowY - y;
                    drawBorder();
                };
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

function findEle(eleQueue, position) {
    const { x, y } = position;
    for (let i = eleQueue.length - 1; i >= 0; i--) {
        if (eleQueue[i].isControl && eleQueue[i].isChoice({ x, y })) {
            return eleQueue[i];
        }
    }
    return null;
}

var Pea = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createTempCanvas: createTempCanvas,
    createCanvas: createCanvas
});

export { Pea as default };
