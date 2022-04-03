import { Sprite } from "./sprite";

const canvas = document.querySelector("canvas");
const Canvas2dContext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 768;

Canvas2dContext.fillRect(0, 0, canvas.width, canvas.height);

const player = new Sprite({ x: 0, y: 0 });
console.log(player)
