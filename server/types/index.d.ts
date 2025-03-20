declare namespace Express {
  export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isEmailVerified: boolean;
  }
}
