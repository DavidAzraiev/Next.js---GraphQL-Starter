import { forgotPasswordPrefix } from './../constants/redisPrefixes';
import { redis } from './../../redis';
import { User } from './../../entity/User';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = v4();
    await redis.set(forgotPasswordPrefix + token, user.id, 'ex', 60 * 60 * 24); //1Day expiration

    await sendEmail(
      email,
      `http://localhost:3000/user/chnage-password/${token}`
    );

    return true;
  }
}
