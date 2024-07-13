export const gameStartHandler = (game) => {
  const user1 = game.users[0];
  const user2 = game.users[1];

  game.stateChange('playing');

  const user1Data = JSON.stringify({
    uuid: user1.uuid,
    userGold: user1.userGold,
    base: user1.base,
    baseHp: user1.baseHp,
    monsterLevel: user1.monsterLevel,
    monsterPath: user1.monsterPath,
    initialTowerCoords: user1.initialTowerCoords,
    basePosition: user1.basePosition,
    monsters: user1.monsters,
    towers: user1.towers,
    score: user1.score,
    highScore: user1.highScore,
    // socket 제외
  });

  const user2Data = JSON.stringify({
    uuid: user2.uuid,
    userGold: user2.userGold,
    base: user2.base,
    baseHp: user2.baseHp,
    monsterLevel: user2.monsterLevel,
    monsterPath: user2.monsterPath,
    initialTowerCoords: user2.initialTowerCoords,
    basePosition: user2.basePosition,
    monsters: user2.monsters,
    towers: user2.towers,
    score: user2.score,
    highScore: user2.highScore,
    // socket 제외
  });

  user1.socket.emit('matchFound', {
    user: JSON.parse(user1Data),
    opponentUser: JSON.parse(user2Data),
    towerCost: game.towerCost,
    monsterSpawnInterval: game.monsterSpawnInterval,
  });
  user2.socket.emit('matchFound', {
    user: JSON.parse(user2Data),
    opponentUser: JSON.parse(user1Data),
    towerCost: game.towerCost,
    monsterSpawnInterval: game.monsterSpawnInterval,
  });
};
