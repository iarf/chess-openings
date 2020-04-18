let c;
let pieceArray;
window.onload = () => {
	c = document.getElementById('chessboard');
	pieceArray = getPieceArray('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2')
	drawBoard(c);
	c.addEventListener('click',movePiece);
}

const getPieceArray = (fen) => {
	//convert FEN input to an array
	const splitFen = fen.split(' ');
	const fenPos = splitFen[0].split('/');
	const pieceArray = new Array(8);
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
	return pieceArray;
}

const drawBoard = (c) => {
	const ctx = c.getContext('2d');
	const dim = c.width; //dimensions


	
	//draw board
	let white = true; //color of top left square
	let count = 0
	for (let i = 0; i < 8; i++){
		for (let j = 0; j < 8; j++){
			white ? ctx.fillStyle = '#f5d6ba' : ctx.fillStyle  = '#d19966';

			ctx.fillRect( j*(dim/8), i*(dim/8), dim/8, dim/8);
			
			if (pieceArray[i][j] != 'e'){
				ctx.drawImage(drawPiece(pieceArray[i][j],pieces),j*(dim/8),i*(dim/8),dim/8,dim/8)
			}

			count++
			white = !white;
		}
		white = !white;
	}


}

const drawPiece = (val,set) => {
	switch(String(val)){
		case 'p':
			return set.pd;
		case 'P':
			return set.pl;
		case 'r':
			return set.rd;
		case 'R':
			return set.rl;
		case 'n':
			return set.nd;
		case 'N':
			return set.nl;
		case 'b':
			return set.bd;
		case 'B':
			return set.bl;
		case 'q':
			return set.qd;
		case 'Q':
			return set.ql;
		case 'k':
			return set.kd;
		case 'K':
			return set.kl;
		default:
			return null;
	}
}

const movePiece = (e) => {
	const rect = c.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;

}

const PieceSet = class {
	constructor(source){
		this.bd = new Image();
		this.bd.src = `${source}/bd.svg`;

		this.bl = new Image();
		this.bl.src = `${source}/bl.svg`;

		this.kd = new Image();
		this.kd.src = `${source}/kd.svg`;

		this.kl = new Image();
		this.kl.src = `${source}/kl.svg`;

		this.nd = new Image();
		this.nd.src = `${source}/nd.svg`;

		this.nl = new Image();
		this.nl.src = `${source}/nl.svg`;

		this.pd = new Image();
		this.pd.src = `${source}/pd.svg`;

		this.pl = new Image();
		this.pl.src = `${source}/pl.svg`;

		this.qd = new Image();
		this.qd.src = `${source}/qd.svg`;

		this.ql = new Image();
		this.ql.src = `${source}/ql.svg`;

		this.rd = new Image();
		this.rd.src = `${source}/rd.svg`;

		this.rl = new Image();
		this.rl.src = `${source}/rl.svg`;

	}
}
const pieces = new PieceSet('img/pieces');