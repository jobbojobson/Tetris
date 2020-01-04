import * as shapes from './Tetromino.js?v=20200401';
/*

    Andrew Jobson August 2019

    Most Tetris games do not just randomly select Tetrominos.
    This class implements the Game Boy's mechanism of attempting to reduce the chances of getting
    the same shapes over and over.

    Bitwise operations are explained here
    https://harddrop.com/wiki/Tetris_(Game_Boy)#Randomizer

    Originally designed by Henk Rogers
    http://www.youtube.com/watch?v=clLybEo72FU#t=890

*/
export class Randomizer {
    
    constructor() {
        this.list = [
            getRandomTetromino(),
            getRandomTetromino()
        ];
        this.updateBag( getRandomTetromino() );
    }
    
    /*
        The 'bag' is at most 3 elements: the in-play Tet, the preview Tet, and the following Tet.
        This algorithm follows the Game Boy's method of trying to prevent strings of identical Tets
    */
    updateBag( lockingPiece ){
        var t = getRandomTetromino();
        if( (lockingPiece.number | this.getPreviewShape().number | t.number) != lockingPiece.number ){
            this.list.push(t);
        } else {
            t = getRandomTetromino();
            if( (lockingPiece.number | this.getPreviewShape().number | t.number) != lockingPiece.number ){
                this.list.push(t);
            } else {
                this.list.push( getRandomTetromino() );
            }
        }
    }
    
    /*
        The bag spends most of it's time as 2 elements due to the in-play Tet being shifted off the front
        of the array by this method.
    */
    getNextShape(){
        return this.list.shift();
    }
    
    /*
        Due to getNextShape shifting the front of the array off, the preview shape is actually the front of the array
    */
    getPreviewShape(){
        return this.list[0];
    }
    
}

function getRandomTetromino(){
    switch( Math.floor(Math.random() * 7) ){
    case 0:
        return new shapes.TetrominoI();
        break;
    case 1:
        return new shapes.TetrominoO();
        break;
    case 2:
        return new shapes.TetrominoT();
        break;
    case 3:
        return new shapes.TetrominoJ();
        break;
    case 4:
        return new shapes.TetrominoL();
        break;
    case 5:
        return new shapes.TetrominoS();
        break;
    case 6:
        return new shapes.TetrominoZ();
        break;
    default:
        throw new Error('No Tet recognised'); //never happens
        break;
    } 
}