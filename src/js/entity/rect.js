import RectAndCircle from "./rectAndCircle";

export default class Rect extends RectAndCircle {
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