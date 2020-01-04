/*
    Andrew Jobson September 2019
*/

/* === Board constants === */
export const ROW_COUNT = 18;
export const COL_COUNT = 10;

//canvas colors
export const COLOR_BLANK = '#EEFFDB';
export const COLOR_BORDERS = '#496600';
export const COLOR_FONT = '#496600';
export const COLOR_PANEL = '#8DA177';

//Jan 2020: Cell Size is now set externally so that it can be done dynamically
//export const CELL_SIZE = (window.innerHeight - document.getElementById('pnlGame').offsetTop - 20) / ROW_COUNT; //determines the play area size

// The Game Boy ran at 59.75 Frames Per Second
export const FRAME_DELAY = 1000 / 59.75;

// This is the difficulty (0-9) you would choose on the Game Boy. Hard-coded to 0 for now...
export const START_LEVEL = 0;
