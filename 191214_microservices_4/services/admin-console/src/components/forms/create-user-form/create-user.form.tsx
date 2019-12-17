import React, { useState, Reducer, useReducer, useEffect, useCallback } from "react";
import { dispatchToKey } from "../../../helpers/dispatch-to-key.helper";

export interface ICreateUserForm {
  email: string;
  first: string;
  middle: string;
  last: string;
  password: string;
}

export const initialCreateUserForm: ICreateUserForm = {
  email: '',
  first: '',
  middle: '',
  last: '',
  password: ''
};

interface CreateUserFormProps {
  user: ICreateUserForm
  onSubmit(payload: ICreateUserForm): any 
}

/**
 * @description
 * A Create User form
 * 
 */
export const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSubmit, user = initialCreateUserForm }) => {
  const [ dirtyUserForm, setDirtyUserForm ] = useState<ICreateUserForm>(user);

  useEffect(() => { setDirtyUserForm(user) }, [user]);


  return (
    <div>
      <div>
        <label>email</label>
        <input
          type="email"
          onChange={dispatchToKey(setDirtyUserForm, 'email')}
          value={dirtyUserForm.email}
        />
      </div>
      <div>
        <label>first</label>
        <input
          type="first-name"
          onChange={dispatchToKey(setDirtyUserForm, 'first')}
          value={dirtyUserForm.first}
        />
      </div>
      <div>
        <label>middle</label>
        <input
          type="middle-name"
          onChange={dispatchToKey(setDirtyUserForm, 'middle')}
          value={dirtyUserForm.middle}
        />
      </div>
      <div>
        <label>last</label>
        <input
          type="last-name"
          onChange={dispatchToKey(setDirtyUserForm, 'last')}
          value={dirtyUserForm.last}
        />
      </div>
      <div>
        <label>password</label>
        <input
          type="password"
          onChange={dispatchToKey(setDirtyUserForm, 'password')}
          value={dirtyUserForm.password}
        />
      </div>
      <div>
        <button
          onClick={() => onSubmit(dirtyUserForm)}
        >Submit</button>
      </div>
    </div>
  );
}