import { Board } from './Board.js?v=20200401';
import { Randomizer } from './Randomizer.js?v=20200401';

/*
    Andrew Jobson September 2019
    Tetris game state and basic logic for scoring/levelling
*/
export class Game {
    
    constructor( startLevel ){
        this.board = new Board();
        this.randomizer = new Randomizer();
        this.level = startLevel || 0;
        this.lines = 0;
        this.score = 0;
        this.ended = false;
        
        //the 'in play' tetromino
        this.inPlayTet = null;
        
        /*
            Entry Delay. After a normal landing and lock, and after a landing, lock, and line clear
            https://tetris.wiki/ARE
        */
        this.ARE = {
            normal: 2,
            lineClear: 93,
            active: false,
            frames: 0, //frame counter for when ARE is active
        };
        
        /*
            Delayed Auto Shift. Delay in frames when holding down a left or right direction.
            On the Game Boy this did not scale with level increases. i.e when you hold a 
            direction, the pieces don't move faster at higher levels. The Game Boy is considered
            to have a 'slow' DAS, making tapping directions fairly essential.
            As in version 1.1, it is not possible to 'charge' the DAS
            https://tetris.wiki/DAS
            https://tcrf.net/Tetris_(Game_Boy)
        */
        this.DAS = {
            init: 23,
            autoRepeat: 9,
            initActive: false,
            initMoveDone: false,
            autoRepeatActive: false,
            frames: 0,
            direction: null
        };
        
        /*
            number of frames allowed to pass during a soft-drop (holding the down key) before the Tet moves a grid cell. notice that after level 20 this is the same as the frames per grid cell
            the game awards a number of points equal to the number of grid spaces that the player has continuously soft-dropped the piece: https://tetris.wiki/Scoring 
        */
        this.SoftDrop = {
            active:false, 
            frames:3,
            consecutiveCells:0
        };
    }
    
    /*
        'lines' is how many lines you just cleared, between 1 and 4
        This is the original Nintendo scoring system. Also get 1 point for how many rows
        you soft dropped the piece for prior to landing and lock
        https://harddrop.com/wiki/Scoring#Original_Nintendo_scoring_system
    */
    advanceScore( lines, softDropCells ){
        switch(lines){
            case 1:
                this.score += (40 * (this.level + 1)) + softDropCells;
                break;
            case 2:
                this.score += (100 * (this.level + 1)) + softDropCells;
                break;
            case 3:
                this.score += (300 * (this.level + 1)) + softDropCells;
                break;
            case 4:
                this.score += (1200 * (this.level + 1)) + softDropCells;
                break;
        }
    }
    
    /*
        when the player line clear (startLevel * 10 + 10), the level advances by 1. After this, the level advances by 1 for every 10 lines
    */
    advanceLevel(){
        if(this.lines >= this.level * 10 + 10){
            this.level++;
        }
    }
    
    /*
      frames per grid cell at level. this is also the 'Lock Delay' in Game Boy land..
      there WAS a lock delay, I dont care what tetris.wiki says, taking advantage of lock delay is in the actual Game Boy manual, page 14
      https://www.gamesdatabase.org/Media/SYSTEM/Nintendo_Game_Boy//Manual/formated/Tetris_-_1989_-_Nintendo.pdf
    */    
    getFrames(){
        let f = [53, 49, 45, 41, 37, 33, 28, 22, 17, 11, 10, 9, 8, 7 ,6 , 6, 5, 5, 4, 4, 3];
        return f[this.level] === undefined ? f[f.length - 1] : f[this.level];
    }
}