<script setup lang="ts">
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { createApiService } from '@/service/api/AxiosService';
import { useAuthStore } from '@/store/auth';
import { AxiosError, AxiosResponse } from 'axios';
import Message from 'primevue/message';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

// Define interfaces para LoginDTO
interface LoginDTO {
    username: string;
    password: string;
}

// Interfaces LoginResponse
interface LoginResponse {
    username: string;
    token: string;
    authenticate: boolean;
    time: string;
    message: string;
    companyActive: boolean;
}

interface UserData {
    active: boolean;
}

interface ErrorState {
    username: string;
    password: string;
    api: string;
}

interface ApiErrorResponse {
    message: string;
}

// Define los tipos validos para el Toast
type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

const router = useRouter();
const username = ref<string>('');
const password = ref<string>('');
const checked = ref<boolean>(false);
const errors = ref<ErrorState>({
    username: '',
    password: '',
    api: ''
});
const submitted = ref<boolean>(false);
const loading = ref<boolean>(false); // Para controlar el estado de carga
const toast = useToast();
const authStore = useAuthStore();

// Cargar el nombre de usuario guardado al iniciar el componente
onMounted(async () => {
    // Si venimos de una sesión expirada, mostrar el mensaje
    const expired = router.currentRoute.value.query.expired;
    if (expired) {
        toast.add({
            severity: 'error',
            summary: 'Sesión expirada',
            detail: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            life: 8000
        });
    }
    try {
        const savedUsername = localStorage.getItem('rememberedUser');
        if (savedUsername) {
            username.value = savedUsername;
            checked.value = true;
        }
    } catch (error) {
        if (error instanceof AxiosError) {
            showToast('error', 'Error consultando servicios', error.message);
        } else {
            // Handle other types of errors
            showToast('error', 'Error desconocido', 'Ha ocurrido un error inesperado.');
        }
    }
});

// Función para mostrar mensajes de error en el toast
const showToast = (severity: ToastSeverity, summary: string, message: string): void => {
    toast.add({ severity, summary, detail: message, life: 8000 });
};

// Watchers para limpiar errores cuando el usuario corrige los campos
watch(username, (newValue: string) => {
    if (newValue.trim() !== '' && errors.value.username) {
        errors.value.username = '';
    }
});

watch(password, (newValue: string) => {
    if (newValue !== '' && errors.value.password) {
        errors.value.password = '';

        // Si el error era por longitud mínima, verificar si ya cumple
        if (newValue.length >= 6) {
            errors.value.password = '';
        } else {
            errors.value.password = 'La Contraseña debe tener al menos 6 caracteres';
        }
    }
});

// Función de Validación
const validateForm = (): boolean => {
    submitted.value = true;
    errors.value.username = '';
    errors.value.password = '';
    errors.value.api = '';

    let isValid = true;

    // Username validation
    if (!username.value.trim()) {
        errors.value.username = 'El Usuario es requerido';
        isValid = false;
        showToast('error', 'Error de validación', errors.value.username);
    }

    // Password validación
    if (!password.value) {
        errors.value.password = 'La Contraseña es requerida';
        isValid = false;
        showToast('error', 'La Contraseña es requerida', errors.value.username);
    } else if (password.value.length < 6) {
        showToast('error', 'La Contraseña debe tener al menos 6 caracteres', errors.value.username);
        errors.value.password = 'La Contraseña debe tener al menos 6 caracteres';
        isValid = false;
    }
    return isValid;
};

// Login Handler
const hadlerLogin = async (): Promise<void> => {
    if (validateForm()) {
        try {
            loading.value = true;
            // Creamos el objeto LoginDTO directamente con los valores del formulario
            const loginDTO: LoginDTO = {
                username: username.value.trim(),
                password: password.value.trim()
            };

            const serverms = createApiService('/serverms');
            // Realizamos la llamada a la Api de autenticación
            const response: AxiosResponse<LoginResponse> = await serverms.post('/rest/v2/authentication', loginDTO);
            console.log(response);
            if (response.data) {
                //console.log('Compañía activa:', response.data.companyActive);
                if (response.data.authenticate) {
                    if (response.data.companyActive === false) {
                        errors.value.api = 'La compañía no se encuentra activa. Por favor, contacte al administrador.';
                        showToast('error', errors.value.api, '');
                    } else {
                        //console.log('Login exitoso:', response.data);
                        let token = response.data.token;
                        console.log('Token recibido');
                        // Guardar el nombre de usuario si "Recuérdame" está marcado
                        if (checked.value) {
                            localStorage.setItem('rememberedUser', username.value.trim());
                        } else {
                            localStorage.removeItem('rememberedUser');
                        }
                        authStore.setAuthData(response.data);
                        //console.log('Consulta user');
                        // Verifica que usuario es el que se autentico
                        // Creamos el objeto LoginDTO directamente con los valores del formulario
                        // const loginResponse = {
                        //     username: response.data.username
                        // };
                        //console.log('loginResponse:', loginResponse);
                        // try {
                        //     console.log('Incio:');
                        //     const userData: AxiosResponse<UserData> = await serverms.post('/rest/user/findUser', loginResponse, {
                        //         headers: {
                        //             Authorization: response.data.token
                        //         }
                        //     });
                        //     console.log('userData:', userData.data);
                        //     if (!userData.data.active) {
                        //         showToast('error', 'Usuario inactivo', 'El usuario está inactivo');
                        //         return;
                        //     }
                        //     authStore.setUser(userData.data);
                        //     authStore.setCompany(userData.data);
                        // } catch (error) {
                        //     const err = error as AxiosError;
                        //     console.error('Error during user fetch:', err);
                        //     showToast('error', 'Error del Sistema', err.message);
                        //     throw err; // Rethrow the error for further handling
                        // }
                        router.push('/home');
                    }
                } else {
                    errors.value.api = 'Usuario o contraseña no autorizado para el ingreso';
                    showToast('error', 'Error', errors.value.api);
                }
            } else {
                errors.value.api = 'Usuario o contraseña no autorizado para el ingreso';
                showToast('error', 'Error', errors.value.api);
            }
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            if (err.response?.status === 401) {
                errors.value.api = 'Credenciales incorrectas. Por favor, intente nuevamente.';
                showToast('error', errors.value.api, '');
            } else if (err.response?.status === 500) {
                errors.value.api = 'Error interno del servidor. Por favor, intente más tarde.';
                showToast('error', errors.value.api, '');
            } else if (err.response) {
                showToast('error', 'Error del Sistema', err.response.data?.message || 'Error desconocido.');
            }
        } finally {
            loading.value = false;
        }
    }
};
</script>

<template>
    <FloatingConfigurator />
    <Toast />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 24" preserveAspectRatio="xMidYMid meet" class="mb-8 w-16 shrink-0 mx-auto">
                            <g transform="translate(0.000000,24.000000) scale(0.100000,-0.100000)" fill="var(--primary-color)" stroke="none">
                                <path d="M78 204 c-29 -15 -48 -42 -48 -69 0 -13 8 -10 38 13 20 16 52 37 70 46 17 9 32 19 32 21 0 11 -67 3 -92 -11z" />
                                <path d="M193 181 c-11 -17 -118 -94 -145 -104 -10 -3 -9 -9 3 -22 15 -15 18 -14 51 24 19 22 56 50 81 61 49 22 55 31 34 48 -9 8 -16 6 -24 -7z" />
                                <path d="M224 109 c-3 -6 -34 -29 -67 -50 l-60 -39 40 0 c48 0 86 27 101 70 10 29 1 42 -14 19z" />
                            </g>
                        </svg>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bienvenido a Saltto!</div>
                        <span class="text-muted-color font-medium">Inicia sesión para continuar</span>
                    </div>
                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Usuario</label>
                        <InputText id="email1" type="text" placeholder="Usuario" class="w-full md:w-[30rem] mb-8" v-model="username" :class="{ 'p-invalid': submitted && errors.username }" />
                        <Message v-if="submitted && errors.username" severity="error" variant="simple" size="small">{{ errors.username }}</Message>

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="password" placeholder="Contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false" :class="{ 'p-invalid': submitted && errors.password }"></Password>
                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Recuerdame</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Olvidaste tu contraseña?</span>
                        </div>
                        <Button id="loginIn" label="Iniciar sesión" class="w-full" @click="hadlerLogin" :loading="loading"></Button>
                        <br />
                        <Message v-if="submitted && errors.password" severity="error" variant="simple" size="small">{{ errors.password }}</Message>
                        <Message v-if="submitted && errors.api" severity="error" variant="simple" size="small" class="mt-4 flex justify-center">{{ errors.api }}</Message>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
