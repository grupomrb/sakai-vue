<script setup lang="ts">
import { version } from '@/../package.json';
import { useCompanyData } from '@/composables/company/useCompanyData';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const nameCompany = ref<string>('');
const currentYear: number = new Date().getFullYear();
const appVersion = ref<string>(version);

const toast = useToast();

const { companyData, fetchCompanyData } = useCompanyData();

onMounted(async () => {
    try {
        await fetchCompanyData();
        if (companyData.value) {
            nameCompany.value = companyData.value.nameCompany || '';
        }
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
});
</script>

<template>
    <div class="layout-footer">{{ nameCompany }} - Copyright (&#169;) {{ currentYear }} - Saltto ERP - ver. {{ appVersion }}</div>
</template>
