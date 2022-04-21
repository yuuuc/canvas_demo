export default class RectAndCircle {
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