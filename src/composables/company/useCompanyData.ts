import { FetchService } from '@/service/api/FetchService';
import type { Company } from '@/type/company';
import { ref } from 'vue';

// interface CompanyData {
//     nameCompany: string;
//     requiredmessage: boolean;
//     message1: string;
//     urllogo: string;
// }

interface FetchState {
    isLoading: boolean;
    error: string | null;
}

export function useCompanyData() {
    const companyData = ref<Company | null>(null);
    const state = ref<FetchState>({
        isLoading: false,
        error: null
    });

    const fetchCompanyData = async (forceReload = false) => {
        // Si ya tenemos datos y no se fuerz la recarga, retornamos los datos en cache
        if (companyData.value && !forceReload) {
            return companyData.value;
        }

        state.value.isLoading = true;
        state.value.error = null;

        try {
            // Usamos el FetchService que ya maneja el token desde las cookies
            const company = await FetchService.fetch<Company>('/rest/company/v2/getCompanyByToken', {
                method: 'GET'
            });

            companyData.value = company;
            return companyData;
        } catch (error) {
            state.value.error = error instanceof Error ? error.message : 'Error desconocido';
            throw error;
        } finally {
            state.value.isLoading = false;
        }
    };

    const clearCompanyData = () => {
        companyData.value = null;
        state.value.error = null;
    };

    return {
        companyData,
        isLoading: state.value.isLoading,
        error: state.value.error,
        fetchCompanyData,
        clearCompanyData
    };
}
