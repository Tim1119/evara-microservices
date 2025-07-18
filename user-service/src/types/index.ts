export interface IUser{
    _id?:string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    isVerified: boolean;
    createdAt:Date;
    updatedAt:Date;
    role: 'customer' | 'admin' | 'moderator';
}

export interface AuthRequest{
    email:string;
    password:string;
}

export interface RegisterRequest{
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    role?: 'customer' | 'admin';
}

export interface AuthResponse{
    success:boolean;
    message:string;
    token?:string;
    user?:Omit<IUser,'password'>
}

export interface AuthenticatedRequest extends Request{
    user?:IUser;
}