export class Piece {
    constructor(is_white, type) {
        this.is_white = is_white;
        this.piece = type;
    }

    to_str() {//not used
        return `${this.is_white ? "W" : "B"}_${this.piece}`;
    }
}

Object.assign(Piece, {
    W_BISHOP: new Piece(true, "bishop"),
    W_KNIGHT: new Piece(true, "knight"),
    W_QUEEN:  new Piece(true, "queen"),
    W_ROOK:   new Piece(true, "rook"),
    W_KING:   new Piece(true, "king"),
    W_PAWN:   new Piece(true, "pawn"),
    B_BISHOP: new Piece(false, "bishop"),
    B_KNIGHT: new Piece(false, "knight"),
    B_QUEEN:  new Piece(false, "queen"),
    B_ROOK:   new Piece(false, "rook"),
    B_KING:   new Piece(false, "king"),
    B_PAWN:   new Piece(false, "pawn"),
    EMPTY:    new Piece(null, "empty"),
});

export class Board {// for il vaticano
    constructor() {
        this.cells = [
            [Piece.B_ROOK, Piece.B_KNIGHT, Piece.B_BISHOP, Piece.B_QUEEN, Piece.B_KING, Piece.B_BISHOP, Piece.B_KNIGHT, Piece.B_ROOK],
            [Piece.B_PAWN, Piece.B_PAWN, Piece.B_PAWN, Piece.B_PAWN, Piece.B_PAWN, Piece.B_PAWN, Piece.B_PAWN, Piece.B_PAWN],
            [Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY],
            [Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY],
            [Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY],
            [Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY, Piece.EMPTY],
            [Piece.W_PAWN, Piece.W_PAWN, Piece.W_PAWN, Piece.W_PAWN, Piece.W_PAWN, Piece.W_PAWN, Piece.W_PAWN, Piece.W_PAWN],
            [Piece.W_ROOK, Piece.W_KNIGHT, Piece.W_BISHOP, Piece.W_QUEEN, Piece.W_KING, Piece.W_BISHOP, Piece.W_KNIGHT, Piece.W_ROOK],
        ];
    }

    at(pos) {
        return this.cells[pos.x][pos.y];
    }
}

export class Game {
    constructor() {
        this.board = new Board();
        this.cards = [new CardChess()];
        this.is_white_move = true;
    }
}

class Card {//abstract class
    /// from, to: {": int, y: int}
    /// gam - current game
    /// return:
    ///     -1 - explicitly not allowed
    ///     0 - not care
    ///     1 - allowed
    check_move(from, to, game);

    /// return:
    ///     1) {}
    ///     2) {play_event: "eventName"}
    on_before_move_before(from, to, game);

    on_after_move(from, to, game);
}

class CardChess {//todo castling
    constructor() {
        this.card_name = "chess";
        this.en_passant_y = -1;
        this.has_moved = {};
        for (const p of [
            {x: 0, y: 0},
            {x: 0, y: 7},
            {x: 7, y: 0},
            {x: 7, y: 7},
            {x: 0, y: 4},
            {x: 7, y: 4},
        ]) {

        }
    }

    check_move(from, to, game) {
        let piece = game.board.at(from).piece;

        if (game.board.at(from).piece === "empty")
            return 0;
        if (game.board.at(from).is_white !== game.is_white_move)
            return 0;
        if (game.board.at(to).piece !== "empty" &&
            game.board.at(from).is_white === game.board.at(to).is_white)
            return 0;

        if (piece === "bishop")
            return this.can_bishop_move(from, to, game);
        if (piece === "knight")
            return this.can_knight_move(from, to, game);
        if (piece === "queen")
            return this.can_rook_move(from, to, game) || this.can_bishop_move(from, to, game);
        if (piece === "rook")
            return this.can_rook_move(from, to, game);
        if (piece === "king")
            return this.can_king_move(from, to, game);
        if (piece === "pawn")
            return this.can_pawn_move(from, to, game);
    }

    can_pawn_move(from, to, game) {
        let forward = game.board.at(from).is_white ? -1 : 1;
        let delta = {x: to.x - from.x, y: to.y - from.y};
        if (pos_equal(delta, {x: forward, y: 0})) {
            //normal_move
            return game.board.at(to).piece === "empty";
        } else if (pos_equal(delta, {x: forward * 2, y: 0})) {
            //double_move
            return game.board.at(to).piece === "empty";
        } else if (delta.x === forward && Math.abs(delta.y) === 1) {
            return game.board.at(to).is_white !== game.board.at(from).is_white;
        }
    }

    can_knight_move(from, to, game) {
        let dx = Math.abs(from.x - to.x);
        let dy = Math.abs(from.y - to.y);
        if (dx === 1 && dy === 2) return 1;
        if (dx === 2 && dy === 1) return 1;
        return 0;
    }

    can_king_move(from, to, game) {
        let dx = Math.abs(from.x - to.x);
        let dy = Math.abs(from.y - to.y);
        if (dx > 1 || dy > 1)
            return 0;
        return 1;
    }

    can_bishop_move(from, to, game) {
        if (Math.abs(from.x - to.x) !== Math.abs(from.y - to.y))
            return 0;
        let dx = to.x > from.x ? 1 : -1;
        let dy = to.y > from.y ? 1 : -1;
        let pos = {...from};
        while (pos !== to) {
            pos = {x: pos.x + dx, y: pos.y + dy};
            if (pos_equal(pos, to)) break;
            if (game.board.at(pos).piece !== "empty")
                return 0;
        }
        return 1;
    }

    can_rook_move(from, to, game) {
        if (from.x !== to.x && from.y !== to.y)
            return 0;
        let dx = 0;
        let dy = 0;
        if (from.x === to.x) {
            dx = 0;
            dy = to.y > from.y ? 1 : -1;
        } else {
            let dx = to.x > from.x ? 1 : -1;
            dy = 0;
        }
        let pos = {...from}; //code duplicate
        while (pos !== to) {
            pos = {x: pos.x + dx, y: pos.y + dy};
            if (pos_equal(pos, to)) break;
            if (game.board.at(pos).piece !== "empty")
                return 0;
        }
        return 1;
    }

    on_before_move(from, to, game) {
        this.en_passant_x = -1;
        if (game.board.at(from).piece === "pawn" &&
            Math.abs(from.x - to.x) === 2 &&
            from.y === to.y) {
            this.en_passant_y = from.y;
        }
    }
}

function pos_equal(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}