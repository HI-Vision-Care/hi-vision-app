export interface SignInParams {
  username: string;
  password: string;
}
export interface SignInResponse {
  token: string;
  username: string;
}

export interface SignUpResponse {
  id: string;
  username: string;
  password: string; // đây là password đã được hash
  email: string;
  phone: string;
}

export interface SignUpParams {
  username: string;
  password: string;
  email: string;
  phone: string;
}
