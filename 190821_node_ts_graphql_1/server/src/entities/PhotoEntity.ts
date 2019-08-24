import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

const PHOTOS_TABLE = 'photos';

@Entity({ name: PHOTOS_TABLE })
export class PhotoEntity extends BaseEntity {
  @PrimaryGeneratedColumn() id!: number;

  @Column() url!: string;

  @Column()
  userId!: number;

  @ManyToOne(type => UserEntity, (user: UserEntity) => user.photos)
  user!: UserEntity;
}

// export for graphql codegen
export interface Photo extends PhotoEntity {}
