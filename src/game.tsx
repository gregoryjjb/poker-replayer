export type Player = {
  name: string;
  stackSize: number;
  reads: string;
  holeCards: any;
};

type Params = {
  playerCount: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
};

export class Game {
  players: Player[];

  constructor(params: Params) {
    this.players = [];
    // for (let i = 0; i < params.playerCount; i++) {
    //   this.players.push({
    //     name: `Villian ${i}`,
    //     stackSize: 0,
    //     reads: "",
    //     holeCards: null,
    //   });
    // }
  }

  addPlayer = (player: Player) => {
    this.players.push(player);
  }
}
