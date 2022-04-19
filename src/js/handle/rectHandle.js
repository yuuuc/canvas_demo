// 矩形
export function rectHandle(ctx, position) {
    const { sizeX, sizeY, startX, startY } = position;
    ctx.strokeStyle = "gray";
    ctx.setLineDash([]);
    ctx.strokeRect(startX, startY, sizeX, sizeY);
}