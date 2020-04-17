
window.onload = () => {
	const c = document.getElementById('chessboard');
	drawBoard(c,'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
}

const drawBoard = (c, fen) => {
	const ctx = c.getContext('2d');
	const dim = c.width; //dimensions

	//convert FEN input to an array
	const splitFen = fen.split(' ');
	const fenPos = splitFen[0].split('/');
	let pieceArray = new Array(8);
	for (let i = 0; i < 8; i++){
		pieceArray[i] = new Array();
	}

	for (let i = 0; i  < 8; i++){
		for (let j = 0; j < fenPos[i].length; j++){
			if (!isNaN(fenPos[i][j])){
				for (let k = 0; k < fenPos[i][j]; k++){
					pieceArray[i].push('e');
				}
			}else{
				pieceArray[i].push(fenPos[i][j]);
			}
		}
	}
	
	//draw board
	let white = true; //color of top left square
	for (let i = 0; i < 8; i++){
		for (let j = 0; j < 8; j++){
			white ? ctx.fillStyle = '#ded3bd' : ctx.fillStyle  = '#a17b4d';

			ctx.fillRect( i*(dim/8), j*(dim/8), dim/8, dim/8);

			white = !white;
		}
		white = !white;
	}


}
