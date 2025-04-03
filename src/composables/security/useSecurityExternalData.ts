import { useAuthStore } from '@/store/auth';
import { LoginResponseV2 } from '@/type/loginResponseV2';

interface AuthData {
    token: string;
    username: string;
}

export function useSecurityExternalData() {
    const isLogginInSaltto = async (token: string) => {
        try {
            console.log('isLogginInSaltto begin....');
            const authStore = useAuthStore();

            const response = await fetch(`/serverms/rest/v2/authenticationByToken/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            });

            if (!response.ok) {
                return false;
            }

            const data: LoginResponseV2 = await response.json();
            console.log('Login exitoso:', data);

            if (data.authenticate && data.companyActive) {
                authStore.logout();
                authStore.setAuthData({
                    token: token,
                    username: data.username
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en el proceso de login:', error);
            return false;
        }
    };

    return {
        isLogginInSaltto
    };
}
