import Game from '../class/model/game.class.js';
import { gameSessions } from './session.js';

export const addGame = (gameId) => {
  const game = new Game(gameId);
  gameSessions.push(game);
  return game;
};

export const removeGame = (gameId) => {
  let index;
  index = gameSessions.findIndex((game) => game.gameId === gameId);
  gameSessions.splice(index, 1);
};

export const getGame = (gameId) => {
  return gameSessions.find((game) => game.gameId === gameId);
};

export const getAllGameSessions = () => {
  return gameSessions;
};

export const clearSession = () => {
  gameSessions.splice(0, gameSessions.length);
};
