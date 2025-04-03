import { configure } from 'vee-validate';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.ts';

import { $t } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';

// Limpiar cualquier configuración anterior
localStorage.removeItem('primevue-theme-primary');
localStorage.removeItem('primevue-theme');
localStorage.removeItem('primevue-theme-surface');

// Configurar el tema azul como predeterminado
const blueColorPalette = {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
};

// Configurar la superficie gray como predeterminada
const grayPalette = {
    0: '#ffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
};

// Aplicar tema azul y superficie gray
const themeConfig = {
    semantic: {
        primary: blueColorPalette,
        surface: grayPalette,
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.500}',
                    contrastColor: '#ffff',
                    hoverColor: '{primary.600}',
                    activeColor: '{primary.700}'
                },
                highlight: {
                    background: '{primary.50}',
                    focusBackground: '{primary.100}',
                    color: '{primary.700}',
                    focusColor: '{primary.800}'
                }
            },
            dark: {
                primary: {
                    color: '{primary.400}',
                    contrastColor: '{surface.900}',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                },
                highlight: {
                    background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                    focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                }
            }
        }
    }
};

// Aplicar la configuración del tema
$t().preset(themeConfig).surfacePalette(grayPalette).use({ useDefaultOptions: true });

// Guardar en localStorage para persistencia
localStorage.setItem('primevue-theme-primary', 'blue');
localStorage.setItem('primevue-theme-surface', 'gray');

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark',
            primaryColor: 'blue',
            surface: 'gray'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(pinia);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);

configure({
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: true,
    validateOnModelUpdate: true
});

app.mount('#app');
// Redirigir a login al iniciar la aplicación
//router.push('/auth/login');
