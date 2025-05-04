import { isRenderInstance } from "astro/runtime/server/render/common.js";
import { game } from "./portfolio/game";

var canvas = document.getElementById('game-map');
console.log('Canvas loaded', canvas);

canvas.setAttribute('width', 100);
canvas.setAttribute('height', 100);
var context = canvas ? canvas.getContext('2d') : null;

var currentGame;

var requestAnimFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.mozRequestAnimationFrame;

function handleMapLoad(response) {
	console.log('handleMapLoad', response);
    if(response.status == 200) {
        // convert body to JSON object
        //game.initScene(response.body);
    }
}

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
    game.initGame();
    fetch("/assets/map.json").then((data) => handleMapLoad(data))
        .catch(error => {
            console.log("Couldn't load map.json", error);
        });
});
  