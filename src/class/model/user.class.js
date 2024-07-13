class User {
  constructor(uuid, socket) {
    this.uuid = uuid;
    this.userGold = 50; // 유저 골드
    this.base; // 기지 객체
    this.baseHp = 1000; // 기지 체력
    this.monsterLevel = 1; // 몬스터 레벨
    this.monsterPath; // 몬스터 경로
    this.initialTowerCoords; // 초기 타워 좌표
    this.basePosition; // 기지 좌표
    this.monsters = []; // 유저 몬스터 목록
    this.towers = []; // 유저 타워 목록
    this.score = 0; // 게임 점수
    this.highScore = 0; // 기존 최고 점수
    this.socket = socket;
  }
}

export default User;
