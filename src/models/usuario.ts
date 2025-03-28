export interface Usuario {
    id: number;
    username: string;
    password: string;
    role: 'admin' | 'user';
}