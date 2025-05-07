import { isRenderInstance } from "astro/runtime/server/render/common.js";
import { game } from "./portfolio/game";

var canvas = document.getElementById('game-map');
console.log('Canvas loaded', canvas);

canvas.setAttribute('width', 800);
canvas.setAttribute('height', 600);
var context = canvas ? canvas.getContext('2d') : null;

var requestAnimFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.mozRequestAnimationFrame;

function initTooltips() {
    // TODO: re-create bootstrap tooltip behaviour
    /*var tooltips = document.querySelector('div[data-toggle="tooltip"]').tooltip({
      title: formatTooltipTitle,
      html: true,
    });*/
}

/*
function formatTooltipTitle() {
  var data = $(this).attr('data-title');
  data = data.replace(/;/g, '<br>');
  return data;
}

function loadResume() {
	window.location = '/slice/index.html';
}

*/

var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}
  
ready(() => { 
    initTooltips();
    game.initGame(context);
});
  