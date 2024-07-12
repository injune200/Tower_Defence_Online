import { initialGame } from '../../app.js';
import { addUser } from '../../session/user.session.js';
import { authorization } from '../authorization/authorization.js';

export const waitForMatch = async (socket, payload) => {
  const uuid = await authorization(payload);
  const user = addUser(uuid);
  initialGame.addUser(user);
  if (initialGame.users.length === 2) {
    // start game
    console.log('start game');
  }

  return { status: 'success', message: 'Waiting for user ...' };
};
