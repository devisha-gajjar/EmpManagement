export interface LoginData {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string;
    zipcode: string;
}
