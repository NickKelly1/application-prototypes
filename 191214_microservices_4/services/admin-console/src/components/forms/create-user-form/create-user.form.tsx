import React, { useState } from "react";
import { dispatchToKey } from "../../../helpers/dispatch-to-key.helper";

export interface ICreateUserForm {
  email: string;
  first: string;
  middle: string;
  last: string;
  password: string;
}

const initialCreateUserForm = {
  email: '',
  first: '',
  middle: '',
  last: '',
  password: ''
};

/**
 * @description
 * A Create User form
 * 
 */
export const CreateUserForm: React.FC = () => {
  const [ cleanUserForm, setCleanUserForm ] = useState<ICreateUserForm>(initialCreateUserForm);
  const [ dirtyUserForm, setDirtyUserForm ] = useState<ICreateUserForm>(initialCreateUserForm);

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
          onClick={() => console.log('TODO submitting...')}
        >Submit</button>
      </div>
    </div>
  );
}