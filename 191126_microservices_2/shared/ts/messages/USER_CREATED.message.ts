export type USER_CREATED = {
  type: 'user-created',
  payload: {
    id: string,
    first_name: string,
    last_name: string,
  }
};
