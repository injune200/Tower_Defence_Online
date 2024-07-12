class User {
  constructor(uuid) {
    this.uuid = uuid;
    this.userGold = 0; // 유저 골드
    this.base; // 기지 객체
    this.baseHp = 0; // 기지 체력
    this.monsterLevel = 0; // 몬스터 레벨
    this.monsterPath; // 몬스터 경로
    this.initialTowerCoords; // 초기 타워 좌표
    this.basePosition; // 기지 좌표
    this.monsters = []; // 유저 몬스터 목록
    this.towers = []; // 유저 타워 목록
    this.score = 0; // 게임 점수
    this.highScore = 0; // 기존 최고 점수
    this.opponentUser = null; // 상대방 user 객체
  }

  addOpponentUser(opponentUser) {
    this.opponentUser = opponentUser;
  }
}

export default User;
