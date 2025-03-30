import { cookiesUtils } from '@/utils/cookies';
import { defineStore } from 'pinia';

// Definir interfaces para los datos
interface AuthData {
    token: string;
    username: string;
}

interface UserData {
    iduser: number;
    firstName: string;
    lastName: string;
}

interface CompanyData {
    company: {
        idcompany: number;
        nameCompany: string;
    };
}

// Definir la interfaz para el estado
interface AuthState {
    isAuthenticated: boolean;
    user_name: string | null;
    user_id: number | null;
    user_fistname: string | null;
    user_lastname: string | null;
    company_id: number | null;
    company_nameCompany: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        isAuthenticated: false,
        user_name: null,
        user_id: null,
        user_fistname: null,
        user_lastname: null,
        company_id: null,
        company_nameCompany: null
    }),
    actions: {
        setAuthData(data: AuthData) {
            // Guardar el token en una cookie
            cookiesUtils.setCookie('authToken', data.token); // Expira en 1 día
            cookiesUtils.setCookie('username', data.username);
            // Guardar datos no sensibles en el store
            this.isAuthenticated = true;
            this.user_name = data.username;
        },
        setUser(data: UserData) {
            this.user_id = data.iduser;
            this.user_fistname = data.firstName;
            this.user_lastname = data.lastName;
        },
        setCompany(data: CompanyData) {
            this.company_id = data.company.idcompany;
            this.company_nameCompany = data.company.nameCompany;
        },
        // Verificar si hay un token almacenado
        checkAuth(): boolean {
            const token = cookiesUtils.getCookie('authToken');
            return !!token;
        },
        logout(): void {
            // Eliminar la cookie del token
            cookiesUtils.deleteCookie('authToken');

            // Limpiar el estado
            // Limpiar el estado
            this.isAuthenticated = false;
            this.user_name = null;
            this.user_id = null;
            this.user_fistname = null;
            this.user_lastname = null;
            this.company_id = null;
            this.company_nameCompany = null;
        }
    }
});
