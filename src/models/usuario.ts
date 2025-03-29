export interface Usuario {
    id: number;
    username: string;
    password: string;
    correo: string;
    role: 'admin' | 'user';
}