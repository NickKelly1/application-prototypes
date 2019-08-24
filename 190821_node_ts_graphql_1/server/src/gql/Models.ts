import { UserEntity } from '../entities/UserEntity';
import { ProfileEntity } from '../entities/ProfileEntity';
import { PhotoEntity } from '../entities/PhotoEntity';

export interface Context {
  data: {};
}

// export type User = UserEntity;

export interface User {
  user: UserEntity;
}
// export interface User {
//   // id: UserEntity['id'];
//   // email: UserEntity['email'];
//   // profileId: UserEntity['profileId'];
//   // profile: UserEntity['profile'];
//   [T in keyof User] UserEntity[T]
// }

export interface Profile {
  profile: ProfileEntity;
}


export interface Photo {
  photo: PhotoEntity;
}

