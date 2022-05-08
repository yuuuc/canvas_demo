import RectAndCircle from '../entity/rectAndCircle'
import { Pen, Begin } from '../entity/pen.js'
import Rect from '../entity/rect.js'
import Circle from '../entity/circle.js'

export function createTempCanvas(root, option, callback) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const { width, height } = option
  canvas.width = width
  canvas.height = height
  canvas.style.position = 'absolute'
  canvas.style.backgroundColor = 'transparent'
  canvas.style.top = 0
  canvas.style.left = 0

  RectAndCircle.handle(canvas, ctx, (rectObj) => {
    canvas.remove()
    callback(rectObj)
  })
  root.appendChild(canvas)
}

export function createCanvas(root, option) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const eleQueue = []
  let choiceEle = null

  const { width, height } = option
  canvas.width = width
  canvas.height = height

  const pen = () => {
    eleQueue.push(new Begin())
    let timer = null
    ctx.lineWidth = 1
    ctx.strokeStyle = 'black'
    Pen.handle(canvas, ctx, (position) => {
      if (position != null) {
        const { x, y } = position
        eleQueue.push(new Pen(x, y, ctx))
      } else {
        if (!timer) {
          timer = setTimeout(() => {
            eleQueue.push(new Begin())
          }, 0)
        }
      }
      eventInit(canvas, eleQueue)
    })
  }

  const rect = () => {
    createTempCanvas(
      root,
      {
        width: width,
        height: height
      },
      (position) => {
        const { startX, startY, sizeX, sizeY } = position
        ctx.lineWidth = 2
        ctx.strokeStyle = 'black'
        ctx.setLineDash([])

        const formatPosition = new Rect(startX, startY, sizeX, sizeY)
        eleQueue.push(formatPosition)
        formatPosition.render(ctx)
        eventInit(canvas, eleQueue)
      }
    )
  }

  const circle = () => {
    createTempCanvas(
      root,
      {
        width: width,
        height: height
      },
      (position) => {
        const { startX, startY, sizeX, sizeY } = position
        ctx.lineWidth = 2
        ctx.strokeStyle = 'black'
        ctx.setLineDash([])
        const formatPosition = new Circle(startX, startY, sizeX, sizeY)
        eleQueue.push(formatPosition)
        formatPosition.render(ctx)
        eventInit(canvas, eleQueue)
      }
    )
  }

  const clearCanvas = () => {
    ctx.clearRect(0, 0, width, height)
    eleQueue.length = 0
  }
  const clearAll = () => {
    ctx.clearRect(0, 0, width, height)
  }

  const exportImg = () => {
    let imgUrl = canvas.toDataURL('image/png')
    let download = document.createElement('a')
    let name = prompt('export name:')
    if (name) {
      download.download = name
      download.href = imgUrl
      download.click()
    }
  }
  const importImg = () => {
    let file = document.createElement('input')
    file.type = 'file'
    file.click()
    file.onchange = function (e) {
      const render = new FileReader()
      render.readAsDataURL(file.files[0])
      render.onload = function () {
        const img = new Image()
        img.src = this.result
        img.onload = function () {
          ctx.drawImage(img, 0, 0, width, height)
        }
      }
    }
  }

  const show = () => {
    console.log(eleQueue)
  }

  const render = () => {
    clearAll()
    for (let i = 0; i < eleQueue.length; i++) {
      eleQueue[i].render(ctx)
    }
  }

  const drawBorder = () => {
    render()
    choiceEle.choiceBorder(ctx)
  }

  const eventInit = () => {
    ctx.strokeStyle = 'black'
    ctx.setLineDash([])
    canvas.onmousedown = function (e) {
      const x = e.offsetX
      const y = e.offsetY
      choiceEle = findEle(eleQueue, { x, y })
      if (choiceEle) {
        drawBorder()
        const { startX, startY } = choiceEle
        canvas.onmouseup = function () {
          canvas.onmousemove = null
        }
        canvas.onmousemove = function (e) {
          const nowX = e.offsetX
          const nowY = e.offsetY
          choiceEle.startX = startX + nowX - x
          choiceEle.startY = startY + nowY - y
          drawBorder()
        }
      } else {
        render()
      }
    }
  }

  root.appendChild(canvas)

  return {
    pen,
    rect,
    clearAll,
    circle,
    exportImg,
    importImg,
    show,
    render,
    clearCanvas
  }
}

function findEle(eleQueue, position) {
  const { x, y } = position
  for (let i = eleQueue.length - 1; i >= 0; i--) {
    if (eleQueue[i].isControl && eleQueue[i].isChoice({ x, y })) {
      return eleQueue[i]
    }
  }
  return null
}
