import { adventurer } from "./adventurer";
import { hexGrid } from "./map";

const game = {
    loader: null,
    // Main game  object factory function
    createGame: function (settings) {
        var gameObj = {
            grid: {},
            adventurer: {},
            console: {},
            log: {},
            context: settings.context,

            init: function (initMessage, mapArray) {
                this.console = $('#game-console');
                this.log = $('#game-log');
                this.log.html('<p>' + initMessage + '</p>');

                this.grid = hexGrid(context);
                this.grid.init(mapArray);

                this.adventurer = adventurer({
                    context: this.context,
                    position: this.grid.hexTiles[39][23],
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

    loadGame: function () {
        console.log('TODO: fix loadGame()');
        /*	jQuery.get({
                url: '/slice/js/mapArray.json',
                dataType: 'json',
                success: handleMapLoad
            });
            $(loader).hide('scale', 600, function() {
                $(document).off('keypress', handleLoadingKeypress);
                $(document).off('keydown', handleLoadingKeypress);
            });
        */

    },

    initGame: function () {
        this.loader = document.querySelector('#loading-screen');
        if (this.loader && !this.loader.checkVisibility()) {
            this.loader.style.display = 'block';
            document.documentElement.addEventListener('keypress', this.handleLoadingKeypress);
            document.documentElement.addEventListener('keydown', this.handleLoadingKeypress);
        }
    },

    initScene: function (mapArray) {
        //console.log('initScene', mapArray);
        currentGame = createGame({
            context: context
    
        });
    
        currentGame.init('You find yourself standing at a dusty crossroads. Five paths '+
            'stretch away into the distance. You suppose you must choose a direction ' +
            'and start moving. Adventure isn\'t going to find itself!', mapArray);
    
        $(document).on('keypress', handleGameKeypress);
        $(document).on('keydown', handleGameKeypress);
    
        gameLoop();
    },
    
    gameLoop: function gameLoop() {
        currentGame.updateGame();
        requestAnimFrame(gameLoop);
    },

    handleLoadingKeypress: function(eventObject) {
        console.log('handleLoadingKeypress', eventObject);
        var key = eventObject.which;
    
        if(key === 27) { 
            //loadResume();
        }
    
        if(key === 13) {
            game.loadGame();
        }
    },

    handleGameKeypress: function (eventObject) {
        var key = eventObject.which;
    
        if([37, 38, 39, 40].indexOf(key) >= 0) {
            eventObject.preventDefault();
        }
    
        if(key === 38) {
            // Move up
            currentGame.adventurer.move(2);
        }
    
        if(key === 40) {
            // Move down
            currentGame.adventurer.move(0);
        }
    
        if(key === 37) {
            // Move left
            currentGame.adventurer.move(1);
        }
    
        if(key === 39) {
            // Move right
            currentGame.adventurer.move(3);
        }
    }
}
export { game };