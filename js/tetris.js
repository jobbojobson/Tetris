import { FRAME_DELAY, COLOR_BORDERS, COLOR_FONT, COLOR_PANEL, ROW_COUNT } from './const.js?v=20200401';
import { Game } from './Game.js';
/*
    Javascript Tetris - Andrew Jobson August 2019
    
    Most constants and behaviours in this version are based on the Game Boy version (A-type)
    
    References:
    https://tetris.wiki/Tetris_(Game_Boy)
    https://harddrop.com/wiki/Tetris_(Game_Boy)
    https://www.gamesdatabase.org/Media/SYSTEM/Nintendo_Game_Boy/manual/Formated/Tetris_-_1989_-_Nintendo.pdf
    
*/
var _canvas = document.getElementById('gameCanvas');
var _ctx = _canvas.getContext('2d');

var _game;
/*
 Push rotation actions to an array in the key handler
 Shift them out of the array when we draw frames. This means
 no action is 'lost' by pressing keys faster than frame draws
*/
var _rotations = [];
var _frameCount = 0; 
var _flashFlag = false;

//addition Jan 2020. more responsive resizing of board on mobile and desktop
function resizeBoard(){
    var cs;
    if(window.outerHeight > window.outerWidth){
        cs = (window.outerHeight / 2) / ROW_COUNT; 
    } else {
        cs = (window.innerHeight - document.getElementById('pnlGame').offsetTop - 20) / ROW_COUNT;
    }
    //console.log(cs);
    _game.board.cellSize = cs;
    _canvas.width = _game.board.getDimensions()[0] + 6 * _game.board.cellSize;
    _canvas.height = _game.board.getDimensions()[1] + 5;
}

function newGame(){
    _game = new Game();
    resizeBoard();
    _canvas.style = 'display:inline;';
    _rotations = [];
    _frameCount = 0;
    _flashFlag = false;
}

/*
    Desktop browser keydown handler
*/
document.addEventListener('keydown', function(e){
    
    //throw away the Operating System's key repeat rate, we need our own (DAS)
    if (_game.inPlayTet == null || e.repeat) return;
        
    switch(e.keyCode){
    case 90: // Z key
        e.preventDefault();
        _rotations.push(90);
        break;
    case 88: // X key
        e.preventDefault();
        _rotations.push(88);
        break;
    case 37: // left key
        e.preventDefault();
        _game.DAS.initActive = true;
        _game.DAS.direction = 'left';
        break;
    case 39: // right key
        e.preventDefault();
        _game.DAS.initActive = true;
        _game.DAS.direction = 'right';
        break;
    case 40: // down key
        e.preventDefault();
        _game.SoftDrop.active = true;
        break;
    }
});


/*
    Desktop browser keyup handler
*/
document.addEventListener('keyup', function(e){
    switch(e.keyCode){
        case 37:
        case 39:
            _game.DAS.initActive = false;
            _game.DAS.autoRepeatActive = false;
            _game.DAS.direction = null;
            break;
        case 40:
            _game.SoftDrop.active = false;
            break;
    }
});

window.addEventListener('resize', resizeBoard);

/*
    touch controls - touch start
*/
function touchStart(e){
    e.preventDefault();
    switch(e.target.id){
        case 'btnLeft':
            _game.DAS.initActive = true;
            _game.DAS.direction = 'left';
            break;
        case 'btnRight':
            _game.DAS.initActive = true;
            _game.DAS.direction = 'right';
            break;
        case 'btnDown':
            _game.SoftDrop.active = true;
            break;
        case 'btnRotateRight':
            _rotations.push(90);
            break;
        case 'btnRotateLeft':
            _rotations.push(88);
            break;
    }
}

/*
    touch controls - touch end
*/
function touchEnd(e){
    e.preventDefault();
    switch(e.target.id){
        case 'btnLeft':
        case 'btnRight':
            _game.DAS.initActive = false;
            _game.DAS.autoRepeatActive = false;
            _game.DAS.direction = null;
            break;
        case 'btnDown':
            _game.SoftDrop.active = false;
            break;
    }
}

/*
    Click to restart the game
*/
function canvasClick(evt){
    //we dont care about canvas clicks unless the game is over and we want to start again
    if(_game.ended){
        newGame();
        animate();
    }
}

/*
    If PHP detects that the useragent is a mobile browser, buttons will be present on the page, so attach touch events to them
*/
if(document.getElementsByClassName('button-layer').length > 0){
    document.getElementById('btnLeft').addEventListener('touchstart', touchStart);
    document.getElementById('btnRight').addEventListener('touchstart', touchStart);
    document.getElementById('btnDown').addEventListener('touchstart', touchStart);
    document.getElementById('btnRotateRight').addEventListener('touchstart', touchStart);
    document.getElementById('btnRotateLeft').addEventListener('touchstart', touchStart);
    document.getElementById('btnLeft').addEventListener('touchend', touchEnd);
    document.getElementById('btnRight').addEventListener('touchend', touchEnd);
    document.getElementById('btnDown').addEventListener('touchend', touchEnd);
}

_canvas.addEventListener('mousedown', canvasClick);

/*
    Draw the Tet preview box
*/
function drawPreviewTet(){
    
    var b = _game.board;
    
    var x = (b.cellSize * b.cols) + (b.cellSize / 2);
    var y = b.cellSize * 12;
    
    _ctx.beginPath();
    _ctx.strokeStyle = COLOR_BORDERS;
    _ctx.lineWidth = 5;
    _ctx.rect( x, y, b.cellSize * 5, b.cellSize * 5);
    _ctx.stroke();
    
    var t = _game.randomizer.getPreviewShape();
    var img = document.getElementById(t.img);
    
    if(t.box.length == 3){
        x += b.cellSize;
        y += b.cellSize;
    } else if (t.box.length == 4){
        x += b.cellSize / 2;
        y += b.cellSize / 2;
    }
    
    for(let r = 0; r < t.box.length; r++){
        for(let c = 0; c < t.box[r].length; c++){
            if(t.box[r][c] === 1){
                _ctx.drawImage(img, x + (c * b.cellSize), y + (r * b.cellSize), b.cellSize, b.cellSize);
            }
        }
    }
}

/*
    Draw the score, level and lines
*/
function drawGameStats(){
    
    var b = _game.board;
    
    var fontSize = b.cellSize;
    var x = (b.cellSize * b.cols) + (b.cellSize / 2);
    var y = b.cellSize * 3;
    
    _ctx.fillStyle = COLOR_FONT;
    
    _ctx.font = fontSize + 'px monospace';
    _ctx.fillText('SCORE', x, y);
    y += (b.cellSize + 2);
    _ctx.fillText(_game.score, x, y);
    
    y += (b.cellSize * 3);
    _ctx.fillText('LEVEL', x, y);
    y += (b.cellSize + 2);
    _ctx.fillText(_game.level, x, y);
    
    y += (b.cellSize + 10);
    _ctx.fillText('LINES', x, y);
    y += (b.cellSize + 2);
    _ctx.fillText(_game.lines, x, y);
    
}

/*
    draw the Tetromino that is in play
*/
function drawInPlayTet(){
    if(_game.inPlayTet == null) return;
    let tetWidth = _game.inPlayTet.box[0].length; //in cells
    let tetHeight = _game.inPlayTet.box.length;
    
    let posC = _game.inPlayTet.pos[1]; //in cells
    let posR = _game.inPlayTet.pos[0];
    
    var img = document.getElementById(_game.inPlayTet.img);
    
    //walk the tet's bounding box
    for(let r = 0; r < tetHeight; r++){
        for(let c = 0; c < tetWidth; c++){
            if(_game.inPlayTet.box[r][c] === 1){
                let coords = _game.board.getCoords( posR + r, posC + c );
                _ctx.drawImage(img, coords[1], coords[0], _game.board.cellSize, _game.board.cellSize);
            }
        }
    }
}

/*
    draw the board (which contains all the locked tetrominos)
*/
function drawBoard(){
    
    var b = _game.board;
    
    var isComplete = function( lineNumber ){
        for(let i = 0; i < b.completeLines.length; i++)
            if(b.completeLines[i] == lineNumber) 
                return true;
        
        return false;
    }
    
    for(let i = 0; i < b.cells.length; i++){
        if(isComplete(i)) continue;
        for(let j = 0; j < b.cells[i].length; j++){
            var coords = b.getCoords( i, j );
            if(b.cells[i][j].occupied){
                _ctx.drawImage(document.getElementById(b.cells[i][j].img), coords[1], coords[0], b.cellSize, b.cellSize);
            } else {
                _ctx.fillStyle = b.blankColor;
                _ctx.fillRect(coords[1], coords[0], b.cellSize, b.cellSize);
            }
        }
    }
}

/*
    Flash complete lines during ARE
*/
function flashLines(){
    if(!_game.ARE.active || _game.board.completeLines.length < 1) return;
    
    var b = _game.board;
    _flashFlag = (_game.ARE.frames % 10 == 0);
    
    for(let i = 0; i < b.completeLines.length; i++){
        var r = b.completeLines[i];
        for(let j = 0; j < b.cells[r].length; j++){
            var coords = b.getCoords( r,j );
            if(_flashFlag){
                _ctx.fillStyle = b.blankColor;
                _ctx.fillRect(coords[1], coords[0], b.cellSize, b.cellSize);
            } else {
                _ctx.drawImage(document.getElementById(b.cells[r][j].img), coords[1], coords[0], b.cellSize, b.cellSize);
            }
        }
    }
}

/*
    Draw the 'game over' message
*/
function drawGameOver(){
    var fontSize = _game.board.cellSize;
    var x = _game.board.cellSize * (_game.board.cols / 2);
    var y = _game.board.cellSize * (_game.board.rows / 2);
    
    _ctx.fillStyle = COLOR_PANEL;
    _ctx.fillRect(x - (_game.board.cellSize * 3), y - (_game.board.cellSize), _game.board.cellSize * 6, _game.board.cellSize * 3);
    
    _ctx.strokeStyle = COLOR_BORDERS;
    _ctx.beginPath();
    _ctx.rect(x - (_game.board.cellSize * 3), y - (_game.board.cellSize), _game.board.cellSize * 6, _game.board.cellSize * 3);
    _ctx.stroke();
    
    _ctx.fillStyle = COLOR_FONT;
    _ctx.font = fontSize + 'px monospace';
    _ctx.textAlign = 'center';
    _ctx.fillText('GAME OVER', x, y);
    
    _ctx.font = (fontSize / 2) + 'px monospace';
    _ctx.fillText('Click to restart', x, y + (_game.board.cellSize + 2));
    
}

/*
    Main animation loop
*/
function animate(){
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    
    /*
     If ARE is active, wait, and animate line clearings
    */
    if(_game.ARE.active){
        
        if(_game.board.completeLines.length){
            
            if(_game.ARE.frames == _game.ARE.lineClear){
                /*
                 Remove said lines from the board
                */
                _game.board.removeCompleteLines();
                _game.ARE.active = false;
                _game.ARE.frames = 0;
            } else {
                _game.ARE.frames++;
            }
        } else {
            if(_game.ARE.frames == _game.ARE.normal){
                _game.ARE.active = false;
                _game.ARE.frames = 0;
                
            } else {
                _game.ARE.frames++;
            }
        }
        
        
    } else { 
        // ARE isn't active.. do stuff
        
        /*
          Get a new tet if necessary
        */
        if(_game.inPlayTet == null){
            _game.inPlayTet = _game.randomizer.getNextShape();
            _game.ended = _game.inPlayTet.setInitPosition( _game.board );
        }
        
        /*
          Do rotations
        */
        switch(_rotations.shift()){
            case 90:
                if(_game.inPlayTet.rotateRight( _game.board )){
                    document.getElementById('audioRotateRight').play();
                }
                break;
            case 88:
                if(_game.inPlayTet.rotateLeft( _game.board )){
                    document.getElementById('audioRotateLeft').play();
                }
                break;
        }
        
        /*
          Do moving left/right and handle DAS
        */
        if(_game.DAS.initActive){
            
            // Move at least once. Handles if the key was pressed quickly
            if(!_game.DAS.initMoveDone){
                if(_game.DAS.direction == 'left')
                    _game.inPlayTet.moveLeft( _game.board );
                else if(_game.DAS.direction == 'right')
                    _game.inPlayTet.moveRight( _game.board );
                
                _game.DAS.initMoveDone = true;
            }
            
            // Consider switching to auto-repeat mode
            if(_game.DAS.frames > _game.DAS.init){
                _game.DAS.initActive = false;
                _game.DAS.autoRepeatActive = true;
                _game.DAS.frames = 0;
            } else {
                _game.DAS.frames++;
            }
            
        } else if(_game.DAS.autoRepeatActive) {
            // If we're still holding a key, move at the auto-repeat rate
            if((_game.DAS.frames % _game.DAS.autoRepeat) == 0){
                if(_game.DAS.direction == 'left')
                    _game.inPlayTet.moveLeft( _game.board );
                else if(_game.DAS.direction == 'right')
                    _game.inPlayTet.moveRight( _game.board );
            } 
            
            _game.DAS.frames++;
            
        } else if(!_game.DAS.initActive && !_game.DAS.autoRepeatActive){
            // If no DAS is active, reset the relevant flags. We're in free-fall
            _game.DAS.frames = 0;
            _game.DAS.direction = null;
            _game.DAS.initMoveDone = false;
        }
        
        // Calculate how many frames to go before moving a grid cell
        var framesToGo = _game.getFrames();
        if( _game.SoftDrop.active && (!_game.inPlayTet.isLanded( _game.board ))){
            framesToGo = _game.SoftDrop.frames;
        }
        
        if(!_game.SoftDrop.active)
            _game.SoftDrop.consecutiveCells = 0;
        
        if(++_frameCount >= framesToGo){
            // If it's time to move down, decide if the in-play Tet has landed
            if(!_game.inPlayTet.isLanded( _game.board )){
                if(_game.SoftDrop.active){
                    _game.SoftDrop.consecutiveCells++;
                } 
                _game.inPlayTet.moveDown();
            } else {
                document.getElementById('audioLanding').play();
                // If we're landed, lock the Tet to the board, populate the completed lines...
                _game.board.lockTetromino( _game.inPlayTet );
                //...advance the score...
                if( _game.board.completeLines.length ){
                    _game.advanceScore( _game.board.completeLines.length, _game.SoftDrop.consecutiveCells );
                    //...add to the line count...
                    _game.lines += _game.board.completeLines.length;
                    //...advance the level if it's time to
                    _game.advanceLevel();
                }
                //...update the randomizer...
                _game.randomizer.updateBag( _game.inPlayTet );
                //...and active ARE
                _game.inPlayTet = null;
                _game.ARE.active = true;
                _game.SoftDrop.consecutiveCells = 0;
            }
            
            _frameCount = 0;
        }
        
    }
    
    // Draw what we just calculated
    drawBoard();
    flashLines();
    
    _ctx.beginPath();
    _ctx.strokeStyle = COLOR_BORDERS;
    _ctx.lineWidth = 2;
    let b = _game.board.getDimensions();
    _ctx.rect(1, 1, b[0], b[1] - 1);
    _ctx.stroke();
    
    drawInPlayTet();
    drawGameStats();
    drawPreviewTet();
    
    if(_game.ended){
        drawGameOver();
    } else {
        setTimeout(animate, FRAME_DELAY);
    }
}
newGame();
animate();