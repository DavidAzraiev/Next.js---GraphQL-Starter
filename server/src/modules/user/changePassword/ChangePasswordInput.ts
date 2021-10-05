import { PasswordInput } from './../../shared/PasswordInput';
import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ChangePasswordInput extends PasswordInput {
  @Field()
  token: string;
}
