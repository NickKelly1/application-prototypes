import { model, Schema, Document, SchemaDefinition, HookSyncCallback } from 'mongoose';
import { pick, $TS_FIX_ME } from '@syntaxfanatics/peon';
import bcrypt from 'bcryptjs';

// https://medium.com/@tomanagle/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722

export interface IUserAttributes {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  checkPassword(this: IUser, password: string): Promise<boolean>;
}
export type IUser = IUserAttributes & Document;
export type IDBUserAttributes = IUserAttributes & { _id: IUser['_id'] };



// do not explicitly type this as SchemaDefinition
// its index type is required downstream
const userSchemaDefinition = {
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
} as const;



const UserSchema: Schema = new Schema(
  userSchemaDefinition,
  { timestamps: true },
);


/**
 * hash password before saving (if it's changed)
 */
UserSchema.pre<IUser>('save', function preSave(this: IUser) {
  return new Promise((res, rej) => {
    if (!this.isModified('password')) return res();

    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) rej(err);
      else {
        this.password = hash;
        res();
      }
    });
  });
});


/**
 * Does the unhashed password match the users hashed password?
 */
UserSchema.methods.checkPassword = function(this: IUser, password: string) {
  const passwordHash = this.password;
  return new Promise((res, rej) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) rej(err);
      else res(same);
    });
  });
}



export const userAttributes = Object.keys(userSchemaDefinition) as (keyof typeof userSchemaDefinition)[];



/**
 * Map user attributes from a user instance
 *
 * @param user
 */
export function extractUserAttributes<R extends Record<string, any>>(from: R) {
  const attributes = pick(...userAttributes)(from);
  return attributes;
}



export function mapUserAttributes(user: IUser) {
  return extractUserAttributes(user);
}



// Export the model and return the interface
export const UserModel = model<IUser>('users', UserSchema);
export type UserModel = typeof UserModel;
