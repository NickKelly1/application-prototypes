import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, BaseEntity } from 'typeorm';
import { User } from './User';
import { Photo } from './Photo';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn() id!: number;

  @OneToOne((type) => Profile, (user: User) => user.profile, { nullable: true})

  @Column() favouriteColour!: string;
}