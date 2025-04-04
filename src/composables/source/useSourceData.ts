import { useCompanyData } from '@/composables/company/useCompanyData';
import { FetchService } from '@/service/api/FetchService';
import type { Source } from '@/type/source';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const { companyData } = useCompanyData();

interface FetchState {
    isLoading: boolean;
    error: string | null;
}

export function useSourceData() {
    const source = ref<Source | null>(null);
    const sourceList = ref<Source[]>([]);
    const toast = useToast();
    const state = ref<FetchState>({
        isLoading: false,
        error: null
    });

    const initSource = () => {
        console.log('CompanyData:', companyData);
        source.value = {
            idsource: null,
            codeSource: null,
            nameSource: '',
            modulemrb: false,
            drivenum: false,
            restartperiode: false,
            active: true,
            company: companyData?.value
        };
    };

    const getSourceByCode = async (codeSource: number) => {
        try {
            state.value.isLoading = true;
            state.value.error = null;
            console.log('getSourceByCode init: Begin');
            console.log('codeSource: ', codeSource);
            const response = await FetchService.fetch<Source>(`/rest/source/v2/findByCodeSource/${codeSource}`, {
                method: 'GET',
                baseURL: '/serverms',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('getSourceByCode response:', response);
            if (!response) {
                return null;
            }
            source.value = response;
            return source;
        } catch (error) {
            state.value.error = error instanceof Error ? error.message : 'Error desconocido';
            throw error;
        } finally {
            state.value.isLoading = false;
        }
    };

    const getAllSource = async () => {
        try {
            state.value.isLoading = true;
            state.value.error = null;
            console.log('getAllSource init: Begin');
            const response = await FetchService.fetch<Source[]>('/rest/source/v2/findAllByToken', {
                method: 'GET',
                baseURL: '/serverms',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response) {
                return null;
            }
            sourceList.value = response;
            return response;
        } catch (error) {
            state.value.error = error instanceof Error ? error.message : 'Error desconocido';
            throw error;
        } finally {
            state.value.isLoading = false;
        }
    };

    const saveSource = async (sourceData: Source) => {
        try {
            state.value.isLoading = true;
            state.value.error = null;
            console.log('saveSource init: Begin: ', sourceData);
            // Assuming there's an API call to save the source data
            const response = await FetchService.fetch<Source>('/rest/sources/v2/save', {
                method: 'POST',
                body: JSON.stringify(sourceData),
                baseURL: '/serverms'
            });
            console.log('Response received:', response);
            if (response) {
                updateSourceList(response);
            } else {
                return null;
            }
            source.value = response;
            return response;
        } catch (error) {
            state.value.error = error instanceof Error ? error.message : 'Error desconocido';
            throw error;
        } finally {
            state.value.isLoading = false;
        }
    };

    const updateSourceList = (newSource: Source) => {
        console.log('updateSourceList init: Begin');
        const index = sourceList.value.findIndex((s) => s.idsource === newSource.idsource);
        if (index >= 0) {
            sourceList.value[index] = newSource;
        } else {
            sourceList.value.unshift(newSource);
        }
    };

    return {
        source,
        sourceList,
        isLoading: state.value.isLoading,
        error: state.value.error,
        initSource,
        getSourceByCode,
        getAllSource,
        saveSource
    };
}
