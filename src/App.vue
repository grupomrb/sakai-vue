<script setup>
import { useAuthStore } from '@/store/auth';
import { cookiesUtils } from '@/utils/cookies';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLayout } from './layout/composables/layout';
import { FetchService } from './service/api/FetchService';

const { getPrimary, toggleDarkMode } = useLayout();
const router = useRoute();
const authStore = useAuthStore();

onMounted(async () => {
    console.log('Color primario por defecto:', getPrimary.value);
    toggleDarkMode();
    const isAuthenticated = FetchService.isAuthenticated();
    if (!isAuthenticated) {
        router.push('/auth/login');
    } else {
        // Si hay token, asegurarse de que el store esté actualizado
        const token = cookiesUtils.getCookie('authToken');
        const username = cookiesUtils.getCookie('username');

        if (token && username && !authStore.isAuthenticated) {
            authStore.setAuthData({
                token,
                username
            });
        }
    }
});
</script>

<template>
    <router-view />
</template>

<style scoped></style>
