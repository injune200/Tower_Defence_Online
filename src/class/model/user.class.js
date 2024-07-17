class User {
  constructor(uuid, socket, payload, highScore) {
    this.uuid = uuid;
    this.userGold = 0; // 유저 골드
    this.base; // 기지 객체
    this.baseHp = 1000; // 기지 체력
    this.monsterLevel = 1; // 몬스터 레벨
    this.monsterPath = payload.monsterPath; // 몬스터 경로
    this.initialTowerCoords = payload.initialTowerCoords; // 초기 타워 좌표
    this.basePosition = payload.monsterPath[payload.monsterPath.length - 1]; // 기지 좌표
    this.monsters = []; // 유저 몬스터 목록
    this.towers = []; // 유저 타워 목록
    this.score = 0; // 게임 점수
    this.highScore = highScore; // 기존 최고 점수
    this.gameId;
    this.socket = socket;
  }
}

export default User;
