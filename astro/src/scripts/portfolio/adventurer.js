const adventurer = function(settings) {
	var advObj = {
		position: settings.position, // current hex tile in the grid
		grid: settings.grid,
		frameIndex: 0,
		tickCount: 0,
		ticksPerFrame: settings.ticksPerFrame || 8,
		ticksPerMove: settings.ticksPerMove || 4,
		isMoving: false,
		direction: settings.direction || 0, // 0 = down, 1 = left, 2 = up, 3 = right
		movingTo: {}, // hex tile to move to
		context: settings.context,
		image: {},
		width: settings.width || 32,
		height: settings.height || 32,
		screenCoords: [],

		init: function() {
			this.image = new Image();
			this.image.src = '/images/adventurer-sprite.png';
			var thisAdventurer = this;
			this.screenCoords = this.calculateScreenPosition(this.position);
			this.image.onload = function() {
				thisAdventurer.render();
			};
		},

		calculateScreenPosition: function(hexTile) {
			var hexCenter = hexTile.screen;
			var x = Math.ceil(hexCenter[0] - (this.width / 2));
			var y = Math.ceil(hexCenter[1] - this.height);
			return [x,y];
		},

		render: function() {
			if(this.context && this.image.src) {
				var sx = this.frameIndex * this.width;
				var sy = this.direction * this.height;
				this.context.drawImage(this.image,
					sx, // start clip x coordinate
					sy, // start clip y coordinate
					this.width, // clip width
					this.height, // clip height
					this.screenCoords[0], // current position x coordinate
					this.screenCoords[1], // current position y coordinate
					this.width, // image width
					this.height // image height
				);
			}
		},

		update: function() {
			// cycle through animation
			if(this.isMoving) {
				this.tickCount += 1;
				if(this.tickCount > this.ticksPerMove) {
					this.updatePosition();
				}
				if(this.tickCount > this.ticksPerFrame) {
					this.tickCount = 0;
					this.frameIndex = (this.frameIndex + 1) % 8;
				}
			}
		},

		move: function(direction) {
			if(!this.isMoving) {
				this.movingTo = this.getNextPosition(direction);
				if(this.canMoveToTile(this.movingTo)) {
					this.direction = direction;
					this.isMoving = true;
				}
			}
		},

		canMoveToTile: function(hexTile) {
			var newPositionOnMap = this.grid.isTileOnMap(hexTile);
			return newPositionOnMap;
		},

		clear: function() {
			if(this.context) {
				this.context.clearRect(this.screenCoords[0],
					this.screenCoords[1],
					this.width,
					this.height);
			}
		},

		updatePosition: function() {
			var endPoint = this.calculateScreenPosition(this.movingTo);
			//console.log('updatePosition', this.screenCoords, endPoint);
			if(this.screenCoords[0] == endPoint[0] && this.screenCoords[1] == endPoint[1]) {
				this.stop(this);
			} else {
				this.screenCoords[0] = (this.screenCoords[0] < endPoint[0]) ?
					this.screenCoords[0] + 1 : (this.screenCoords[0] > endPoint[0]) ?
						this.screenCoords[0] - 1 : this.screenCoords[0];
				this.screenCoords[1] = (this.screenCoords[1] < endPoint[1]) ?
					this.screenCoords[1] + 1 : (this.screenCoords[1] > endPoint[1]) ?
						this.screenCoords[1] - 1 : this.screenCoords[1];
			}
		},

		getNextPosition(direction) {
			var nextQ = this.position.q;
			var nextR = this.position.r;
			switch(direction) {

				case 1: // left
					nextQ--;
					break;

				case 2: // up
					nextR--;
					break;

				case 3: // right
					nextQ++;
					break;

				case 0: // down
					nextR++;
					break;
			}

			//console.log('getNextPosition', nextQ, nextR, this.grid.hexTiles[nextQ][nextR]);
			return this.grid.hexTiles[nextQ][nextR];
		},

		getFeetPosition(x, y) {
			return [Math.round((x + this.width) / 2), (y + this.height)];
		},

		stop: function(thisAdventurer) {
			thisAdventurer.isMoving = false;
			thisAdventurer.frameIndex = 0;
			//thisAdventurer.direction = 0;
			this.position = this.movingTo;
			this.movingTo = null;
		},
	};

	return advObj;
};

export { adventurer };