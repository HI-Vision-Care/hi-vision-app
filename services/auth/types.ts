export interface SignInParams {
  email: string;
  password: string;
}
export interface SignInResponse {
  token: string;
  email: string;
}

export interface SignUpResponse {
  id: string;
  token: string;
  username: string;
  password: string; // đây là password đã được hash
  email: string;
  phone: string;
}

export interface SignUpParams {
  password: string;
  email: string;
  phone: string;
}

export interface ErrorResponse {
  code: number;
  message: string;
  data?: any;
  response: string;
}
