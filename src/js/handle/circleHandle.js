export default function circleHandle(ctx, position) {
    const { sizeX, sizeY, startX, startY } = position;
    const halfSX = Math.round(sizeX / 2.0);
    const halfSY = Math.round(sizeY / 2.0);
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.ellipse(
        startX + halfSX,
        startY + halfSY,
        halfSX,
        halfSY,
        0,
        0,
        Math.PI * 2
    );
    ctx.stroke();

    ctx.closePath();

    // console.log(position);
    // ctx.ellipse(0, 0, 300, 200, 300, 300, Math.PI * 2);
    // ctx.stroke();
}