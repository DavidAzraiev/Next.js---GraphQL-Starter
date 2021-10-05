import { confirmUserPrefix } from './../constants/redisPrefixes';
import { v4 } from 'uuid';
import { redis } from './../../redis';

export const createConfirmation = async (userId: number) => {
  const token = v4();

  await redis.set(confirmUserPrefix + token, userId, 'ex', 60 * 60 * 24); //1Day expiration

  return `http://localhost:3000/user/confirm/${token}`;
};
