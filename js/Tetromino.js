/*
    Andrew Jobson August/September 2019
    Tetrominos for Tetris
*/
const Orientations = {
    N: 1,
    S: 2,
    E: 3,
    W: 4
}

/*
    Tetromino superclass
*/
class Tetromino {

    constructor() {
        this.orientation = Orientations.E;
        this.pos = []; // [row, col] of top left of bounding box
        this.img; //the id of an img tag.
    }
    
    /* Simulate an abstract method. Child classes are expected to implement rotate.
       Using the left handed rotation system as in the Gameboy version 
       https://tetris.wiki/File:GBTetris-pieces.png
       this scheme was the same regardless of the button (A/B)
    */
    rotateRight(){ throw new Error('unimplemented rotateRight()'); }
    rotateLeft(){ throw new Error('unimplemented rotateLeft()'); }
    
    /*
        Direction is +1 for right, -1 for left
    */
    canMove( board, dir ){
        var bCanMove = true;
        for(let i = 0; i < this.box.length; i++){
            for(let j = 0; j < this.box[i].length; j++){
                if(this.box[i][j]){
                    var boardRow = this.pos[0] + i;
                    var boardCol = this.pos[1] + j + dir;
                    if(boardCol < 0 || boardCol >= board.cols || board.cells[boardRow][boardCol].occupied)
                        bCanMove = false;
                }
            }
        }
        return bCanMove;
    }
    
    /*
        move left if possible
    */
    moveLeft( board ){
        if(this.canMove( board, -1)) 
            this.pos[1] = this.pos[1] - 1;
    }
    
    /*
        move right if possible
    */
    moveRight( board ){
        if(this.canMove( board, +1 ))
            this.pos[1] = this.pos[1] + 1;
    }
    
    moveDown(){
        this.pos[0] = this.pos[0] + 1;
    }
    
    isLanded( board ){
        for(var j = 0; j < this.box[0].length; j++){ //columns
            for(var i = (this.box.length - 1); i >= 0; i--){ // rows bottom to top
            
                if(this.box[i][j]){
                    var boardRow = this.pos[0] + i + 1;
                    var boardCol = this.pos[1] + j;
                    if(boardRow >= board.rows){
                        return true;
                    } else {
                        let c = board.cells[boardRow][boardCol];
                        if(c.occupied){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    /*
        Returns true if the game has ended
    */
    setInitPosition( board ){
        for(let i = 0; i < this.box.length; i++){
            for(let j = 0; j < this.box[i].length; j++){
                if(this.box[i][j]){
                    this.pos = [ board.initRow - i, 3 ];
                }
            }
        }
        
        for(let i = 0; i < this.box.length; i++){
            for(let j = 0; j < this.box[i].length; j++){
                if(this.box[i][j]){
                    let boardRow = this.pos[0] + i;
                    let boardCol = this.pos[1] + j;
                    if(board.cells[boardRow][boardCol].occupied){
                        return true;
                    }
                }
            }
        }
        return false;
        
    }
    
    /*
        newBox is the Tet's bounding box that we're attempting to move to
        if any calls are out of the playing field or occupied, we can't rotate
    */
    isRotationBlocked( board, newBox ){
        if((this.pos[0] + newBox.length) > board.rows){
            return true;
        } else if((this.pos[1] + newBox[0].length) > board.cols){
            return true;
        } else if(this.pos[1] < 0) {
            return true;
        } else {
            for(var i = 0; i < newBox.length; i++){
                for(var j = 0; j < newBox[i].length; j++){
                    if(newBox[i][j]){
                        let boardRow = this.pos[0] + i;
                        let boardCol = this.pos[1] + j;
                        if(board.cells[boardRow][boardCol].occupied){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}

/*
    The one you wished was next...
*/
export class TetrominoI extends Tetromino {
    
    constructor(){
        super();
        this.box = [
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0]
        ];
        this.number = 2;
        this.img = 'imgTetI';
    }
    
    rotateRight( board ){
        switch(this.orientation){
        case Orientations.E:
            var b = [
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0]
            ];
            var o = Orientations.S;
            break;
        case Orientations.S:
            var b = [
                [0,0,0,0],
                [0,0,0,0],
                [1,1,1,1],
                [0,0,0,0]
            ];
            var o = Orientations.W;
            break;
        case Orientations.W:
            var b = [
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0]
            ];   
            var o = Orientations.N;
            break;
        case Orientations.N:
            var b = [
                [0,0,0,0],
                [0,0,0,0],
                [1,1,1,1],
                [0,0,0,0]
            ];
            var o = Orientations.E;
            break;
        }
        
        if(!this.isRotationBlocked( board, b )){
            this.box = b;
            this.orientation = o;
            return true;
        } else {
            return false;
        }
        
    }
    
    rotateLeft( board ){
        switch(this.orientation){
        case Orientations.E:
            var b = [
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0]
            ];            
            var o = Orientations.N;
            break;
        case Orientations.S:
            var b = [
                [0,0,0,0],
                [0,0,0,0],
                [1,1,1,1],
                [0,0,0,0]
            ];
            var o = Orientations.E;
            break;
        case Orientations.W:
            var b = [
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0]
            ];   
            var o = Orientations.S;
            break;
        case Orientations.N:
            var b = [
                [0,0,0,0],
                [0,0,0,0],
                [1,1,1,1],
                [0,0,0,0]
            ];
            var o = Orientations.W;
            break;
        }
        
        if(!this.isRotationBlocked( board, b )){
            this.box = b;
            this.orientation = o;
            return true;
        } else {
            return false;
        }
    }
}

/*
    J shaped Tet
*/
export class TetrominoJ extends Tetromino {
    constructor(){
        super();
        this.box = [
            [0,0,0],
            [1,1,1],
            [0,0,1]
        ];
        this.number = 1;
        this.img = 'imgTetJ';
    }
    
    rotateRight( board ){
        
        switch(this.orientation){
        case Orientations.E:
            var b = [
                [0,1,0],
                [0,1,0],
                [1,1,0]
            ];
            var o = Orientations.S;
            break;
        case Orientations.S:
            var b = [
                [1,0,0],
                [1,1,1],
                [0,0,0]
            ];
            var o = Orientations.W;
            break;
        case Orientations.W:
            var b = [
                [0,1,1],
                [0,1,0],
                [0,1,0]
            ];
            var o = Orientations.N;
            break;
        case Orientations.N:
            var b = [
                [0,0,0],
                [1,1,1],
                [0,0,1]
            ];
            var o = Orientations.E;
            break;
        }
        
        if(!this.isRotationBlocked( board, b )){
            this.box = b;
            this.orientation = o;
            return true;
        } else {
            return false;
        }
    }
    
    rotateLeft( board ){
        
        switch(this.orientation){
        case Orientations.E:
            var b = [
                [0,1,1],
                [0,1,0],
                [0,1,0]
            ];
            var o = Orientations.N;
            break;
        case Orientations.S:
            var b = [
                [0,0,0],
                [1,1,1],
                [0,0,1]
            ];
            var o = Orientations.E;
            break;
        case Orientations.W:
            var b = [
                [0,1,0],
                [0,1,0],
                [1,1,0]
            ];
            var o = Orientations.S;
            break;
        case Orientations.N:
            var b = [
                [1,0,0],
                [1,1,1],
                [0,0,0]
            ];
            var o = Orientations.W;
            break;
        }
        
        if(!this.isRotationBlocked( board, b )){
            this.box = b;
            this.orientation = o;
            return true;
        } else {
            return false;
        }
    }
}

/*
    L shaped Tet
*/
export class TetrominoL extends Tetromino {
    constructor(){
        super();
        this.box = [
            [0,0,0],
            [1,1,1],
            [1,0,0]
        ];
        this.number = 0;
        this.img = 'imgTetL';
    }
    
    rotateRight( board ){
        switch(this.orientation){
        case Orientations.E:
            var b = [
                [1,1,0],
                [0,1,0],
                [0,1,0]
            ];
            var o = Orientations.S;
            break;
        case Orientations.S:
            var b = [
                [0,0,1],
                [1,1,1],
                [0,0,0]
            ];
            var o = Orientations.W;
            break;
        case Orientations.W:
            var b = [
                [0,1,0],
                [0,1,0],
                [0,1,1]
            ];var o
            var o = Orientations.N;
            break;
        case Orientations.N:
            var b = [
                [0,0,0],
                [1,1,1],
                [1,0,0]
            ];
            var o = Orientations.E;
            break;
        }
        
        if(!this.isRotationBlocked( board, b )){
            this.box = b;
            this.orientation = o;
            return true;
        } else {
            return false;
        }
    }
    
    rotateLeft( board ){
        switch(this.orientation){
        case Orientations.E:
            var b = [
                [0,1,0],
                [0,1,0],
                [0,1,1]
            ];
            var o = Orientations.N;
            break;
        case Orientations.S:
            var b = [
                [0,0,0],
                [1,1,1],
                [1,0,0]
            ];
            var o = Orientations.E;
            break;
        case Orientations.W:
            var b = [
                [1,1,0],
                [0,1,0],
                [0,1,0]
            ];
            var o = Orientations.S;
            break;
        case Orientations.N:
            var b = [
                [0,0,1],
                [1,1,1],
                [0,0,0]
            ];
            var o = Orientations.W;
            break;
        }
        
        if(!this.isRotationBlocked( board, b )){
            this.box = b;
            this.orientation = o;
            return true;
        } else {
            return false;
        }
    }
}

/*
    S shaped Tet
*/
export class TetrominoS extends Tetromino {
    constructor(){
        super();
        this.box = [
            [0,0,0],
            [0,1,1],
            [1,1,0]
        ];
        this.number = 5;
        this.img = 'imgTetS';
    }
    
    
    rotateRight( board ){
        switch(this.orientation){
        case Orientations.E:
            var b = [
                [1,0,0],
                [1,1,0],
                [0,1,0]
            ];
            var o = Orientations.S;
            break;
        case Orientations.S:
            var b = [
                [0,0,0],
                [0,1,1],
                [1,1,0]
            ];
            var o = Orientations.W;
            break;
        case Orientations.W:
            var b = [
                [1,0,0],
                [1,1,0],
                [0,1,0]
            ];
            var o = Orientations.N;
            break;
        case Orientations.N:
            var b = [
                [0,0,0],
                [0,1,1],
                [1,1,0]
            ];
            var o = Orientations.E;
            break;
        }
        
        if(!this.isRotationBlocked( board, b )){
            this.box = b;
            this.orientation = o;
            return true;
        } else {
            return false;
        }
    }
    
    rotateLeft( board ){
        switch(this.orientation){
        case Orientations.E:
            var b = [
                [1,0,0],
                [1,1,0],
                [0,1,0]
            ];
            var o = Orientations.N;
            break;
        case Orientations.S:
            var b = [
                [0,0,0],
                [0,1,1],
                [1,1,0]
            ];
            var o = Orientations.E;
            break;
        case Orientations.W:
            var b = [
                [1,0,0],
                [1,1,0],
                [0,1,0]
            ];
            var o = Orientations.S;
            break;
        case Orientations.N:
            var b = [
                [0,0,0],
                [0,1,1],
                [1,1,0]               
            ];
            var o = Orientations.W;
            break;
        }
        
        if(!this.isRotationBlocked( board, b )){
            this.box = b;
            this.orientation = o;
            return true;
        } else {
            return false;
        }
    }
}

/*
    T shaped Tet
*/
export class TetrominoT extends Tetromino {
    constructor(){
        super();
        this.box = [
            [0,0,0],
            [1,1,1],
            [0,1,0]
        ];
        this.number = 6;
        this.img = 'imgTetT';
    }
    
    rotateRight( board ){
        switch(this.orientation){
        case Orientations.E:
            var b = [
                [0,1,0],
                [1,1,0],
                [0,1,0]
            ];
            var o = Orientations.S;
            break;
        case Orientations.S:
            var b = [
                [0,1,0],
                [1,1,1],
                [0,0,0]
            ];
            var o = Orientations.W;
            break;
        case Orientations.W:
            var b = [
                [0,1,0],
                [0,1,1],
                [0,1,0]
            ];
            var o = Orientations.N;
            break;
        case Orientations.N:
            var b = [
                [0,0,0],
                [1,1,1],
                [0,1,0]
            ];
            var o = Orientations.E;
            break;
        }
        
        if(!this.isRotationBlocked( board, b )){
            this.box = b;
            this.orientation = o;
            return true;
        } else {
            return false;
        }
    }
    
    rotateLeft( board ){
        
        switch(this.orientation){
        case Orientations.E:
            var b = [
                [0,1,0],
                [0,1,1],
                [0,1,0]
            ];
            var o = Orientations.N;
            break;
        case Orientations.S:
            var b = [
                [0,0,0],
                [1,1,1],
                [0,1,0]
            ];
            var o = Orientations.E;
            break;
        case Orientations.W:
            var b = [
                [0,1,0],
                [1,1,0],
                [0,1,0]
            ];
            var o = Orientations.S;
            break;
        case Orientations.N:
            var b = [
                [0,1,0],
                [1,1,1],
                [0,0,0]
            ];
            var o = Orientations.W;
            break;
        }
        
        if(!this.isRotationBlocked( board, b )){
            this.box = b;
            this.orientation = o;
            return true;
        } else {
            return false;
        }
    }
}

/*
    Z shaped Tet
*/
export class TetrominoZ extends Tetromino {
    constructor(){
        super();
        this.box = [
            [0,0,0],
            [1,1,0],
            [0,1,1]
        ];
        this.number = 4;
        this.img = 'imgTetZ';
    }
    
    rotateRight( board ){
        switch(this.orientation){
        case Orientations.E:
            var b = [
                [0,1,0],
                [1,1,0],
                [1,0,0]
            ];
            var o = Orientations.S;
            break;
        case Orientations.S:
            var b = [
                [0,0,0],
                [1,1,0],
                [0,1,1]
            ];
            var o = Orientations.W;
            break;
        case Orientations.W:
            var b = [
                [0,1,0],
                [1,1,0],
                [1,0,0]
            ];
            var o = Orientations.N;
            break;
        case Orientations.N:
            var b = [
                [0,0,0],
                [1,1,0],
                [0,1,1]
            ];
            var o = Orientations.E;
            break;
        }
        
        if(!this.isRotationBlocked( board, b )){
            this.box = b;
            this.orientation = o;
            return true;
        } else {
            return false;
        }
    }
    
    rotateLeft( board ){
        switch(this.orientation){
        case Orientations.E:
            var b = [
                [0,1,0],
                [1,1,0],
                [1,0,0]
            ];
            var o = Orientations.N;
            break;
        case Orientations.S:
            var b = [
                [0,0,0],
                [1,1,0],
                [0,1,1]
            ];
            var o = Orientations.E;
            break;
        case Orientations.W:
            var b = [
                [0,1,0],
                [1,1,0],
                [1,0,0]
            ];
            var o = Orientations.S;
            break;
        case Orientations.N:
            var b = [
                [0,0,0],
                [1,1,0],
                [0,1,1]
            ];
            var o = Orientations.W;
            break;
        }
        
        if(!this.isRotationBlocked( board, b )){
            this.box = b;
            this.orientation = o;
            return true;
        } else {
            return false;
        }
    }
}

/*
    O shaped Tet
*/
export class TetrominoO extends Tetromino {
    constructor(){
        super();
        this.box = [
            [0,0,0,0],
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0]
        ];
        this.number = 3;
        this.img = 'imgTetO';
    }
    
    isRotationBlocked( ){
        return false; // lol
    }
    
    rotateRight( board ){
        if(this.isRotationBlocked( board.rows, board.cols )) return;
        switch(this.orientation){
        case Orientations.E:
            this.orientation = Orientations.S;
            break;
        case Orientations.S:
            this.orientation = Orientations.W;
            break;
        case Orientations.W:
            this.orientation = Orientations.N;
            break;
        case Orientations.N:
            this.orientation = Orientations.E;
            break;
        }
        return true;
    }
    
    rotateLeft( board ){
        if(this.isRotationBlocked( board.rows, board.cols )) return;
        switch(this.orientation){
        case Orientations.E:
            this.orientation = Orientations.N;
            break;
        case Orientations.S:
            this.orientation = Orientations.E;
            break;
        case Orientations.W:
            this.orientation = Orientations.S;
            break;
        case Orientations.N:
            this.orientation = Orientations.W;
            break;
        }
        return true;
    }
}

