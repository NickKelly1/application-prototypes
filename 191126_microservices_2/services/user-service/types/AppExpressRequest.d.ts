export interface AppExpressRequest {
  auth:
  {
    isAuthenticated: false,
    reason: string,
  } | {
    isAuthenticated: true,
    type: 'basic' | 'jwt',
    admin: boolean,
    username: string,
  }

  apis: {};
}
