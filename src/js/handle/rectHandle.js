// 矩形
export function rectHandle(ctx, position) {
    const { sizeX, sizeY, startX, startY } = position;
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.strokeRect(startX, startY, sizeX, sizeY);
    ctx.closePath();
}