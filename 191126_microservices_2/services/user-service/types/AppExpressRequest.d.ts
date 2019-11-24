export interface AppExpressRequest {
  auth:
  { isAuthenticated: true; username: string }
  | { isAuthenticated: false; reason: string };

  apis: {};
}
