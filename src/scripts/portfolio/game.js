import { adventurer } from "./adventurer";
import { hexGrid } from "./map";

const game = {
    loader: null,
    context: null,
    currentGame: null,

    // Main game  object factory function
    createGame: function (settings) {
        var gameObj = {
            grid: {},
            adventurer: {},
            console: {},
            log: {},
            context: settings.context,

            init: function (initMessage, mapZones, mapArray) {
                //console.log('init game with context', this.context);
                this.console = document.querySelector('#game-console');
                this.log = document.querySelector('#game-log');
                this.log.innerHtml += '<p>' + initMessage + '</p>';

                this.grid = hexGrid( this.context );
                this.grid.init(mapZones, mapArray);

                this.adventurer = adventurer({
                    context: this.context,
                    position: this.grid.hexTiles[20][5],
                    grid: this.grid,
                });
                this.adventurer.init();
            },

            logMessage: function (message) {
                var currentLog = this.log.html();
                this.log.html(currentLog + '<p>' + message + '</p>');
            },

            updateGame: function () {
                this.adventurer.clear();
                this.adventurer.update();
                this.grid.refreshTiles(this.adventurer.position);
                this.adventurer.render();
            },

        };

        return gameObj;
    },

    loadGame: async function () {
        this.loader.style.display = 'none';
        document.documentElement.removeEventListener('keydown', this.handleLoadingKeypress);
        await loadMapFile();
    },

    initGame: function (context) {
        this.loader = document.querySelector('#loading-screen');
        this.context = context;
        if (this.loader && !this.loader.checkVisibility()) {
            this.loader.style.display = 'block';
            document.documentElement.addEventListener('keydown', this.handleLoadingKeypress);
        }
    },

    initScene: function (mapZones, mapArray) {
        //console.log('initScene', mapArray);
        this.context.canvas.style.display = 'block';
        this.currentGame = this.createGame({
            context: this.context
        });
    
        this.currentGame.init('You find yourself standing at a dusty crossroads. Five paths '+
            'stretch away into the distance. You suppose you must choose a direction ' +
            'and start moving. Adventure isn\'t going to find itself!', mapZones, mapArray);
        
        document.documentElement.addEventListener('keydown', this.handleGameKeypress);    
        this.gameLoop();
    },
    
    gameLoop: function gameLoop() {
        if(game.currentGame) {
            game.currentGame.updateGame();
            window.requestAnimationFrame(game.gameLoop);
        }
    },

    handleLoadingKeypress: async function(eventObject) {
        console.log('handleLoadingKeypress', eventObject);
        var key = eventObject.which;
    
        if(key === 27) { 
            //loadResume();
        }
    
        if(key === 13) {
            await game.loadGame();
        }
    },

    handleGameKeypress: function (eventObject) {
        var key = eventObject.which;
    
        if([37, 38, 39, 40].indexOf(key) >= 0) {
            eventObject.preventDefault();
        }
    
        if(key === 38) {
            // Move up
            game.currentGame.adventurer.move(2);
        }
    
        if(key === 40) {
            // Move down
            game.currentGame.adventurer.move(0);
        }
    
        if(key === 37) {
            // Move left
            game.currentGame.adventurer.move(1);
        }
    
        if(key === 39) {
            // Move right
            game.currentGame.adventurer.move(3);
        }
    }
}

let loadMapFile = async function() {
    let response = await fetch('/assets/map.json');
    if(response.status == 200) {
        var json = await response.json();
        handleMapLoad(json);
    }
}


let handleMapLoad = function(jsonData) {
    console.log('handleMapLoad', jsonData);
    game.initScene(jsonData.mapZones, jsonData.mapArray);
}

export { game };