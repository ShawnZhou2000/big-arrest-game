var stage = new createjs.Stage("gameView");
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick", stage);

var gameView = new createjs.Container();
gameView.x = 30;
gameView.y = 30;

stage.addChild(gameView);

var circleArr = [
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[],
	[]
];
var currentCat;
var MOVE_NONE = -1,
	MOVE_LEFT = 0,
	MOVE_UP_LEFT = 1,
	MOVE_UP_RIGHT = 2,
	MOVE_RIGHT = 3,
	MOVE_DOWN_RIGHT = 4,
	MOVE_DOWN_LEFT = 5;

function getMovDir(cat) {
	// left
	var distanceMap = [];
	var can = true;
	for (var x = cat.indexX; x >= 0; x--) {
		if (circleArr[x][cat.indexY].getCircleType() == Circle.TYPE_SELECTED) {
			can = false;
			distanceMap[MOVE_LEFT] = cat.indexX - x;
			break;
		}
	}
	if (can) {
		return MOVE_LEFT;
	}

	// left up
	can = true;
	var x = cat.indexX,
		y = cat.indexY;
	while (true) {
		if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED) {
			can = false;
			distanceMap[MOVE_UP_LEFT] = cat.indexY - y;
			break;
		}
		if (y % 2 == 0) {
			x--;
		}
		y--;
		if (y < 0 || x < 0) {
			break;
		}
	}
	if (can) {
		return MOVE_UP_LEFT;
	}

	// right up
	can = true;
	x = cat.indexX, y = cat.indexY;
	while (true) {
		if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED) {
			can = false;
			distanceMap[MOVE_UP_RIGHT] = cat.indexY - y;
			break;
		}
		if (y % 2 == 1) {
			x++;
		}
		y--;
		if (y < 0 || x > 8) {
			break;
		}
	}
	if (can) {
		return MOVE_UP_RIGHT;
	}

	// right
	can = true;
	for (var x = cat.indexX; x < 9; x++) {
		if (circleArr[x][cat.indexY].getCircleType() == Circle.TYPE_SELECTED) {
			can = false;
			distanceMap[MOVE_RIGHT] = x - cat.indexX;
			break;
		}
	}
	if (can) {
		return MOVE_RIGHT;
	}

	// right down
	can = true;
	x = cat.indexX,
		y = cat.indexY;
	while (true) {
		if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED) {
			can = false;
			distanceMap[MOVE_DOWN_RIGHT] = y - cat.indexY;
			break;
		}
		if (y % 2 == 1) {
			x++;
		}
		y++;
		if (y > 8 || x > 8) {
			break;
		}
	}
	if (can) {
		return MOVE_DOWN_RIGHT;
	}

	// left down
	can = true;
	x = cat.indexX,
	y = cat.indexY;
	while (true) {
		if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED) {
			can = false;
			distanceMap[MOVE_DOWN_LEFT] = y - cat.indexY;
			break;
		}
		if (y % 2 == 0) {
			x--;
		}
		y++;
		if (y > 8 || x < 0)
			break;
	}
	if (can) {
		return MOVE_DOWN_LEFT;
	}

	var maxDir = -1,
		maxValue = -1;
	for (var dir = 0; dir < distanceMap.length; dir++) {
		if (distanceMap[dir] > maxValue) {
			maxValue = distanceMap[dir];
			maxDir = dir;
		}
	}
	if (maxValue > 1) {
		return maxDir;
	} else {
		return MOVE_NONE;
	}

}

function circleClicked(event) {
	if (event.target.getCircleType() != Circle.TYPE_CAT) {
		event.target.setCircleType(Circle.TYPE_SELECTED);
	} else {
		return;
	}
	if (currentCat.indexX == 0 || currentCat.indeX == 8 || currentCat.indexY == 0 || currentCat.indexY == 8) {
		alert("游戏失败！蓝色的精灵逃走了QAQ\n请重新开始游戏吧");
		return;
	}
	var dir = getMovDir(currentCat);
	switch (dir) {
		case MOVE_LEFT:
			currentCat.setCircleType(Circle.TYPE_UNSELECTED);
			currentCat = circleArr[currentCat.indexX - 1][currentCat.indexY];
			currentCat.setCircleType(Circle.TYPE_CAT);
			break;
		case MOVE_UP_LEFT:
			currentCat.setCircleType(Circle.TYPE_UNSELECTED);
			currentCat = circleArr[currentCat.indexY % 2 ? currentCat.indexX : currentCat.indexX - 1][currentCat.indexY - 1];
			currentCat.setCircleType(Circle.TYPE_CAT);
			break;
		case MOVE_UP_RIGHT:
			currentCat.setCircleType(Circle.TYPE_UNSELECTED);
			currentCat = circleArr[currentCat.indexY % 2 ? currentCat.indexX + 1 : currentCat.indexX][currentCat.indexY - 1];
			currentCat.setCircleType(Circle.TYPE_CAT);
			break;
		case MOVE_RIGHT:
			currentCat.setCircleType(Circle.TYPE_UNSELECTED);
			currentCat = circleArr[currentCat.indexX + 1][currentCat.indexY];
			currentCat.setCircleType(Circle.TYPE_CAT);
			break;
		case MOVE_DOWN_RIGHT:
			currentCat.setCircleType(Circle.TYPE_UNSELECTED);
			currentCat = circleArr[currentCat.indexY % 2 ? currentCat.indexX + 1 : currentCat.indexX][currentCat.indexY + 1];
			currentCat.setCircleType(Circle.TYPE_CAT);
			break;
		case MOVE_DOWN_LEFT:
			currentCat.setCircleType(Circle.TYPE_UNSELECTED);
			currentCat = circleArr[currentCat.indexY % 2 ? currentCat.indexX : currentCat.indexX - 1][currentCat.indexY + 1];
			currentCat.setCircleType(Circle.TYPE_CAT);
			break;
		default:
			alert("游戏结束，你赢了！");

	}
	var score = document.getElementById("score").innerHTML;
	score = parseInt(score) + 1;
	document.getElementById("score").innerHTML = score;
}


function addCircles() {
	for (var indexY = 0; indexY < 9; indexY++) {
		for (var indexX = 0; indexX < 9; indexX++) {
			var c = new Circle();
			gameView.addChild(c);
			circleArr[indexX][indexY] = c;
			c.indexX = indexX;
			c.indexY = indexY;
			c.x = indexY % 2 ? indexX * 55 + 25 : indexX * 55;
			// c.x = indexX * 55;
			c.y = indexY * 55;
			var initc = 0;
			if (indexX == 4 && indexY == 4) {
				c.setCircleType(Circle.TYPE_CAT);
				currentCat = c;
			} else if (Math.random() < 0.1) {
				initc++;
				if (initc < 7)
					c.setCircleType(Circle.TYPE_SELECTED);
			}
			document.getElementById("score").innerHTML = 0;
			c.addEventListener("click", circleClicked);
		}
	}
}

function start() {
	document.getElementById("menu").style.display = "none";
	document.getElementById("help").style.display = "none";
	document.getElementById("game").style.display = "inline-block";
}

function help() {
	document.getElementById("menu").style.display = "none";
	document.getElementById("help").style.display = "block";
}

function back() {
	document.getElementById("help").style.display = "none";
	document.getElementById("game").style.display = "none";
	document.getElementById("menu").style.display = "block";
}

function gameback() {
	var r = confirm("确定要返回主菜单吗？");
	if (r == true) {
	    document.getElementById("help").style.display = "none";
	    document.getElementById("game").style.display = "none";
	    document.getElementById("menu").style.display = "block";
	} 
}

function restart() {
	var r = confirm("确定要重新开始游戏吗？");
	if (r == true) {
	    addCircles();
	} 
	
}

function git() {
	window.location.href = "https://github.com/ShawnZhou2000/big-arrest-game";
}

addCircles();