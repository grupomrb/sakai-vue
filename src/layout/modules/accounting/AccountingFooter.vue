<script setup lang="ts">
import { useCompanyData } from '@/composables/company/useCompanyData';
import { useUserData } from '@/composables/user/useUserData';
import type { User } from '@/type/user';
import { onMounted, ref } from 'vue';

const nameCompany = ref<string | null>('');
const userRef = ref<User | null>();
const currentPeriod = ref<string>('');

const { companyData, fetchCompanyData } = useCompanyData();
const { user, getUserByUserName } = useUserData();

const formatPeriod = (period: Date): string => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const year = period.getFullYear();
    const month = months[period.getMonth()];

    return `${month} ${year}`;
};

onMounted(async () => {
    await fetchCompanyData();
    if (companyData.value) {
        nameCompany.value = companyData.value.nameCompany || '';
    }
    console.log('Comienza a consultar el usuario');
    const responseUser = await getUserByUserName();
    console.log('ResponseUser: ', responseUser);
    if (responseUser) {
        console.log('Entro a obtener el usuario');
        Object.assign(userRef, responseUser);
        console.log('UserRef: ' + userRef.value);
        if (userRef.value && userRef.value.periodContable) {
            // Verificación de nulidad
            const date = new Date(userRef.value.periodContable);
            currentPeriod.value = formatPeriod(date);
        }
    } else {
        console.log('No cargo');
    }
});
</script>

<
<template>
    <div class="layout-footer">
        <div class="footer-content">
            <div class="company-name">
                <span class="font-medium">{{ nameCompany }}</span>
            </div>
            <div class="footer-info">
                <span>Periodo: {{ currentPeriod }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.footer-content {
    display: flex;
    justify-content: space-between; /* Distribuye los elementos a los extremos */
    align-items: center;
    padding: 1rem;
    width: 100%; /* Asegura que ocupe todo el ancho disponible */
}

.company-name {
    flex-shrink: 0; /* Evita que el nombre de la compañía se encoja */
}

.footer-info {
    margin-left: auto; /* Empuja el período hacia la derecha */
}
</style>
>
