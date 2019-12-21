import React, { useState, Reducer, useReducer, useEffect, useCallback } from "react";
import { dispatchToKey } from "../../../../helpers/dispatch-to-key.helper";
import { Formik, Form, Field, ErrorMessage, useFormik, useField, useFormikContext } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import './create-user-form.css';



export interface ICreateUserFormData {
  email: string;
  first: string;
  middle: string;
  last: string;
  password: string;
}



export const initialCreateUserForm: ICreateUserFormData = {
  email: '',
  first: '',
  middle: '',
  last: '',
  password: ''
};



interface CreateUserFormProps {
  user?: ICreateUserFormData
  onSubmit?: (payload: ICreateUserFormData) => any 
}



/**
 * @description
 * A Create User form
 * 
 */
export const CreateUserForm: React.FC<CreateUserFormProps> = ({
  onSubmit = () => { console.log('[CreateUserForm] submitted') },
  user = initialCreateUserForm
}) => {

  const formik = useFormik({
    initialValues: user,
    onSubmit: (values) => new Promise(res => setTimeout(() => res(alert(JSON.stringify(values, null, 2))), 200)),
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
    >
      <div className="row field">
        <label htmlFor="email" className="">Email address</label>
        <input name="email" type="email" onChange={formik.handleChange} value={formik.values.email} />
      </div>
      <div className="row">
        <label htmlFor="first" >First</label>
        <input name="first" type="first" onChange={formik.handleChange} value={formik.values.first} />
        <label htmlFor="middle" >Middle name</label>
        <input name="middle" type="middle" onChange={formik.handleChange} value={formik.values.middle} />
        <label htmlFor="last" >Last</label>
        <input name="last" type="last" onChange={formik.handleChange} value={formik.values.last} />
      </div>
      <Button variant="contained" color="primary" type="submit" >Submit</Button>
    </form>
  )
}