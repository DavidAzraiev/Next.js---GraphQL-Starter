import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  name: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Column()
  password: string;
}
