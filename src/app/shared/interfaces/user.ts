
export interface ILoginRequest {
  email: string;
  password: string;
}


export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface IRegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
  dateOfBirth: string;
  role: string;
}

export interface IRegisterResponse {
  token: string;
  user: IUser;
}


export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string | null;
}

