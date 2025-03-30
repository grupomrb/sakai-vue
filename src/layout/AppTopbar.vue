<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/store/auth';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppConfigurator from './AppConfigurator.vue';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const router = useRouter();
const authStore = useAuthStore();
const userMenuVisible = ref(false);

// Asume que tienes estos datos en tu store de autenticación
const userData = ref({
    name: 'Nombre Usuario',
    email: 'usuario@email.com',
    avatar: '/demo/images/avatar/amyelsner.png'
});

const handleLogout = async () => {
    try {
        await authStore.logout();
        router.push('/login');
    } catch (error) {
        console.error('Error durante el logout:', error);
    }
};

const toggleUserMenu = (event: Event) => {
    userMenuVisible.value = !userMenuVisible.value;
    event.stopPropagation();
};

// Cerrar menú al hacer clic fuera
onMounted(() => {
    document.addEventListener('click', () => {
        userMenuVisible.value = false;
    });
});

onUnmounted(() => {
    document.removeEventListener('click', () => {
        userMenuVisible.value = false;
    });
});
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 24" preserveAspectRatio="xMidYMid meet" class="w-16 shrink-0 my-auto flex items-center justify-center">
                    <g transform="translate(0.0000,24.0000) scale(0.10000,-0.10000)" fill="var(--primary-color)" stroke="none">
                        <path d="M78 204 c-29 -15 -48 -42 -48 -69 0 -13 8 -10 38 13 20 16 52 37 70 46 17 9 32 19 32 21 0 11 -67 3 -92 -11z" />
                        <path d="M193 181 c-11 -17 -118 -94 -145 -104 -10 -3 -9 -9 3 -22 15 -15 18 -14 51 24 19 22 56 50 81 61 49 22 55 31 34 48 -9 8 -16 6 -24 -7z" />
                        <path d="M224 109 c-3 -6 -34 -29 -67 -50 l-60 -39 40 0 c48 0 86 27 101 70 10 29 1 42 -14 19z" />
                    </g>
                </svg>

                <span>Saltto</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <!--
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                -->
                    <AppConfigurator />
                </div>
            </div>
            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-bell"></i>
                        <span>Notificaciones</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
