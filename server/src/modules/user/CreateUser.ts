import { RegisterInput } from './register/RegisterInput';
import { User } from './../../entity/User';
import { Arg, ClassType, Mutation, Resolver } from 'type-graphql';

function createResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any
) {
  @Resolver()
  class BaseResolver {
    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg('data', () => inputType) data: any) {
      return entity.create(data).save();
    }
  }

  return BaseResolver;
}

export const CreateUserResolver = createResolver(
  'User',
  User,
  RegisterInput,
  User
);
