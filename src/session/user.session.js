import User from "../class/model/user.class.js";
import { userSessions } from "./session.js";

export const addUser = (uuid) => {
  const user = new User(uuid);
  userSessions.push(user);
  return user;
};

export const removeUser = (uuid) => {
  let index;
  index = userSessions.findIndex((user) => user.uuid === uuid);
  userSessions.splice(index, 1);
};

export const getUser = (uuid) => {
  return userSessions.find((user) => user.uuid === uuid);
};

export const getAllUserSessions = () => {
  return userSessions;
};

export const clearSession = () => {
  userSessions.splice(0, userSessions.length);
};
