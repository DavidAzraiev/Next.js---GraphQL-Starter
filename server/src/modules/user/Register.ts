import { isAuth } from './../middleware/isAuth';
import { User } from './../../entity/User';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { RegisterInput } from './register/RegisterInput';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmation } from '../utils/createConfirmation';

@Resolver()
export class RegisterResolver {
  // @Authorized() one way to authorized user with roles
  @Query(() => String)
  @UseMiddleware(isAuth)
  async Hello() {
    return 'Hello World!';
  }

  @Mutation(() => User)
  async register(
    @Arg('data') { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    await sendEmail(email, await createConfirmation(user.id));

    return user;
  }
}
