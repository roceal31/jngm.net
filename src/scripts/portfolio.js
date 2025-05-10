import { isRenderInstance } from "astro/runtime/server/render/common.js";
import { game } from "./portfolio/game";

var canvas = document.getElementById('game-map');
console.log('Canvas loaded', canvas);

// TODO: make me dynamic again based on CSS min-width attribute
canvas.setAttribute('width', 1400);
canvas.setAttribute('height', 800);
var context = canvas ? canvas.getContext('2d') : null;

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
  
ready(async () => { 
    initTooltips();
    await game.initGame(context, 0);
});
  