// 矩形临时透明画板

/**
 *
 * @param {} canvas
 * @param {*} ctx
 * @param {*} size
 * @param {*} callback
 */
function rectTempHandle(canvas, ctx, size, callback) {
	const maxWidth = canvas.width;
	const maxHeight = canvas.height;
	let rectObj = null;

	canvas.onmousedown = function (e) {
		let moveX = 0;
		let moveY = 0;
		canvas.onmouseup = function () {
			ctx.clearRect(0, 0, maxWidth, maxHeight);
			ctx.setLineDash([]);
			canvas.onmousemove = null;
			ctx.strokeRect(startX, startY, moveX - startX, moveY - startY);

			rectObj = {
				startX,
				startY,
				sizeX: moveX - startX,
				sizeY: moveY - startY
			};

			callback(rectObj);
		};
		ctx.lineWidth = size;
		ctx.setLineDash([10, 10]);
		const startX = e.offsetX;
		const startY = e.offsetY;

		canvas.onmousemove = function (e) {
			moveX = e.offsetX;
			moveY = e.offsetY;
			ctx.clearRect(0, 0, maxWidth, maxHeight);
			ctx.strokeRect(startX, startY, moveX - startX, moveY - startY);
		};
	};
}

// 画笔
function penHandle(canvas, ctx, size, callback) {
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

function penRender(ctx, pen) {
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.lineTo(pen.x, pen.y);
    ctx.stroke();
}

// 矩形
function rectHandle(ctx, position) {
    const { sizeX, sizeY, startX, startY } = position;
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.strokeRect(startX, startY, sizeX, sizeY);
    ctx.closePath();
}

function circleHandle(ctx, position) {
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

class Pen {
    type = "pen";
    x = 0;
    y = 0;
    isControl = false;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Begin {
    type = "begin";
    constructor() {}
}

class Rect {
	type = 'rect';
	startX = 0;
	startY = 0;
	sizeX = 0;
	sizeY = 0;
	isControl = true;
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

class Circle {
    type = "circle";
    startX = 0;
    startY = 0;
    sizeX = 0;
    sizeY = 0;
    isControl = true;

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

    isChoice(mousePoint) {
        console.log(mousePoint);
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

function createCanvas(root, option) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const eleQueue = [];
    let size = 1;
    let choiceEle = null;

    const { width, height } = option;
    canvas.width = width;
    canvas.height = height;

    const pen = () => {
        eleQueue.push(new Begin());
        let timer = null;
        penHandle(canvas, ctx, size, (position) => {
            if (position != null) {
                const { x, y } = position;
                eleQueue.push(new Pen(x, y));
            } else {
                if (!timer) {
                    timer = setTimeout(() => {
                        eleQueue.push(new Begin());
                    }, 0);
                }
            }
            eventInit();
        });
    };

    const rect = () => {
        createTempCanvas(
            root, {
                width: 600,
                height: 600,
            },
            (position) => {
                const { startX, startY, sizeX, sizeY } = position;
                const formatPosition = new Rect(startX, startY, sizeX, sizeY);
                eleQueue.push(formatPosition);
                console.log(ctx.strokeStyle);
                rectHandle(ctx, formatPosition);
                eventInit();
            }
        );
    };

    const circle = () => {
        createTempCanvas(root, { width: 600, height: 600 }, (position) => {
            const { startX, startY, sizeX, sizeY } = position;
            const formatPosition = new Circle(startX, startY, sizeX, sizeY);
            eleQueue.push(formatPosition);
            circleHandle(ctx, formatPosition);
            eventInit();
        });
    };

    const clearAll = () => {
        ctx.clearRect(0, 0, width, height);
    };

    const exportImg = () => {
        let imgUrl = canvas.toDataURL("image/png");
        let download = document.createElement("a");
        let name = prompt("export name:");
        if (name) {
            download.download = name;
            download.href = imgUrl;
            download.click();
        }
    };
    const importImg = () => {
        let file = document.createElement("input");
        file.type = "file";
        file.click();
        file.onchange = function(e) {
            const render = new FileReader();
            render.readAsDataURL(file.files[0]);
            render.onload = function() {
                const img = new Image();
                img.src = this.result;
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, width, height);
                };
            };
        };
    };

    const show = () => {
        console.log(eleQueue);
    };

    const render = () => {
        clearAll();
        for (let i = 0; i < eleQueue.length; i++) {
            switch (eleQueue[i].type) {
                case "pen":
                    penRender(ctx, eleQueue[i]);
                    break;
                case "begin":
                    ctx.beginPath();
                    break;
                case "rect":
                    rectHandle(ctx, eleQueue[i]);
                    break;
                case "circle":
                    circleHandle(ctx, eleQueue[i]);
                    break;
            }
        }
    };

    const drawBorder = () => {
        render();
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 1;
        const { position, index } = choiceEle;
        const { sizeX, sizeY, startX, startY } = position;
        ctx.setLineDash([10, 10]);
        switch (position.type) {
            case "rect":
                ctx.strokeRect(startX - 10, startY - 10, sizeX + 20, sizeY + 20);
                // rectHandle(ctx, position);
                break;
            case "circle":
                ctx.strokeRect(startX - 10, startY - 10, sizeX + 20, sizeY + 20);
                break;
        }
    };

    const eventInit = () => {
        ctx.strokeStyle = "black";
        ctx.setLineDash([]);
        canvas.onmousedown = function(e) {
            const x = e.offsetX;
            const y = e.offsetY;
            choiceEle = findEle(eleQueue, { x, y });
            if (choiceEle.position) {
                drawBorder();
                const { startX, startY } = choiceEle.position;
                if (choiceEle.position.isChoice({ x, y })) {
                    canvas.onmouseup = function() {
                        canvas.onmousemove = null;
                    };
                    canvas.onmousemove = function(e) {
                        const nowX = e.offsetX;
                        const nowY = e.offsetY;

                        choiceEle.position.startX = startX + nowX - x;
                        choiceEle.position.startY = startY + nowY - y;
                        drawBorder();
                    };
                }
            } else {
                render();
            }
        };
    };

    root.appendChild(canvas);
    return {
        pen,
        rect,
        clearAll,
        circle,
        exportImg,
        importImg,
        show,
        render,
    };
}

function createTempCanvas(root, option, callback) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let size = 1;
    const { width, height } = option;
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = "absolute";
    canvas.style.backgroundColor = "transparent";
    canvas.style.top = 0;
    canvas.style.left = 0;

    rectTempHandle(canvas, ctx, size, (rectObj) => {
        canvas.remove();
        callback(rectObj);
    });
    root.appendChild(canvas);
}

function findEle(eleQueue, position) {
    const { x, y } = position;
    for (let i = eleQueue.length - 1; i >= 0; i--) {
        if (eleQueue[i].isControl && eleQueue[i].isChoice({ x, y })) {
            return { index: i, position: eleQueue[i] };
        }
    }
    return { index: null, position: null };
}

export { createCanvas };
