import { Base } from './base.js';
import { Monster } from './monster.js';
import { Tower } from './tower.js';
import { customMonsterData } from './customMonster.js';

if (!localStorage.getItem('token2')) {
  alert('로그인이 필요합니다.');
  location.href = '/login';
}

const version = '1.0.0';
let sequence = 0;
let uuid;
const numOfInitialTowers = 3; // 초기 타워 개수

let levelUpCost = 100; // level up 비용
let scorpionCost = 50; // Scorpion 비용
let wizardCost = 50; // Wizard 비용
let tankerCost = 50; // Tanker 비용

let serverSocket;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const opponentCanvas = document.getElementById('opponentCanvas');
const opponentCtx = opponentCanvas.getContext('2d');

const chattingCanvas = document.getElementById('chattingCanvas'); // 채팅 ROOT
const scrollContainer = document.getElementById('scrollContainer'); // 채팅 올라오는 곳
const chatContent = document.getElementById('chatContent');
const chatButton = document.getElementById('chatButton');

const progressBarContainer = document.getElementById('progressBarContainer');
const progressBarMessage = document.getElementById('progressBarMessage');
const progressBar = document.getElementById('progressBar');
const loader = document.getElementsByClassName('loader')[0];

export let gameAssets;

export const NUM_OF_MONSTERS = 8; // 몬스터 개수
const NUM_OF_TOWERS = 6;
// 게임 데이터
let towerCost = 0; // 타워 구입 비용
let towerUpgradeCost = 100;
let monsterSpawnInterval = 0; // 몬스터 생성 주기

// 유저 데이터
let userGold = 0; // 유저 골드
let base; // 기지 객체
let baseHp = 0; // 기지 체력
let monsterLevel = 1; // 몬스터 레벨
let monsterPath; // 몬스터 경로
let initialTowerCoords; // 초기 타워 좌표
let basePosition; // 기지 좌표
const monsters = []; // 유저 몬스터 목록
const towers = []; // 유저 타워 목록
let score = 0; // 게임 점수
let highScore = 0; // 기존 최고 점수
let maxTowerNum = 10;
let currentTowerNum = towers.length;

// 상대 데이터
let opponentBase; // 상대방 기지 객체
let opponentMonsterPath; // 상대방 몬스터 경로
let opponentInitialTowerCoords; // 상대방 초기 타워 좌표
let opponentBasePosition; // 상대방 기지 좌표
const opponentMonsters = []; // 상대방 몬스터 목록
const opponentTowers = []; // 상대방 타워 목록
let opponentMonsterLevel = 1; // 상대방 Level

let isInitGame = false;

// 이미지 로딩 파트
const backgroundImage = new Image();
backgroundImage.src = 'images/bg.webp';

const towerImages = [];
for (let i = 1; i <= NUM_OF_TOWERS; i++) {
  const img = new Image();
  img.src = `images/tower${i}.png`;
  towerImages.push(img);
}

const baseImage = new Image();
baseImage.src = 'images/base.png';

const pathImage = new Image();
pathImage.src = 'images/path.png';

const monsterImages = [];
for (let i = 1; i <= NUM_OF_MONSTERS; i++) {
  const img = new Image();
  img.src = `images/monster${i}.png`;
  monsterImages.push(img);
}

let bgm;

function chatUpload() {
  if (chatContent.value.trim() == '') {
    const newMessage = document.createElement('p');
    newMessage.textContent = `system: 아무런 내용이 없습니다.`;

    scrollContainer.appendChild(newMessage);
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    return;
  }

  sendEvent(7, { uuid, message: chatContent.value });
  chatContent.value = '';
}

function generateRandomMonsterPath() {
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 500; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });

  while (currentX < canvas.width - 50) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > canvas.width - 50) {
      currentX = canvas.width - 50;
    }

    currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 50) {
      currentY = 50;
    }
    if (currentY > canvas.height - 50) {
      currentY = canvas.height - 50;
    }

    path.push({ x: currentX, y: currentY });
  }

  return path;
}

function initMap() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 그리기
  drawPath(monsterPath, ctx);
  drawPath(opponentMonsterPath, opponentCtx);
  placeInitialTowers(initialTowerCoords, towers, ctx); // 초기 타워 배치
  placeInitialTowers(opponentInitialTowerCoords, opponentTowers, opponentCtx); // 상대방 초기 타워 배치
  placeBase(basePosition, true);
  placeBase(opponentBasePosition, false);
}

function drawPath(path, context) {
  const segmentLength = 10; // 몬스터 경로 세그먼트 길이
  const imageWidth = 30; // 몬스터 경로 이미지 너비
  const imageHeight = 30; // 몬스터 경로 이미지 높이
  const gap = 3; // 몬스터 경로 이미지 겹침 방지를 위한 간격

  for (let i = 0; i < path.length - 1; i++) {
    const startX = path[i].x;
    const startY = path[i].y;
    const endX = path[i + 1].x;
    const endY = path[i + 1].y;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // 피타고라스 정리로 두 점 사이의 거리를 구함 (유클리드 거리)
    const angle = Math.atan2(deltaY, deltaX); // 두 점 사이의 각도를 tan-1(y/x)로 구해야 함 (자세한 것은 역삼각함수 참고): 삼각함수는 변의 비율! 역삼각함수는 각도를 구하는 것!

    for (let j = gap; j < distance - gap; j += segmentLength) {
      const x = startX + Math.cos(angle) * j; // 다음 이미지 x좌표 계산(각도의 코사인 값은 x축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 x축 좌표를 구함)
      const y = startY + Math.sin(angle) * j; // 다음 이미지 y좌표 계산(각도의 사인 값은 y축 방향의 단위 벡터 * j를 곱하여 경로를 따라 이동한 y축 좌표를 구함)
      drawRotatedImage(pathImage, x, y, imageWidth, imageHeight, angle, context);
    }
  }
}

function drawRotatedImage(image, x, y, width, height, angle, context) {
  context.save();
  context.translate(x + width / 2, y + height / 2);
  context.rotate(angle);
  context.drawImage(image, -width / 2, -height / 2, width, height);
  context.restore();
}

function getRandomPositionNearPath(maxDistance) {
  const segmentIndex = Math.floor(Math.random() * (monsterPath.length - 1));
  const startX = monsterPath[segmentIndex].x;
  const startY = monsterPath[segmentIndex].y;
  const endX = monsterPath[segmentIndex + 1].x;
  const endY = monsterPath[segmentIndex + 1].y;

  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);

  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

  return {
    x: posX + offsetX,
    y: posY + offsetY,
  };
}

function placeInitialTowers(initialTowerCoords, initialTowers, context) {
  initialTowerCoords.forEach((towerCoords) => {
    const tower = new Tower(towerCoords.x, towerCoords.y);
    initialTowers.push(tower);
    tower.draw(context, towerImages);
    currentTowerNum = towers.length
  });
}

function placeNewTower() {
  // 타워를 구입할 수 있는 자원이 있을 때 타워 구입 후 랜덤 배치
  if (userGold < towerCost) {
    const newMessage = document.createElement('p');
    newMessage.textContent = `system: 골드가 부족합니다.`;

    scrollContainer.appendChild(newMessage);
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    return;
  }
  if (maxTowerNum <= currentTowerNum) {
    const newMessage = document.createElement('p');
    newMessage.textContent = `system: 더 이상 타워를 세울 수 없습니다.`;

    scrollContainer.appendChild(newMessage);
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    return;
  }

  const { x, y } = getRandomPositionNearPath(50);
  const tower = new Tower(x, y);
  towers.push(tower);
  tower.draw(ctx, towerImages);
  currentTowerNum = towers.length
  userGold -= towerCost;
  sendEvent(66, { uuid, tower, userGold });
}

function placeBase(position, isPlayer) {
  if (isPlayer) {
    base = new Base(position.x, position.y, baseHp);
    base.draw(ctx, baseImage);
  } else {
    opponentBase = new Base(position.x, position.y, baseHp);
    opponentBase.draw(opponentCtx, baseImage, true);
  }
}

function spawnMonster() {
  const newMonster = new Monster(
    customMonsterData,
    monsterPath,
    monsterImages,
    opponentMonsterLevel,
  );
  monsters.push(newMonster);

  sendEvent(5, {
    uuid: uuid,
    monsterData: newMonster,
  });
}

function gameLoop() {
  // 렌더링 시에는 항상 배경 이미지부터 그려야 합니다! 그래야 다른 이미지들이 배경 이미지 위에 그려져요!
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // 배경 이미지 다시 그리기
  drawPath(monsterPath, ctx); // 경로 다시 그리기

  ctx.font = '25px Times New Roman';
  ctx.fillStyle = 'skyblue';
  ctx.fillText(`최고 기록: ${highScore}`, 100, 50); // 최고 기록 표시
  ctx.fillStyle = 'white';
  ctx.fillText(`점수: ${score}`, 100, 100); // 현재 스코어 표시
  ctx.fillStyle = 'yellow';
  ctx.fillText(`골드: ${userGold}`, 100, 150); // 골드 표시
  ctx.fillStyle = 'black';
  ctx.fillText(`현재 레벨: ${monsterLevel}`, 100, 200); // 최고 기록 표시
  ctx.fillStyle = 'purple';
  ctx.fillText(`타워 개수: ${currentTowerNum}/${maxTowerNum}`, 100, 250); // 타워 개수 표시

  for (const monster of monsters) {
    monster.draw(ctx);
  }
  for (const monster of opponentMonsters) {
    monster.draw(opponentCtx, true);
  }

  // 타워 그리기 및 몬스터 공격 처리
  towers.forEach((tower, towerIndex) => {
    tower.draw(ctx, towerImages);
    tower.updateCooldown();
    monsters.forEach((monster, monsterIndex) => {
      const distance = Math.sqrt(
        Math.pow(tower.x - monster.x, 2) + Math.pow(tower.y - monster.y, 2),
      );
      if (distance < tower.range) {
        tower.attack(monster);
        sendEvent(77, { uuid, towerIndex, monsterIndex });
      }
    });
  });

  // 몬스터가 공격을 했을 수 있으므로 기지 다시 그리기
  base.draw(ctx, baseImage);

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    if (monster.hp > 0) {
      const Attacked = monster.move();
      if (Attacked) {
        const attackedSound = new Audio('sounds/attacked.wav');
        attackedSound.volume = 0.3;
        attackedSound.play();
        // TODO. 몬스터가 기지를 공격했을 때 서버로 이벤트 전송
        baseHp -= monster.attackPower;
        base.hp -= monster.attackPower;
        sendEvent(33, { uuid, attackedPower: monster.attackPower, baseHp });
        sendEvent(6, { uuid: uuid, monsterData: monster });
        monsters.splice(i, 1);
      }
    } else {
      // TODO. 몬스터 사망 이벤트 전송
      sendEvent(6, { uuid: uuid, monsterData: monster });
      monsters.splice(i, 1);
      userGold += 100;
      score += 100;
      sendEvent(10, { uuid, userGold, score });
    }
  }

  if (baseHp <= 0) {
    sendEvent(98, { uuid });
  }

  // 상대방 게임 화면 업데이트
  opponentCtx.drawImage(backgroundImage, 0, 0, opponentCanvas.width, opponentCanvas.height);
  drawPath(opponentMonsterPath, opponentCtx); // 상대방 경로 다시 그리기

  opponentTowers.forEach((tower) => {
    tower.draw(opponentCtx, towerImages);
    tower.updateCooldown(); // 적 타워의 쿨다운 업데이트
  });

  opponentMonsters.forEach((monster) => {
    monster.move();
    monster.draw(opponentCtx, true);
  });

  opponentBase.draw(opponentCtx, baseImage, true);

  requestAnimationFrame(gameLoop); // 지속적으로 다음 프레임에 gameLoop 함수 호출할 수 있도록 함
}

function initGame() {
  if (isInitGame) {
    return;
  }
  chattingCanvas.style.display = 'flex';
  bgm = new Audio('sounds/bgm.mp3');
  bgm.loop = true;
  bgm.volume = 0.2;
  bgm.play();

  initMap(); // 맵 초기화 (배경, 몬스터 경로 그리기)

  setInterval(spawnMonster, monsterSpawnInterval); // 설정된 몬스터 생성 주기마다 몬스터 생성
  gameLoop(); // 게임 루프 최초 실행
  isInitGame = true;
}

// 이미지 로딩 완료 후 서버와 연결하고 게임 초기화
Promise.all([
  new Promise((resolve) => (backgroundImage.onload = resolve)),
  ...towerImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
  new Promise((resolve) => (baseImage.onload = resolve)),
  new Promise((resolve) => (pathImage.onload = resolve)),
  ...monsterImages.map((img) => new Promise((resolve) => (img.onload = resolve))),
]).then(() => {
  serverSocket = io('http://localhost:5500', {
    auth: {
      token: localStorage.getItem('token2'),
    },
  });

  serverSocket.on('connect_error', (err) => {
    if (err.message === 'Authentication error') {
      alert('잘못된 토큰입니다.');
      location.href = '/login';
    }
  });

  serverSocket.on('connection', (data) => {
    console.log(data);
    // TODO. 서버와 연결되면 대결 대기열 큐 진입
    if (!monsterPath) {
      monsterPath = generateRandomMonsterPath();
    }
    const towerCoords = [];
    for (let i = 0; i < numOfInitialTowers; i++) {
      const { x, y } = getRandomPositionNearPath(50);
      towerCoords.push({ x, y });
    }
    sendEvent(0, { token: serverSocket.auth.token, monsterPath, initialTowerCoords: towerCoords });
  });

  serverSocket.on('chatContents', (data) => {
    const user = data.uuid == uuid ? '나' : '상대방';
    const newMessage = document.createElement('p');
    newMessage.textContent = `${user}: ${data.message}`;

    scrollContainer.appendChild(newMessage);
    console.log('추가 완료');
  });

  serverSocket.on('addTower', (data) => {
    //상대방에게 타워값 받을 경우
    const tower = new Tower(data.opponentTower.x, data.opponentTower.y);
    opponentTowers.push(tower);
    tower.draw(opponentCtx, towerImages);
  });

  serverSocket.on('towerUpgrade', (data) => {
    //상대방에게 타워값 받을 경우
    opponentTowers[data.towerIndex].level += 1;
  });

  serverSocket.on('towerAttackMonster', (data) => {
    const tower = opponentTowers[data.towerIndex];
    const monster = opponentMonsters[data.monsterIndex];
    tower.attack(monster);
  });

  serverSocket.on('response', (data) => {
    // console.log(data);
  });

  serverSocket.on('uuid', (data) => {
    uuid = data;
  });

  serverSocket.on('createOpponentMonster', (data) => {
    const opponentMonster = new Monster(
      customMonsterData,
      opponentMonsterPath,
      monsterImages,
      data.payload.level,
      data.payload.monsterNumber,
      true,
      data.payload,
    );
    opponentMonsters.push(opponentMonster);
  });

  serverSocket.on('removeOpponentMonster', (data) => {
    const { monsterNumber, hp, level, creationTime } = data.payload;

    for (let i = 0; i < opponentMonsters.length; i++) {
      const monster = opponentMonsters[i];
      if (
        monster.monsterNumber == monsterNumber &&
        monster.level == level &&
        monster.creationTime == creationTime
      ) {
        opponentMonsters.splice(i, 1);
        break;
      }
    }
  });

  serverSocket.on('opponentBaseAttacked', (data) => {
    const { opponentBaseHp } = data;
    opponentBase.hp = opponentBaseHp;
  });

  serverSocket.on('opponentUserLevelUp', (data) => {
    opponentMonsterLevel = data.opponentMonsterLevel;
  });

  serverSocket.on('spawnSpecialMonster', (data) => {
    const type = data.type;
    console.log(`Opponent user spawn ${type} in your game!`);
    try {
      switch (type) {
        case 'Scorpion':
          spawnSpecialMonster(8);
          break;
        case 'Wizard':
          spawnSpecialMonster(6);
          break;
        case 'Tanker':
          spawnSpecialMonster(7);
          break;
        default:
          throw new Error('Special monster type is undefined');
      }
    } catch (err) {
      console.error(err);
    }
  });

  serverSocket.on('matchFound', (data) => {
    // 상대가 매치되면 3초 뒤 게임 시작
    progressBarMessage.textContent = '게임이 3초 뒤에 시작됩니다.';

    let progressValue = 0;
    const progressInterval = setInterval(() => {
      progressValue += 10;
      progressBar.value = progressValue;
      progressBar.style.display = 'block';
      loader.style.display = 'none';

      if (progressValue >= 100) {
        clearInterval(progressInterval);
        progressBarContainer.style.display = 'none';
        progressBar.style.display = 'none';
        buyTowerButton.style.display = 'block';
        levelUpButton.style.display = 'block';
        spawnScorpionButton.style.display = 'block';
        spawnWizardButton.style.display = 'block';
        spawnTankerButton.style.display = 'block';
        upgradeTowersButton.style.display = 'block';
        canvas.style.display = 'block';
        opponentCanvas.style.display = 'block';

        // TODO. 유저 및 상대방 유저 데이터 초기화
        towerCost = data.towerCost;
        monsterSpawnInterval = data.monsterSpawnInterval;

        const { user, opponentUser } = data;
        userGold = user.userGold;
        base = user.base;
        baseHp = user.baseHp;
        monsterLevel = user.monsterLevel;
        monsterPath = user.monsterPath;
        initialTowerCoords = user.initialTowerCoords;
        basePosition = user.basePosition;
        for (const monster of user.monsters) {
          monsters.push(monster);
        }
        for (const tower of user.towers) {
          towers.push(tower);
        }
        score = user.score;
        highScore = user.highScore;

        opponentBase = opponentUser.base;
        opponentMonsterPath = opponentUser.monsterPath;
        opponentInitialTowerCoords = opponentUser.initialTowerCoords;
        opponentBasePosition = opponentUser.basePosition;
        opponentMonsterLevel = opponentUser.monsterLevel;
        for (const monster of opponentUser.monsters) {
          opponentMonsters.push(monster);
        }
        for (const tower of opponentUser.towers) {
          opponentTowers.push(tower);
        }
        if (!isInitGame) {
          initGame();
        }
      }
    }, 300);
  });

  serverSocket.on('gameOver', (data) => {
    bgm.pause();
    const { isWin } = data;
    const winSound = new Audio('sounds/win.wav');
    const loseSound = new Audio('sounds/lose.wav');
    winSound.volume = 0.3;
    loseSound.volume = 0.3;
    if (isWin) {
      winSound.play().then(() => {
        alert('당신이 게임에서 승리했습니다!');
        // TODO. 게임 종료 이벤트 전송
        sendEvent(99, { uuid, highScore, score });
        location.reload();
      });
    } else {
      loseSound.play().then(() => {
        alert('아쉽지만 대결에서 패배하셨습니다! 다음 대결에서는 꼭 이기세요!');
        // TODO. 게임 종료 이벤트 전송
        sendEvent(99, { uuid, highScore, score });
        location.reload();
      });
    }
  });
});

const buyTowerButton = document.createElement('button');
buyTowerButton.textContent = '타워 구입';
buyTowerButton.style.position = 'absolute';
buyTowerButton.style.top = '10px';
buyTowerButton.style.right = '10px';
buyTowerButton.style.padding = '10px 20px';
buyTowerButton.style.fontSize = '16px';
buyTowerButton.style.cursor = 'pointer';
buyTowerButton.style.display = 'none';

buyTowerButton.addEventListener('click', placeNewTower);
chatButton.addEventListener('click', chatUpload);

document.body.appendChild(buyTowerButton);

// level up
function levelUp() {
  if (userGold < levelUpCost) {
    const newMessage = document.createElement('p');
    newMessage.textContent = `system: 골드가 부족합니다.\n필요 골드: ${levelUpCost}`;

    scrollContainer.appendChild(newMessage);
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    return;
  }
  // userGold -= levelUpCost;
  monsterLevel++;
  levelUpCost += 10;
  sendEvent(11, { uuid: uuid, monsterLevel });
}
const levelUpButton = document.createElement('button');
levelUpButton.textContent = 'Level Up';
levelUpButton.style.position = 'absolute';
levelUpButton.style.top = '60px';
levelUpButton.style.right = '10px';
levelUpButton.style.padding = '10px 20px';
levelUpButton.style.fontSize = '16px';
levelUpButton.style.cursor = 'pointer';
levelUpButton.style.display = 'none';

levelUpButton.addEventListener('click', levelUp);

document.body.appendChild(levelUpButton);

function spawnSpecialMonster(type) {
  const newMonster = new Monster(monsterPath, monsterImages, opponentMonsterLevel, type);
  monsters.push(newMonster);

  sendEvent(5, {
    uuid: uuid,
    monsterData: newMonster,
  });
}

// Spawn scorpion in opponent game
function spawnScorpion() {
  if (userGold < scorpionCost) {
    const newMessage = document.createElement('p');
    newMessage.textContent = `system: 골드가 부족합니다.\n필요 골드: ${scorpionCost}`;

    scrollContainer.appendChild(newMessage);
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    return;
  }
  // userGold -= scorpionCost;
  sendEvent(55, { uuid: uuid, type: 'Scorpion' });
}
const spawnScorpionButton = document.createElement('button');
spawnScorpionButton.textContent = 'Scorpion';
spawnScorpionButton.style.position = 'absolute';
spawnScorpionButton.style.top = '110px';
spawnScorpionButton.style.right = '10px';
spawnScorpionButton.style.padding = '10px 20px';
spawnScorpionButton.style.fontSize = '16px';
spawnScorpionButton.style.cursor = 'pointer';
spawnScorpionButton.style.display = 'none';

spawnScorpionButton.addEventListener('click', spawnScorpion);

document.body.appendChild(spawnScorpionButton);

// Spawn wizard in opponent game
function spawnWizard() {
  if (userGold < wizardCost) {
    const newMessage = document.createElement('p');
    newMessage.textContent = `system: 골드가 부족합니다.\n필요 골드: ${wizardCost}`;

    scrollContainer.appendChild(newMessage);
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    return;
  }
  // userGold -= wizardCost;
  sendEvent(55, { uuid: uuid, type: 'Wizard' });
}
const spawnWizardButton = document.createElement('button');
spawnWizardButton.textContent = 'Wizard';
spawnWizardButton.style.position = 'absolute';
spawnWizardButton.style.top = '160px';
spawnWizardButton.style.right = '10px';
spawnWizardButton.style.padding = '10px 20px';
spawnWizardButton.style.fontSize = '16px';
spawnWizardButton.style.cursor = 'pointer';
spawnWizardButton.style.display = 'none';

spawnWizardButton.addEventListener('click', spawnWizard);

document.body.appendChild(spawnWizardButton);

// Spawn tanker in opponent game
function spawnTanker() {
  if (userGold < tankerCost) {
    const newMessage = document.createElement('p');
    newMessage.textContent = `system: 골드가 부족합니다.\n필요 골드: ${tankerCost}`;

    scrollContainer.appendChild(newMessage);
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
    return;
  }
  // userGold -= tankerCost;
  sendEvent(55, { uuid: uuid, type: 'Tanker' });
}
const spawnTankerButton = document.createElement('button');
spawnTankerButton.textContent = 'Tanker';
spawnTankerButton.style.position = 'absolute';
spawnTankerButton.style.top = '210px';
spawnTankerButton.style.right = '10px';
spawnTankerButton.style.padding = '10px 20px';
spawnTankerButton.style.fontSize = '16px';
spawnTankerButton.style.cursor = 'pointer';
spawnTankerButton.style.display = 'none';

spawnTankerButton.addEventListener('click', spawnTanker);

document.body.appendChild(spawnTankerButton);

function upgradeTowers() {
  if (userGold < towerUpgradeCost) {
    const newMessage = document.createElement('p');
    newMessage.textContent = `system: 타워 업그레이드 비용이 부족합니다.`;

    scrollContainer.appendChild(newMessage);
    return;
  }
  let upgradeTowerNumList = [];
  towers.forEach((tower, index) => {
    if (tower.level < 6) {
      upgradeTowerNumList.push(index);
    }
  })
  if (upgradeTowerNumList.length != 0) {
    const upgradeTowerNum = Math.floor(Math.random() * upgradeTowerNumList.length);
    towers[upgradeTowerNumList[upgradeTowerNum]].level += 1;
    userGold -= towerUpgradeCost;
    sendEvent(67, { uuid, towerIndex: upgradeTowerNumList[upgradeTowerNum], userGold })
  } else {
    const newMessage = document.createElement('p');
    newMessage.textContent = `system: 업그레이드 가능한 타워가 없습니다.`;

    scrollContainer.appendChild(newMessage);
    return;
  }

}
const upgradeTowersButton = document.createElement('button');
upgradeTowersButton.textContent = 'Upgrade';
upgradeTowersButton.style.position = 'absolute';
upgradeTowersButton.style.top = '260px';
upgradeTowersButton.style.right = '10px';
upgradeTowersButton.style.padding = '10px 20px';
upgradeTowersButton.style.fontSize = '16px';
upgradeTowersButton.style.cursor = 'pointer';
upgradeTowersButton.style.display = 'none';

upgradeTowersButton.addEventListener('click', upgradeTowers);

document.body.appendChild(upgradeTowersButton);

export const sendEvent = (handlerId, payload) => {
  serverSocket.emit('event', {
    handlerId,
    version,
    sequence,
    payload,
  });
};
