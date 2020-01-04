import { ROW_COUNT, COL_COUNT, COLOR_BLANK } from './const.js?v=20200401';

/*
    Andrew Jobson September 2019
    A Tetris board and its Cells
    
    Jan 2020: Cell Size is now set externally so that it can be done dynamically
*/

class Cell {
    constructor( img, occupied ){
        this.occupied = occupied || 0;
        this.img = img || null;
    }
}

export class Board {
    
    constructor(){
        this.rows = ROW_COUNT;
        this.cols = COL_COUNT;
        this.initRow = 2;
        this.blankColor = COLOR_BLANK;
        this.cells = [];
        this.completeLines = [];
        
        for(let r = 0; r < this.rows; r++){
            this.cells[r] = [];
            for(let c = 0; c < this.cols; c++){
                this.cells[r][c] = new Cell();
            }
        }
    }
    
    /*
        Return an array with the width and height required of the canvas
    */
    getDimensions(){
        return [ this.cols * this.cellSize, this.rows * this.cellSize ];
    }
    
    /*
        Get the X and Y coordinates of the given gridRow and gridCol
    */
    getCoords( gridRow, gridCol ){
        return [ gridRow * this.cellSize, gridCol * this.cellSize ];
    }
    
    /*
        lock the given tetromino and make its pieces part of the board
    */
    lockTetromino(t){
        
        this.completeLines = [];
        
        for(let i = 0; i < t.box.length; i++){
            for(let j = 0; j < t.box[i].length; j++){
                if(t.box[i][j] == 1){
                    this.cells[t.pos[0] + i][t.pos[1] + j] = new Cell( t.img, 1 );
                }
            }
        }
        
        //decide if we have any complete lines
        for(let r = (this.rows - 1); r >= 0; r--){
            var line = [];
            
            for(let c = 0; c < this.cols; c++){
                if(this.cells[r][c].occupied){
                    line.push(this.cells[r][c]);
                } 
            }
            
            if(line.length == 0) break;
            
            
            if(line.length == this.cols){
                this.completeLines.push(r);
            }
        }
    }
    
    /*
        The calculation of what lines are complete is done. This method causes the board above empty lines toGMTString
        'fall' down into place. This happens after we've animated some sort of indication that those lines are about
        to be removed
    */
    removeCompleteLines(){
        if(this.completeLines.length){
            
            //Jan 2020 fix: sort the array as numbers, not the default strings.
            this.completeLines.sort(function(a, b){return a - b});
            
            for(let r = 0; r < this.completeLines.length; r++){
                let blankRow = [];
                blankRow.length = this.cols;
                blankRow.fill( new Cell() );
                this.cells.splice( this.completeLines[r], 1 );
                this.cells.unshift( blankRow );
            }
            
            this.completeLines = [];
            
        }
    }
}