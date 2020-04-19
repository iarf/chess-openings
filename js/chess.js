let c;
let pieceArray;
let selectedPiece = {};
let mousePos = {};
let dragging = false;
let newPiece;
window.onload = () => {
	c = document.getElementById('chessboard');
	pieceArray = getPieceArray('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq')
	drawBoard(c);
	getGames();

	c.addEventListener('mousedown', () => {
		// dragging = true;
		if (mousePos.y < c.width){
			selectedPiece.x = Math.floor(mousePos.x / (c.width / 8));
			selectedPiece.y = Math.floor(mousePos.y / (c.width / 8));
			selectedPiece.piece = pieceArray[selectedPiece.y][selectedPiece.x];
		}else{// clicking on drawer
			newPiece = true;
			const drawerPos = Math.floor(mousePos.x / (c.width/12));
			switch(drawerPos){
				case 0: 
					selectedPiece.piece = 'K';
					break;
				case 1:
					selectedPiece.piece = 'Q';
					break;
				case 2:
					selectedPiece.piece = 'R';
					break;
				case 3:
					selectedPiece.piece = 'B';
					break;
				case 4:
					selectedPiece.piece = 'N';
					break;
				case 5:
					selectedPiece.piece = 'P';
					break;
				case 6:
					selectedPiece.piece = 'k';
					break;
				case 7:
					selectedPiece.piece = 'q';
					break;
				case 8:
					selectedPiece.piece = 'r';
					break;
				case 9: 
					selectedPiece.piece = 'b';
					break;
				case 10:
					selectedPiece.piece = 'n';
					break;
				case 11:
					selectedPiece.piece = 'p';
					break;
				default:
					break;
			}
		}

		if (selectedPiece.piece != 'e'){
			dragging = true;
		}
	});
	
	c.addEventListener('mousemove',(e) => {
		const rect = c.getBoundingClientRect();
		mousePos.x = 2*(e.clientX - rect.left);
		mousePos.y = 2*(e.clientY - rect.top);

		console.log(`${mousePos.x},${mousePos.y}`);
		if (dragging){
			drawBoard(c);
		}
	});

	c.addEventListener('mouseup', () => {
		if (dragging){
			dragging = false;

			if (!newPiece){
				pieceArray[selectedPiece.y][selectedPiece.x] = 'e';
			}
			newPiece = false;
			if (mousePos.y < c.width){
				selectedPiece.x = Math.floor(mousePos.x / (c.width / 8));
				selectedPiece.y = Math.floor(mousePos.y / (c.width / 8));
				pieceArray[selectedPiece.y][selectedPiece.x] = selectedPiece.piece;
			}
			drawBoard(c);
			const sel = document.getElementById('color');
			if (sel.value == 'b'){
				sel.value = 'w';
			}else{
				sel.value = 'b';
			}
			getGames();

		}
	});
	sel = document.getElementById('color');
	sel.addEventListener('click',getGames);
	
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

const makeFen = () => {
	//make board position
	placementFen = '';

	for (let i = 0; i < 8; i++){
		let str = ''
		let count = 0;
		for (let j = 0; j < 8; j++){
			if (pieceArray[i][j] == 'e'){
				count ++;
				if (j == 7){
					str += count;
				}
			}else if (count > 0){
				str += count + pieceArray[i][j];
				count = 0;
			}else{
				str += pieceArray[i][j]
			}
		}
		placementFen += str + '/';
	}
	placementFen  = placementFen.slice(0,-1);// remove the exterior '/'

	//get side to move
	let sideSelect = document.getElementById('color');
	let sideFen = sideSelect.options[sideSelect.selectedIndex].value;

	//get castling ability
	let castleFen = '';
	const castleSel = document.getElementById('castling');
	const wQ = castleSel.querySelector('input[name="Q"]');
	const wK = castleSel.querySelector('input[name="K"]');
	const bQ = castleSel.querySelector('input[name="q"]');
	const bK = castleSel.querySelector('input[name="k"]');
	if (wK.checked){
		castleFen += 'K';
	}
	if (wQ.checked){
		castleFen += 'Q';
	}
	if (bK.checked){
		castleFen += 'k';
	}
	if (bQ.checked){
		castleFen += 'q';
	}
	if (!(wK.checked || wQ.checked || bK.checked || bQ.checked)){
		castleFen = '-'
	}

	//get en passant ability
	// let passantFen = '-'
	// const passantEl = document.querySelector('input[name="passant"]');
	// if (passantEl.value.length == 2){
	// 	passantFen = passantEl.value.toLowerCase();
	// }

	const fen = `${placementFen} ${sideFen} ${castleFen}`;
	
	return fen;
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
			if (dragging){
				ctx.drawImage(drawPiece(selectedPiece.piece,pieces),mousePos.x-32,mousePos.y-32,dim/8,dim/8);
			}
			count++
			white = !white;
		}
		white = !white;
	}
	//draw drawer
	ctx.fillStyle = '#c9bfdb';
	ctx.fillRect(0,dim,dim,dim/12)
	ctx.drawImage(drawPiece('K',pieces),(0*(dim/12)),dim,dim/12,dim/12);
	ctx.drawImage(drawPiece('Q',pieces),(1*(dim/12)),dim,dim/12,dim/12);
	ctx.drawImage(drawPiece('R',pieces),(2*(dim/12)),dim,dim/12,dim/12);
	ctx.drawImage(drawPiece('B',pieces),(3*(dim/12)),dim,dim/12,dim/12);
	ctx.drawImage(drawPiece('N',pieces),(4*(dim/12)),dim,dim/12,dim/12);
	ctx.drawImage(drawPiece('P',pieces),(5*(dim/12)),dim,dim/12,dim/12);
	ctx.drawImage(drawPiece('k',pieces),(6*(dim/12)),dim,dim/12,dim/12);
	ctx.drawImage(drawPiece('q',pieces),(7*(dim/12)),dim,dim/12,dim/12);
	ctx.drawImage(drawPiece('r',pieces),(8*(dim/12)),dim,dim/12,dim/12);
	ctx.drawImage(drawPiece('b',pieces),(9*(dim/12)),dim,dim/12,dim/12);
	ctx.drawImage(drawPiece('n',pieces),(10*(dim/12)),dim,dim/12,dim/12);
	ctx.drawImage(drawPiece('p',pieces),(11*(dim/12)),dim,dim/12,dim/12);



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

const getGames = async() => {
	const res = await fetch(`https://explorer.lichess.ovh/master?fen=${makeFen()}`)
	const ret = await res.json();
	await console.log(ret);
	const moveDiv = document.getElementById('next-moves');
	const gameDiv = document.getElementById('highest-games');
	let movesHtml = '<div class="col-2">Move</div><div class="col-3">Times played</div><div class="col-2">Avg. rating</div><div class="col-5">Outcomes (white/draw/black)</div>';
	for (let i = 0; i < ret.moves.length; i++){
		let bg;
		if (i % 2 == 0){
			bg = '#f1e9f2'
		}else{
			bg = 'auto'
		}
		move = ret.moves[i];
		movesHtml += `
		<div class="col-2 move" style="background:${bg};">${i + 1}. <strong>${move.san}</strong></div>
		<div class="col-3" style="background:${bg};">${(move.white + move.black + move.draws).toLocaleString()}</div>
		<div class="col-2" style="background:${bg};">${move.averageRating.toLocaleString()}</div>
		<div class="col-5" style="background:${bg};">${move.white.toLocaleString()} / ${move.draws.toLocaleString()} / ${move.black.toLocaleString()}</div>
		`
	}

	let gamesHtml = '<div class="col-2">Year</div><div class="col-7">Players</div><div class="col-3">Outcome</div>'
	for (let i = 0; i < ret.topGames.length; i++){
		game = ret.topGames[i];
		let bg;
		if (i % 2 == 0){
			bg = '#f1e9f2'
		}else{
			bg = 'auto'
		}
		gamesHtml += `
		<div class="col-2" style="background:${bg};">${game.year}</div>
		<div class="col-7" style="background:${bg};">${game.white.name} (${game.white.rating}) v. ${game.black.name} (${game.black.rating}) </div>
		<div class="col-3" style="background:${bg};">${game.winner}</div>
		`
	}
	moveDiv.innerHTML = await movesHtml;
	gameDiv.innerHTML = await gamesHtml;
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