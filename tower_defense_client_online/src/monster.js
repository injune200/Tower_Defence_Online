const NUM_OF_MONSTERS = 8;

export class Monster {
  constructor(
    gameAssets,
    path,
    monsterImages,
    level,
    monsterNumber,
    isOpponent = false,
    payload = null,
  ) {
    // 생성자 안에서 몬스터의 속성을 정의한다고 생각하시면 됩니다!
    if (!path || path.length <= 0) {
      throw new Error('몬스터가 이동할 경로가 필요합니다.');
    }
    if (!isOpponent) {
      this.monsterNumber = monsterNumber ?? Math.floor(Math.random() * (NUM_OF_MONSTERS - 3)) + 1; // 몬스터 번호 (1 ~ 5. 몬스터를 추가해도 숫자가 자동으로 매겨집니다!)
      this.path = path; // 몬스터가 이동할 경로
      this.currentIndex = 0; // 몬스터가 이동 중인 경로의 인덱스
      this.x = path[0].x; // 몬스터의 x 좌표 (최초 위치는 경로의 첫 번째 지점)
      this.y = path[0].y; // 몬스터의 y 좌표 (최초 위치는 경로의 첫 번째 지점)
      this.width = 40; // 몬스터 이미지 가로 길이
      this.height = 40; // 몬스터 이미지 세로 길이
      this.speed = 2; // 몬스터의 이동 속도
      this.image = monsterImages[this.monsterNumber - 1]; // 몬스터 이미지
      this.level = level; // 몬스터 레벨
      this.init(level);
      this.creationTime = Date.now();
    } else {
      // Opponent Player's monster
      this.monsterNumber = monsterNumber; // 몬스터 번호 (1 ~ 5. 몬스터를 추가해도 숫자가 자동으로 매겨집니다!)
      this.path = path; // 몬스터가 이동할 경로
      this.currentIndex = payload.currentIndex; // 몬스터가 이동 중인 경로의 인덱스
      this.x = payload.x; // 몬스터의 x 좌표 (최초 위치는 경로의 첫 번째 지점)
      this.y = payload.y; // 몬스터의 y 좌표 (최초 위치는 경로의 첫 번째 지점)
      this.width = 40; // 몬스터 이미지 가로 길이
      this.height = 40; // 몬스터 이미지 세로 길이
      this.speed = 2; // 몬스터의 이동 속도
      this.image = monsterImages[this.monsterNumber - 1]; // 몬스터 이미지
      this.level = level; // 몬스터 레벨
      this.maxHp = payload.maxHp; // 몬스터의 현재 HP
      this.hp = payload.hp; // 몬스터의 현재 HP
      this.attackPower = payload.attackPower; // 몬스터의 공격력 (기지에 가해지는 데미지)
      this.creationTime = payload.creationTime;
    }

    // New Monster
    switch (this.monsterNumber) {
      case 8:
        this.width = gameAssets.scorpion.width;
        this.height = gameAssets.scorpion.height;
        this.speed = gameAssets.scorpion.speed;
        if (!isOpponent) {
          this.maxHp = gameAssets.scorpion.hp + 10 * level;
          this.hp = this.maxHp;
        }
        break;

      case 7:
        this.width = gameAssets.tanker.width;
        this.height = gameAssets.tanker.height;
        this.speed = gameAssets.tanker.speed;
        if (!isOpponent) {
          this.maxHp = gameAssets.tanker.hp + 50 * level;
          this.hp = this.maxHp;
        }
        break;

      case 6:
        this.width = gameAssets.wizard.width;
        this.height = gameAssets.wizard.height;
        this.speed = gameAssets.wizard.speed;
        if (!isOpponent) {
          this.maxHp = gameAssets.wizard.hp + 10 * level;
          this.hp = this.maxHp;
        }
        this.chargingTime = 600; // 10초
        for (let i = 1; i <= level; i++) {
          // level 당 chargingTime 10% 차감 ex) 10 9 8.1 7.3 6.5 5.8 5.2 4.7 4.2 3.8 3.5
          this.chargingTime *= 0.95;
        }
        this.charging = this.chargingTime;
        // range는 100부터 시작하여 level당 +5, 최대 150
        this.range = 95 + Math.min(5 * level, 150);
        this.attackingTower = false;
        break;

      default:
        break;
    }
  }

  init(level) {
    this.maxHp = 100 + 10 * level; // 몬스터의 현재 HP
    this.hp = this.maxHp; // 몬스터의 현재 HP
    this.attackPower = 100 + 1 * level; // 몬스터의 공격력 (기지에 가해지는 데미지)
  }

  move() {
    if (this.currentIndex < this.path.length - 1) {
      const nextPoint = this.path[this.currentIndex + 1];
      const deltaX = nextPoint.x - this.x;
      const deltaY = nextPoint.y - this.y;
      // 2차원 좌표계에서 두 점 사이의 거리를 구할 땐 피타고라스 정리를 활용하면 됩니다! a^2 = b^2 + c^2니까 루트를 씌워주면 되죠!
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < this.speed) {
        // 거리가 속도보다 작으면 다음 지점으로 이동시켜주면 됩니다!
        this.currentIndex++;
      } else {
        // 거리가 속도보다 크면 일정한 비율로 이동하면 됩니다. 이 때, 단위 벡터와 속도를 곱해줘야 해요!
        this.x += (deltaX / distance) * this.speed; // 단위 벡터: deltaX / distance
        this.y += (deltaY / distance) * this.speed; // 단위 벡터: deltaY / distance
      }
      return false;
    } else {
      this.hp = 0; // 몬스터는 이제 기지를 공격했으므로 자연스럽게 소멸해야 합니다.
      return true;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`(레벨 ${this.level}) ${this.hp}/${this.maxHp}`, this.x, this.y - 5);
    if (this.attackingTower && this.target) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(this.target.x + this.target.width / 2, this.target.y + this.target.height / 2);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
    }
  }

  attackTower(tower, towerIndex) {
    this.target = tower;
    this.targetTowerIndex = towerIndex;
    this.attackingTower = true;
  }
}
