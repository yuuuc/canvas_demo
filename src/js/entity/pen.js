export class Pen {
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

export class Begin {
    type = "begin";
    constructor() {}

    render(ctx) {
        ctx.beginPath();
    }
}