// 矩形临时透明画板

/**
 *
 * @param {} canvas
 * @param {*} ctx
 * @param {*} size
 * @param {*} callback
 */
export default function rectTempHandle(canvas, ctx, size, callback) {
    const maxWidth = canvas.width;
    const maxHeight = canvas.height;
    let rectObj = null;

    canvas.onmousedown = function(e) {
        let moveX = 0;
        let moveY = 0;
        canvas.onmouseup = function() {
            ctx.clearRect(0, 0, maxWidth, maxHeight);
            ctx.setLineDash([]);
            canvas.onmousemove = null;
            ctx.strokeRect(startX, startY, moveX - startX, moveY - startY);

            rectObj = {
                startX,
                startY,
                sizeX: moveX - startX,
                sizeY: moveY - startY,
            };

            callback(rectObj);
        };
        ctx.lineWidth = size;
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