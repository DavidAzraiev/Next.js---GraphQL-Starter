import { MyContext } from 'src/types/MyContext';
import bcrypt from 'bcryptjs';
import { ChangePasswordInput } from './changePassword/ChangePasswordInput';
import { forgotPasswordPrefix } from './../constants/redisPrefixes';
import { redis } from './../../redis';
import { User } from './../../entity/User';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg('data') { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return null;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    await redis.del(forgotPasswordPrefix + token);

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    ctx.req.session!.userId = user.id;

    return user;
  }
}
