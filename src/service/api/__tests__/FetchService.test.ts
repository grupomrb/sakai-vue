// /f:/DOCUMENTOS/Vue-proyect/sakai-vue/src/service/api/__tests__/FetchService.test.ts

// Mock manual del router
const mockRouter = {
    push: jest.fn()
};
jest.mock('@/router', () => mockRouter);

// Mock manual de cookiesUtils
const mockCookiesUtils = {
    getCookie: jest.fn(),
    deleteCookie: jest.fn()
};

jest.mock('@/utils/cookies', () => ({
    cookiesUtils: mockCookiesUtils
}));

import router from '@/router';
import { cookiesUtils } from '@/utils/cookies';
import { FetchService } from '../FetchService';

// Mock de las dependencias
jest.mock('@/utils/cookies');
jest.mock('@/router');

interface FetchError {
    message: string;
    status?: number;
}

describe('FetchService', () => {
    // Configuración antes de cada test
    beforeEach(() => {
        // Limpiar todos los mocks
        jest.clearAllMocks();
        // Restaurar fetch global
        global.fetch = jest.fn();
    });

    describe('fetch', () => {
        it('debería hacer una petición exitosa con token', async () => {
            // Arrange
            const mockToken = 'test-token';
            const mockResponse = { data: 'test' };
            (cookiesUtils.getCookie as jest.Mock).mockReturnValue(mockToken);
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                text: () => Promise.resolve(JSON.stringify(mockResponse))
            });

            // Act
            const result = await FetchService.fetch('/test');

            // Assert
            expect(result).toEqual(mockResponse);
            expect(global.fetch).toHaveBeenCalledWith(
                '/serverms/test',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: mockToken
                    })
                })
            );
        });

        it('debería manejar respuesta vacía correctamente', async () => {
            // Arrange
            (cookiesUtils.getCookie as jest.Mock).mockReturnValue('token');
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                text: () => Promise.resolve('null')
            });

            // Act
            const result = await FetchService.fetch('/test');

            // Assert
            expect(result).toBeNull();
        });

        it('debería redirigir al login cuando no hay token', async () => {
            // Arrange
            (cookiesUtils.getCookie as jest.Mock).mockReturnValue('');

            // Act
            try {
                await FetchService.fetch('/test');
            } catch (error) {
                const fetchError = error as FetchError;
                // Assert
                expect(router.push).toHaveBeenCalledWith('/auth/login');
                expect(cookiesUtils.deleteCookie).toHaveBeenCalledWith('authToken');
                expect(cookiesUtils.deleteCookie).toHaveBeenCalledWith('username');
            }
        });

        it('debería manejar error 401', async () => {
            // Arrange
            (cookiesUtils.getCookie as jest.Mock).mockReturnValue('token');
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 401
            });

            // Act
            try {
                await FetchService.fetch('/test');
            } catch (error) {
                const fetchError = error as FetchError;
                // Assert
                expect(fetchError.message).toBe('UNAUTHORIZED');
                expect(router.push).toHaveBeenCalledWith('/auth/login');
            }
        });
    });

    describe('isAuthenticated', () => {
        it('debería retornar true cuando existe token', () => {
            // Arrange
            (cookiesUtils.getCookie as jest.Mock).mockReturnValue('token');

            // Act
            const result = FetchService.isAuthenticated();

            // Assert
            expect(result).toBe(true);
        });

        it('debería retornar false cuando no existe token', () => {
            // Arrange
            (cookiesUtils.getCookie as jest.Mock).mockReturnValue('');

            // Act
            const result = FetchService.isAuthenticated();

            // Assert
            expect(result).toBe(false);
        });
    });
});
