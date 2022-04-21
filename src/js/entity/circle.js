import RectAndCircle from "./rectAndCircle";

export default class Circle extends RectAndCircle {
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