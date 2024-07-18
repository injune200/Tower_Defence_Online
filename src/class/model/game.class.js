export const MAX_PLAYERS = 2;

class Game {
  constructor(gameId) {
    this.gameId = gameId; // 게임 ID
    this.users = []; // 유저 목록
    this.towerCost = 100; // 타워 구입 비용
    this.monsterSpawnInterval = 3000; // 몬스터 생성 주기
    this.state = 'waiting'; // 게임 상태
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Max player in this game');
    }
    this.users.push(user);
  }

  stateChange(type) {
    this.state = type;
    console.log(`${this.gameId} state change into ${type}`);
  }

  getOpponentUser(uuid) {
    return this.users.find((user) => user.uuid !== uuid);
  }

  getUser(uuid) {
    return this.users.find((user) => user.uuid === uuid);
  }

  removeUser(uuid) {
    this.users = this.users.filter((user) => user.uuid !== uuid);
  }
}

export default Game;
