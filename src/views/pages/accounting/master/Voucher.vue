<script setup lang="ts">
import { useSourceData } from '@/composables/source/useSourceData';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

// Componentes PrimeVue
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Divider from 'primevue/divider';
import InputNumber from 'primevue/inputnumber';

const { source, sourceList, error, initSource, getSourceByCode, getAllSource, saveSource } = useSourceData();
const toast = useToast();
const isLoading = ref(false);
const txtcodigo = ref<any>(null);

// Agregar después de las constantes iniciales
const initializeForm = async () => {
    try {
        isLoading.value = true;
        initSource();
        getAllSource();
        console.log('Source initialized:', source.value);

        // Focus en el input de código
        setTimeout(() => {
            const input = document.querySelector('#txtcodigo input');
            if (input) {
                input.focus();
            }
        }, 200);
    } catch (error) {
        console.error('Error al cargar datos de la compañía:', error);
        toast.add({
            severity: 'error',
            summary: 'Sesión expirada',
            detail: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            life: 8000
        });
    } finally {
        console.log('Finalizing source initialization process.');
        isLoading.value = false;
    }
};

onMounted(async () => {
    await initializeForm();
});
</script>

<template>
    <div class="card" v-if="source">
        <div class="flex flex-wrap gap-2 justify-end">
            <Button icon="pi pi-file" label="Nuevo" class="mr-2" severity="secondary" @click="initializeForm" />
            <Button icon="pi pi-save" label="Guardar" class="mr-2" severity="success" />
        </div>

        <div class="flex justify-end mb-4 mt-4">
            <div class="flex items-center gap-2" v-if="source?.idsource">
                <label for="txtactiva">Activo</label>
                <Checkbox v-model="source.active" :binary="true" id="txtactiva" />
            </div>
        </div>

        <div class="flex flex-col gap-4">
            <!-- Código Fuente -->
            <div class="grid grid-cols-12 gap-2">
                <label for="txtcodigo" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"> Código Fuente: </label>
                <div class="col-span-12 md:col-span-4">
                    <InputNumber
                        ref="txtcodigo"
                        v-model="source.codeSource"
                        name="txtcodigo"
                        id="txtcodigo"
                        class="w-full"
                        :maxFractionDigits="0"
                        :min="1"
                        :max="9999"
                        @blur="
                            async () => {
                                try {
                                    if (source.codeSource) {
                                        console.log('Código fuente encontrado:', source.codeSource);
                                        const response = await getSourceByCode(source.codeSource);
                                        console.log('Termino:');
                                        if (response === null) {
                                            console.log('Entro');
                                            const currentCode = source.codeSource;
                                            initSource();
                                            source.codeSource = currentCode;
                                            toast.add({
                                                severity: 'warn',
                                                summary: 'Notificación',
                                                detail: 'Comprobante contable no encontrado, se toma como nuevo',
                                                life: 8000
                                            });
                                            return;
                                        }

                                        source.value = response;
                                        toast.add({
                                            severity: 'info',
                                            summary: 'Notificación',
                                            detail: 'Comprobante Contable cargado correctamente',
                                            life: 8000
                                        });
                                    }
                                } catch (error1) {
                                    console.log('Tipo de error: ', error1);
                                    switch (error.type) {
                                        case 'NOT_FOUND':
                                            const currentCode = source.codeSource;
                                            initSource();
                                            source.codeSource = currentCode;
                                            toast.add({
                                                severity: 'info',
                                                summary: 'Información',
                                                detail: 'Comprobante contable no encontrado, se toma como nuevo',
                                                life: 3000
                                            });
                                            break;

                                        case 'UNAUTHORIZED':
                                            toast.add({
                                                severity: 'error',
                                                summary: 'Error de autenticación',
                                                detail: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                                                life: 3000
                                            });
                                            router.push('/auth/login');
                                            break;

                                        default:
                                            console.error('Error al buscar el código:', error);
                                            toast.add({
                                                severity: 'error',
                                                summary: 'Error',
                                                detail: 'Error al buscar el código de la fuente',
                                                life: 3000
                                            });
                                    }
                                }
                            }
                        "
                    />
                </div>
            </div>

            <div class="grid grid-cols-12 gap-2">
                <label for="txtnombre" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"> Nombre Comprobante: </label>
                <div class="col-span-12 md:col-span-8">
                    <InputText v-model="source.nameSource" id="txtnombre" class="w-full" maxlength="100" />
                </div>
            </div>

            <div class="grid grid-cols-12 gap-2">
                <label for="txtnumeracion" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"> ¿Numeración manejada por el sistema?: </label>
                <div class="col-span-12 md:col-span-2">
                    <Checkbox v-model="source.drivenum" :binary="true" id="txtnumeracion" />
                </div>
            </div>

            <div class="grid grid-cols-12 gap-2" v-if="source.drivenum">
                <label for="txtreinicio" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"> ¿La numeración es reiniciada mes a mes?: </label>
                <div class="col-span-12 md:col-span-2">
                    <Checkbox v-model="source.restartperiode" :binary="true" id="txtreinicio" />
                </div>
            </div>

            <Divider />

            <DataTable :value="sourceList" v-model:selection="source" selectionMode="single" dataKey="idsource" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]" responsiveLayout="scroll">
                <Column field="codeSource" header="Código Fuente" sortable />
                <Column field="nameSource" header="Nombre Fuente" sortable />
                <Column field="active" header="Activa" sortable>
                    <template #body="slotProps">
                        {{ slotProps.data.active ? 'SI' : 'NO' }}
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
