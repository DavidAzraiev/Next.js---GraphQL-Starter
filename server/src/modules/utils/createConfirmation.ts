import { redis } from './../../redis';
import { v4 } from 'uuid';

export const createConfirmation = async (userId: number) => {
  const token = v4();

  await redis.set(token, userId, 'ex', 60 * 60 * 24); //1Day expiration

  return `http://localhost:3000/user/confirm/${token}`;
};
