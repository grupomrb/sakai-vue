import { FetchService } from '@/service/api/FetchService';
import { User } from '@/type/user';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

interface FetchState {
    isLoading: boolean;
    error: string | null;
}

export function useUserData() {
    const user = ref<User | null>(null);
    const toast = useToast();
    const state = ref<FetchState>({
        isLoading: false,
        error: null
    });

    const getUserByUserName = async () => {
        try {
            state.value.isLoading = true;
            state.value.error = null;
            const response = await FetchService.fetch<User>('/rest/user/v2/findByToken', {
                method: 'GET',
                baseURL: '/serverms',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response) {
                return null;
            }
            user.value = response;
            return user;
        } catch (error) {
            state.value.error = error instanceof Error ? error.message : 'Error desconocido';
            throw error;
        } finally {
            state.value.isLoading = false;
        }
    };

    return {
        user,
        getUserByUserName
    };
}
