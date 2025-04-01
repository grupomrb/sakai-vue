// jest.setup.ts
import '@testing-library/jest-dom';

// Configuración global de fetch para tests
global.fetch = jest.fn();

// Limpiar todos los mocks después de cada test
afterEach(() => {
    jest.clearAllMocks();
});
