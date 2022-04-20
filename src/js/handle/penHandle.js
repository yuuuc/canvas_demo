// 画笔
export function penHandle(canvas, ctx, size, callback) {
    canvas.onmousedown = function(e) {
        canvas.onmouseup = function() {
            ctx.closePath();
            canvas.onmousedown = null;
            canvas.onmousemove = null;

            callback(null);
        };
        ctx.beginPath();
        ctx.lineWidth = size;
        ctx.moveTo(e.offsetX, e.offsetY);
        callback({ x: e.offsetX, y: e.offsetY });
        canvas.onmousemove = function(e) {
            ctx.lineTo(e.offsetX, e.offsetY);
            callback({ x: e.offsetX, y: e.offsetY });
            ctx.stroke();
        };
    };
}

export function penRender(ctx, pen) {
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.lineTo(pen.x, pen.y);
    ctx.stroke();
}