import IntervalManager from "./manager/interval.manager.js";

const MAX_PLAYERS = 2;

class Game {
  constructor(gameId) {
    this.gameId = gameId; // 게임 ID
    this.users = []; // 유저 목록
    this.towerCost = 0; // 타워 구입 비용
    this.monsterSpawnInterval = 0; // 몬스터 생성 주기
    this.state = "waiting"; // 게임 상태
    this.intervalManager = new IntervalManager(); // game intervalManager 생성
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error("Max player in this game");
    }
    this.users.push(user);
  }

  getUser(uuid) {
    return this.users.find((user) => user.uuid === uuid);
  }

  removeUser(uuid) {
    this.users = this.users.filter((user) => user.uuid !== uuid);
  }

  makeInterval(uuid, callBack, interval, type) {
    this.intervalManager.addUserInterval(uuid, callBack, interval, type);
  }
}

export default Game;
