export default class Rect {
    type = "rect";
    startX = 0;
    startY = 0;
    sizeX = 0;
    sizeY = 0;
    isControl = true;
    constructor(startX, startY, sizeX, sizeY) {
        this.startX = startX;
        this.startY = startY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
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
}