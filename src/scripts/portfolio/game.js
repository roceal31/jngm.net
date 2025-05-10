import { adventurer } from "./adventurer";
import { hexGrid } from "./map";

const gameMode = {
    showLoader: 0,
    showMap: 1,
};

const game = {
    loader: null,
    context: null,
    currentGame: null,
    mode: gameMode.showLoader,

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
                this.logMessage(initMessage);

                this.grid = hexGrid( this.context );
                this.grid.init(mapZones, mapArray, this.zoneCallback);

                this.adventurer = adventurer({
                    context: this.context,
                    position: this.grid.hexTiles[39][23],
                    grid: this.grid,
                });
                this.adventurer.init();
            },

            logMessage: function (message) {
                this.log.innerHTML += `<p>${message}</p>`;
                this.gameLogScrollJump();
            },

            gameLogScrollJump: function() {
                // TODO: see if we can make this less annoying or put it somewhere more generic
                var previousNodes = this.log.childNodes.length - 1;
                if(previousNodes > 0) {
                    var nodeHeights = new Array(previousNodes);
                    this.log.childNodes.forEach((currentNode, currentIndex, nodeListObj) => {
                        if(currentIndex <= previousNodes) {
                            nodeHeights[currentIndex] = currentNode.clientHeight;
                        }
                    });
                    var scrollAmount = nodeHeights.reduce((heightTotal, current) => {
                        return heightTotal + current;
                    });
                    
                    this.log.scroll(0, scrollAmount);
                }
            },

            zoneCallback: function (message) {
                game.currentGame.logMessage(message);
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

    initGame: async function (context, mode) {
        console.log('initGame');
        this.mode = mode;
        this.loader = document.querySelector('#loading-screen');
        this.context = context;
        await this.configureGameMode();
    },

    configureGameMode: async function() {
        console.log(`configuring game for mode ${this.mode}`);
        if(this.loader && this.context && this.context.canvas) {
            if(this.mode === gameMode.showLoader) {
                console.log('Showing game loader');
                this.loader.style.display = 'block';
                this.context.canvas.style.display = 'none';
                document.documentElement.addEventListener('keydown', this.handleLoadingKeypress);
                return;
            }

            if(this.mode === gameMode.showMap) {
                console.log('Showing game map');
                this.context.canvas.style.display = 'block';
                this.loader.style.display = 'none';
                document.documentElement.removeEventListener('keydown', this.handleLoadingKeypress);
                await loadMapFile();
                return;
            }
        }

        console.warn('Invalid game mode, unable to proceed');
    },

    initScene: function (mapZones, mapArray) {
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
            game.mode = gameMode.showMap;
            game.configureGameMode();
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