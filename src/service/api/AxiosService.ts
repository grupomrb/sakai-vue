import axios, { AxiosInstance } from 'axios';

/**
 * Crea una instancia de servicio API con una URL base específica
 * @param baseURL - URL base para las peticiones API (opcional)
 * @returns Instancia de Axios configurada
 */
export const createApiService = (baseURL?: string): AxiosInstance => {
    console.log('Creando servicio con base URL:', baseURL);

    // Crear una instancia de axios con la URL base proporcionada
    const api = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Interceptores y configuración adicional...
    console.log('Creando servicio con base URL:', api);
    return api;
};

/**
 * Crea un servicio API que utiliza el proxy configurado en vite.config.mjs
 * @returns Instancia de Axios configurada para usar el proxy
 */
export const createProxyApiService = (): AxiosInstance => {
    // Usamos la ruta del proxy sin duplicar '/serverms'
    return createApiService('/serverms');
};

// Exportar una instancia por defecto (sin URL base)
export default createApiService();
