export interface UserAuth {
  token: string;
}

export interface UserModel {
  name: string;
  id: string;
  email: string;
}

export interface UserCurrentSessionState {
  id: UserModel['id'];
  since: number;
  expiresAt: number;
}

export type UserModelWithPassword = UserModel & { password: string };

export type AuthTokenUserMap = Map<UserAuth['token'], UserCurrentSessionState>;
