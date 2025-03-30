import router from '@/router';
import { cookiesUtils } from '@/utils/cookies';

interface FetchOptions extends RequestInit {
    baseURL?: string;
}

interface AuthData {
    token: string;
    username: string;
}

export class FetchService {
    private static readonly DEFAULT_BASE_URL = '/serverms';

    private static handleUnauthorized() {
        // Limpiar cookies
        cookiesUtils.deleteCookie('authToken');
        cookiesUtils.deleteCookie('username');

        // Usar la función de navegación
        router.push('/auth/login');
    }

    private static async handleResponse(response: Response) {
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('UNAUTHORIZED');
            } else if (response.status === 404) {
                console.error('Resource not found');
                throw new Error('NOT_FOUND');
            }

            const error = await response.json().catch(() => ({
                message: 'Error en el servidor'
            }));
            throw new Error(error.message || `Error ${response.status}`);
        }
        // Para manejar ResponseEntity<>(null, HttpStatus.OK)
        try {
            const text = await response.text();
            // Si el texto está vacío o es "null", retornamos null
            if (!text || text === 'null') {
                console.log('Respuesta exitosa pero sin contenido');
                return null;
            }
            // Si hay contenido, lo parseamos como JSON
            return JSON.parse(text);
        } catch (error) {
            console.log('Error al parsear la respuesta:', error);
            return null;
        }
    }

    static async fetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
        try {
            const token = cookiesUtils.getCookie('authToken');

            if (!token && !url.includes('/authentication')) {
                this.handleUnauthorized();
                throw new Error('No hay token de autenticación');
            }

            const baseURL = options.baseURL || this.DEFAULT_BASE_URL;
            const fullUrl = `${baseURL}${url}`;

            const fetchOptions: RequestInit = {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: token }),
                    ...(options.headers || {})
                }
            };

            const response = await fetch(fullUrl, fetchOptions);
            return (await this.handleResponse(response)) as T;
        } catch (error) {
            if (error instanceof Error && error.message === 'UNAUTHORIZED') {
                this.handleUnauthorized();
            }
            throw error;
        }
    }

    static isAuthenticated(): boolean {
        return !!cookiesUtils.getCookie('authToken');
    }
}
