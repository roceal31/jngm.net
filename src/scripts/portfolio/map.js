
// Individual hex factory function
const hexTile = function(settings) {
	var hexTileObj = {
		context: settings.context,
		q: settings.q || 0,
		r: settings.r || 0,
		startX: settings.x,
		startY: settings.y,
		screen: [],
		hexHeightUnit: 0,
		hexWidthUnit: settings.gridSize || 10,
		mapConfig: settings.mapConfig,
		zoneId: '',

		s: function() {
			return (0 - q - r);
		},

		init: function() {
			this.calculateHexHeight();
			this.drawHex(this.startX, this.startY);
			//this.drawCoords(this.startX, this.startY, this.q, this.r);
			this.screen = hexTileObj.center();
			if(this.mapConfig.zoneId) {
				this.zoneId = this.mapConfig.zoneId;
			}
		},

		center: function() {
			if(!this.hexHeightUnit) {
				this.calculateHexHeight();
			}
			var centerX = this.startX + (this.hexWidthUnit / 2);
			var centerY = this.startY + this.hexHeightUnit;
			return [centerX, centerY];
		},

		drawCoords: function(startX, startY, q, r) {
			this.context.fillStyle = 'black';
			this.context.textAlign = 'center';
			this.context.font = '7px sans-serif';
			var x = startX + (this.hexWidthUnit / 2);
			var y = startY + this.hexHeightUnit + 4;
			this.context.fillText(q + ',' + r, x, y);
		},

		drawHex: function(startX, startY) {
			this.context.strokeStyle = this.mapConfig.strokeStyle;
			var currentPoint = this.drawSideOne(startX, startY);
			currentPoint = this.drawSideTwo(currentPoint[0], currentPoint[1]);
			currentPoint = this.drawSideThree(currentPoint[0], currentPoint[1]);
			currentPoint = this.drawSideFour(currentPoint[0], currentPoint[1]);
			this.drawSideFive(currentPoint[0], currentPoint[1]);
			this.drawSideSix(startX, startY);
		},

		drawSideOne: function(currentX, currentY) {
			this.context.beginPath();
			this.context.moveTo(currentX, currentY); // starting point of hexagon
			var x = currentX + this.hexWidthUnit;
			this.context.lineTo(x, currentY); // second point of hexagon
			return [x,currentY];
		},

		drawSideTwo: function(currentX, currentY) {
			var x = currentX + (this.hexWidthUnit/2);
			var y = currentY + this.hexHeightUnit;
			this.context.lineTo(x, y);
			return [x,y];
		},

		drawSideThree: function(currentX, currentY) {
			var x = currentX - (this.hexWidthUnit/2);
			var y = currentY + this.hexHeightUnit;
			this.context.lineTo(x, y);
			return [x,y];
		},

		drawSideFour: function(currentX, currentY) {
			var x = currentX - this.hexWidthUnit;
			this.context.lineTo(x, currentY);
			return [x, currentY];
		},

		drawSideFive: function(currentX, currentY) {
			var x = currentX - (this.hexWidthUnit/2);
			var y = currentY - this.hexHeightUnit;
			this.context.lineTo(x, y);
		},

		drawSideSix: function(startX, startY) {
			this.context.closePath(startX, startY);
			this.context.fillStyle = this.mapConfig.fillStyle;
			this.context.fill();
			this.context.stroke();
		},

		calculateHexHeight: function() {
			var hyp = Math.pow(this.hexWidthUnit, 2);
			var base = Math.pow(this.hexWidthUnit/2, 2);
			this.hexHeightUnit = Math.sqrt(hyp - base);
		}
	};

	//console.log('New hex tile', hexTileObj);
	return hexTileObj;
}

const mapTile = function(settings) {
	var tileObj = {
		strokeStyle: settings.strokeStyle || 'rgb(94,94,94)',
		fillStyle: settings.fillStyle || 'rgb(61,166,0)',
		zoneId: settings.zoneId
	};

	return tileObj;
}

const map = function(settings) {
	console.log('map factory', settings);
	let mapObj = {
		context: settings.context,
		grid: settings.grid,
		
		//zones array elements: see mapZone factory function
		 
		zones: [
			mapZone({
				id: 'forest',
				context: settings.context,
				title: 'The Pursuant Forest',
				logMessage: 'Forest blah blah blah lorem ipsum dolor sit amet.',
				image: '/images/forest-sprite.png',
				imageCoords: [420,24]
			})
		],
		/*
		   Map array elements:
		     - null = empty space on the grid, default hexTile
		     - mapTile = custom object to pass to hexTile with fill colour & zone id
		 */
        
		mapArray: [],

		init: function(mapZones, mapGrid) {
            console.log('init map', mapZones);
			if(mapZones) {
				this.zones = mapZones;				
			}
            if(mapGrid) {
			    this.mapArray = mapGrid;
            }
		},

		getZoneById: function(mapZoneId) {
			var mapZone = this.zones.find(function(zone) {
				return zone.id == mapZoneId;
			});
			return mapZone;
		},

		getZoneByCoordinates: function(q, r) {
			var mapTile = this.mapArray[q][r];
			if(mapTile.zoneId) {
				return this.getZoneById(mapTile.zoneId);
			}
			return null;
		},
	};

	console.log('map factory built', mapObj);
	return mapObj;
}

// Full game hex grid factory function
var hexGrid = function(context) {
    //console.log('hexGrid', context);
	var gridObj = {
		hexTiles: [],
		map: map({context:context}),
		context: context,
		gridSize: 10,
		hexHeightUnit: 0,
		width: 0,
		height: 0,

		init: function(mapArray) {
			//console.log('hexGrid init, initialising map on canvas ', this.context.canvas);
			this.map.context = this.context;
			this.map.grid = this;
			this.map.init(null, mapArray);

			this.width = parseInt(context.canvas.width);
			this.height = parseInt(context.canvas.height);

			var hyp = Math.pow(this.gridSize, 2);
			var base = Math.pow(this.gridSize/2, 2);
			this.hexHeightUnit = Math.sqrt(hyp - base);

			var middleX = this.width / 2;
			var middleY = this.height / 2;

			var numberRows = Math.floor(this.height / this.hexHeightUnit);
			var numberCols = Math.floor(this.width / (this.gridSize * 2));
			this.hexTiles = new Array(numberCols);

			// Even columns
			var currentX = this.gridSize / 2;
			var currentY = 0;
			this.buildHexGrid(0, currentX, currentY, numberRows, numberCols);

			// Odd columns
			currentX = this.gridSize * 2;
			currentY = this.hexHeightUnit;
			this.buildHexGrid(1, currentX, currentY, numberRows, numberCols);

			this.buildMapZones();
		},

		buildHexGrid: function(colStart, startX, startY, numberRows, numberCols) {
			var q = colStart, r = 0;
			var currentX = startX, currentY = startY;
			while(currentY < (this.height - this.hexHeightUnit)) {
				while(currentX < (this.width - (this.gridSize))) {
					var mapConfig = mapTile({});
					if(this.map.mapArray[q] && this.map.mapArray[q][r]) {
						mapConfig = mapTile(this.map.mapArray[q][r]);
					}
					//console.log('buildHexGrid', mapConfig);
					var currentTile = hexTile({
						context: this.context,
						q: q,
						r: r,
						x: currentX,
						y: currentY,
						gridSize: this.gridSize,
						mapConfig: mapConfig
					});
					if(this.hexTiles[q] === undefined) {
						this.hexTiles[q] = new Array(numberRows);
					}
					this.hexTiles[q][r] = currentTile;
					currentTile.init();
					currentX = currentX + (this.gridSize * 3);
					q += 2;
				}
				currentY = currentY + (this.hexHeightUnit * 2);
				r++;
				currentX = startX;//this.gridSize / 2;
				q = colStart;
			}
		},

		buildMapZones: function() {
			console.log('buildMapZones', this.map);
			var mapZoneCount = this.map.zones.length;
			for(var i = 0; i < mapZoneCount; i++) {
				var zone = this.map.zones[i];
				console.log('Drawing zone', zone);
				zone.init(420, 24);
			}
		},

		refreshTiles: function(startTile) {
			var startCol = startTile.q - 2;
			var endCol = startCol + 5;
			var startRow = startTile.r - 3;
			var endRow = startTile.r + 1;
			var zone = null;

			for(var col = startCol; col < endCol; col++) {
				for(var row = startRow; row <= endRow; row++) {
                    if(this.hexTiles && this.hexTiles.length < col && this.hexTiles[col].length < row) {
                        var currTile = this.hexTiles[col][row];
                        currTile.init();
                        if(currTile.zoneId) {
                            zone = currTile.zoneId;
                        }
                    }
				}
			}
			if(zone !== null) {
				this.refreshZone(zone);
			}
		},

		refreshZone: function(zoneId) {
			var zone = this.map.getZoneById(zoneId);
			zone.drawBackgroundImage();
		},

		isTileOnMap: function(hexTile) {
            var result = hexTile && this.map && this.map.mapArray &&
                this.map.mapArray.length > hexTile.q &&
                this.map.mapArray[hexTile.q].length > hexTile.r &&
                this.map.mapArray[hexTile.q][hexTile.r];
			//return (this.map.mapArray[hexTile.q][hexTile.r] != null);
            return result;
		},

		isTileInZone: function(hexTile) {

		}

	}

	return gridObj;
}

// Interactive zone factory function
var mapZone = function(settings) {
	var zoneObj = {
		id: settings.id || '',
		title: settings.title || '',
		grid: settings.grid,
		context: settings.context,
		logMessage: settings.logMessage || '',
		// TODO: image assets, monster, and zone state
		imagePath: settings.image || '',
		image: {},
		imageCoords: settings.imageCoords || [],
		monster: {},
		state: 0,

		init: function(x, y) {
			this.image = new Image();
			this.image.src = this.imagePath;
			console.log('mapZone init', this.image);

			var zone = this;
            this.image.addEventListener('load', function() {
                zone.drawBackgroundImage();
            });
		},

		drawBackgroundImage() {
			//console.log('mapZone drawBackgroundImage', this.context, this.image);
			if(this.context && this.image.src) {
				this.context.drawImage(this.image, this.imageCoords[0], this.imageCoords[1]);
			}
		},

		drawTitle: function() {
			// TODO
		}
	};

	return zoneObj;
}


export { hexGrid };