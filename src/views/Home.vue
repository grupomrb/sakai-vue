<script setup lang="ts">
import { useCompanyData } from '@/composables/company/useCompanyData';
import { useAuthStore } from '@/store/auth';
import { cookiesUtils } from '@/utils/cookies';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

interface WhatNew {
    titlewhatnew: string;
    typewhatnew: 1 | 2 | 3; // Union type para los tipos específicos
    whatsnew: string;
}

const authStore = useAuthStore();
const toast = useToast();
const backgroundImageUrl = ref<String>('');
const { companyData, isLoading, error, fetchCompanyData } = useCompanyData();

const whatnewList = ref<WhatNew[]>([
    {
        titlewhatnew: 'Feature Update',
        typewhatnew: 1,
        whatsnew: 'New dashboard features available'
    },
    {
        titlewhatnew: 'System Notification',
        typewhatnew: 2,
        whatsnew: 'Scheduled maintenance this weekend'
    },
    {
        titlewhatnew: 'Bug Fix',
        typewhatnew: 3,
        whatsnew: 'Fixed report generation issue'
    }
]);

// Function to get company data using the company_id from auth store
const getCompanyData = (): void => {
    const token: string | null = cookiesUtils.getCookie('authToken');
    if (token) {
        console.log('Token:', token);
        // Aquí puedes usar el token sabiendo que no es null
    } else {
        console.log('No token found');
    }

    // Here you can use the company_id to fetch additional data if needed
    // For example:
    // fetchCompanyDetails(companyId);
};

// Type text helper function
const getTypeText = (type: number): string => {
    switch (type) {
        case 1:
            return 'Nueva Funcionalidad';
        case 2:
            return 'Comunicación';
        case 3:
            return 'Corrección Bug';
        default:
            return '';
    }
};

// Show message function
const showMessage = (): void => {
    // Make sure you have the toast service properly configured
    toast.add({
        severity: 'info',
        summary: 'Mensaje de Cartera',
        detail: companyData?.value?.message1 || '',
        life: 5000
    });
};

onMounted(async () => {
    try {
        await fetchCompanyData();
    } catch (error) {
        // El error ya será manejado por el FetchService para casos de 401
        console.error('Error al cargar datos de la compañía:', error);
        toast.add({
            severity: 'error',
            summary: 'Sesión expirada',
            detail: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            life: 8000
        });
    }

    if (companyData?.value?.requiredmessage) {
        showMessage();
    }
});
</script>

<template>
    <div class="grid">
        <!-- Notification Bar -->
        <Toast position="bottom-center" v-if="companyData?.requiredmessage" />

        <!-- Main Content -->
        <div class="col-12 flex justify-content-center imagebackground">
            <div class="card">
                <!-- Company Logo -->
                <div class="company-logo-container text-center mb-4">
                    <img :src="companyData?.urllogo" alt="Logo de la empresa" class="company-logo" v-if="companyData?.urllogo" />
                </div>
                <!-- Welcome Message -->
                <div class="welcome-section text-center mb-5">
                    <h1 class="text-4xl font-bold mb-2 text-primary">Bienvenido a Saltto</h1>
                    <p class="text-xl text-700 line-height-3">Empresa Actual: {{ companyData?.nameCompany || 'No disponible' }}</p>
                    <div class="welcome-divider my-4"></div>
                </div>
                <!-- What's New Carousel -->
                <Carousel :value="whatnewList" :numVisible="1" :circular="true" :autoplayInterval="10000" class="w-full md:w-30rem">
                    <template #header>
                        <h2 class="text-xl font-medium">¿Que hay de Nuevo?</h2>
                    </template>

                    <template #item="slotProps">
                        <div class="p-4 text-center">
                            <Panel>
                                <template #header>
                                    <div class="text-lg font-medium">{{ slotProps.data.titlewhatnew }}</div>
                                </template>

                                <div class="grid grid-cols-2 bg-gray-100 dark:bg-gray-800 p-3 mb-3 rounded-border">
                                    <div>Tipo:</div>
                                    <div class="font-bold text-green-500">
                                        {{ getTypeText(slotProps.data.typewhatnew) }}
                                    </div>
                                </div>

                                <div class="font-bold">{{ slotProps.data.whatsnew }}</div>
                            </Panel>
                        </div>
                    </template>

                    <template #footer>
                        <div class="mt-4">En total son {{ whatnewList.length }} noticias.</div>
                    </template>
                </Carousel>
            </div>
        </div>
    </div>
</template>
<style scoped>
.welcome-section {
    animation: fadeIn 0.8s ease-in;
}

.welcome-divider {
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
    width: 50%;
    margin: 0 auto;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.text-primary {
    color: var(--primary-color);
}
.company-logo-container {
    width: 100%;
    padding: 1rem;
}

.company-logo {
    max-width: 300px;
    width: 100%;
    height: auto;
    object-fit: contain;
    margin: 0 auto;
    transition: all 0.3s ease;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
    .company-logo {
        max-width: 200px;
    }
}
</style>
