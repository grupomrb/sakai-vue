<script setup lang="ts">
import { useSourceData } from '@/composables/source/useSourceData';
import { Source } from '@/types/source';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';

// Componentes PrimeVue
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Divider from 'primevue/divider';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';

interface ErrorState {
    codesource: string;
    namesource: string;
}

const { source, sourceList, error, initSource, getSourceByCode, getAllSource, saveSource } = useSourceData();
const toast = useToast();
const isLoading = ref(false);
const txtcodigo = ref<any>(null);
const submitted = ref<boolean>(false);
const messageError = ref<string>('');
const showMessage = ref<boolean>(false);
const errors = ref<ErrorState>({
    codesource: '',
    namesource: ''
});
// Agregamos una variable para controlar si el campo fue tocado
const nameSourceTouched = ref(false);

// Función para validar el formulario
const validateForm = () => {
    submitted.value = true;

    if (!source.value?.codeSource) {
        console.log('Entro al error del codigo');
        errors.value.codesource = 'El código Contable es obligatorio';
        messageError.value = 'El código Contable es obligatorio.';
        showMessage.value = true;
        return false;
    }

    if (!source.value.codeSource) {
        console.log('Entro al error del nombre');
        errors.value.namesource = 'El nombre del comprobante es requerido';
        messageError.value = 'El nombre del comprobante es requerido';
        showMessage.value = true;
        return false;
    }

    showMessage.value = false;
    return true;
};

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
        // Limpia los errores
        errors.value.codesource = '';
        errors.value.namesource = '';
        // Quita el error general
        showMessage.value = false;
        // Resetear el estado de touched
        nameSourceTouched.value = false;
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

const hadlerSave = async () => {
    console.log('Inicia el guardado');
    if (validateForm()) {
        try {
            console.log('Entro a guardar');
            console.log('Saving source data...', source.value);
            // Asegurarse de que todos los campos necesarios estén presentes
            if (!source.value) {
                throw new Error('No hay datos para guardar');
            }
            // Crear una copia limpia del objeto source con solo las propiedades necesarias
            const sourceToSave: Source = {
                idsource: source.value.idsource,
                codeSource: source.value.codeSource,
                nameSource: source.value.nameSource,
                active: source.value.active ?? true,
                drivenum: source.value.drivenum ?? false,
                modulemrb: source.value.modulemrb ?? false,
                restartperiode: source.value.restartperiode ?? false
            };
            const response = await saveSource(sourceToSave);
            console.log('Response received:', response);
            if (response) {
                // Actualizar la lista después de guardar
                await getAllSource();
                toast.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: source.value.idsource ? 'Comprobante actualizado correctamente' : 'Comprobante guardado correctamente',
                    life: 3000
                });
                source.value = response;
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al guardar el comprobante',
                    life: 3000
                });
            }
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al guardar el comprobante',
                life: 3000
            });
        }
    }
};

// Agregamos el watch para nameSource
watch(
    () => source.value?.nameSource,
    (newValue) => {
        // Solo validamos si el campo fue tocado
        if (nameSourceTouched.value) {
            if (!newValue?.trim()) {
                errors.value.namesource = 'El nombre del comprobante es requerido';
                showMessage.value = true;
                messageError.value = 'El nombre del comprobante es requerido';
            } else {
                errors.value.namesource = '';
                showMessage.value = false;
            }
        }
    }
);

// Agregar el computed para nameSource
const nameSourceUpperCase = computed({
    get: () => source.value?.nameSource,
    set: (value: string) => {
        if (source.value) {
            source.value.nameSource = value?.toUpperCase();
        }
    }
});

onMounted(async () => {
    await initializeForm();
});
</script>

<template>
    <div v-if="isLoading" class="card">
        <div class="flex flex-col gap-4">
            <!-- Skeleton para los botones -->
            <div class="flex justify-end gap-2">
                <div class="skeleton-box w-[100px] h-[36px]"></div>
                <div class="skeleton-box w-[100px] h-[36px]"></div>
            </div>

            <!-- Skeleton para los campos del formulario -->
            <div class="grid grid-cols-12 gap-2">
                <div class="col-span-2">
                    <div class="skeleton-box h-[24px]"></div>
                </div>
                <div class="col-span-4">
                    <div class="skeleton-box h-[38px]"></div>
                </div>
            </div>

            <!-- Skeleton para la tabla -->
            <div class="skeleton-box h-[200px] mt-4"></div>
        </div>
    </div>
    <div class="card" v-if="source">
        <Message v-if="showMessage" severity="error" :closable="false" @close="showMessage = false" class="mt-4" icon="pi pi-times-circle">
            {{ messageError }}
        </Message>
        <div class="flex flex-wrap gap-2 justify-end mt-4">
            <Button icon="pi pi-file" label="Nuevo" class="mr-2" severity="secondary" @click="initializeForm" />
            <Button icon="pi pi-save" label="Guardar" class="mr-2" severity="success" @click="hadlerSave" />
        </div>

        <div class="flex justify-end mb-4 mt-4">
            <div class="flex items-center gap-2" v-if="source?.idsource">
                <label for="txtactiva">Activo</label>
                <Checkbox v-model="source.active" :binary="true" id="txtactiva" name="txtactiva" />
            </div>
        </div>

        <div class="flex flex-col gap-4">
            <div class="grid grid-cols-12 gap-2">
                <label for="txtcodigo" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"> Código Contable: *</label>
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
                        :invalid="!!errors.codesource"
                        :class="{ 'p-invalid': submitted && errors.codesource }"
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
                                            errors.codesource = '';
                                            showMessage = false;
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
                    <Message v-if="submitted && errors.codesource" severity="error" variant="simple" size="small" class="mt-1">{{ errors.codesource }}</Message>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-2">
                <label for="txtnombre" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"> Nombre Comprobante: *</label>
                <div class="col-span-12 md:col-span-8">
                    <InputText v-model="nameSourceUpperCase" id="txtnombre" class="w-full" maxlength="100" :class="{ 'p-invalid': submitted && errors.namesource }" @focus="nameSourceTouched = true" />
                    <Message v-if="submitted && errors.namesource" severity="error" variant="simple" size="small">{{ errors.namesource }}</Message>
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

<style scoped>
skeleton-box {
    background: linear-gradient(90deg, rgba(190, 190, 190, 0.2) 25%, rgba(129, 129, 129, 0.24) 37%, rgba(190, 190, 190, 0.2) 63%);
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
    border-radius: 4px;
}

@keyframes skeleton-loading {
    0% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
</style>

<!-- <script setup lang="ts">
import { useSourceData } from '@/composables/source/useSourceData';
import { useForm } from '@primevue/forms/useform';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

// Componentes PrimeVue
import Form from '@primevue/forms';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Divider from 'primevue/divider';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

const { source, sourceList, initSource, getSourceByCode, getAllSource, saveSource } = useSourceData();
const toast = useToast();
const isLoading = ref(false);

// Definición del formulario
const { handleSubmit, setValues, states, reset } = useForm({
    initialValues: initSource,
    resolver: (options) => {
        const errors: Record<string, any> = {};

        if (!options.values.codeSource) {
            errors.codeSource = 'El código Contable es obligatorio';
        }

        if (!options.values.nameSource?.trim()) {
            errors.nameSource = 'El nombre del comprobante es requerido';
        }

        return errors;
    }
});

// Computed para manejar el nombre en mayúsculas
const nameSourceUpperCase = computed({
    get: () => states.nameSource,
    set: (value: string) => {
        setValues({ nameSource: value?.toUpperCase() });
    }
});

// Inicialización del formulario
const initializeForm = async () => {
    try {
        isLoading.value = true;
        initSource();
        await getAllSource();
        reset();

        // Focus en el input de código
        setTimeout(() => {
            const input = document.querySelector('#codeSource input');
            if (input) input.focus();
        }, 200);
    } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al inicializar el formulario',
            life: 3000
        });
    } finally {
        isLoading.value = false;
    }
};

// Manejador de búsqueda por código
const handleCodeSearch = async (code: number) => {
    try {
        if (!code) return;

        const response = await getSourceByCode(code);

        if (response === null) {
            toast.add({
                severity: 'warn',
                summary: 'Notificación',
                detail: 'Comprobante contable no encontrado, se toma como nuevo',
                life: 3000
            });
            return;
        }

        setValues({
            ...response,
            nameSource: response.nameSource?.toUpperCase()
        });

        toast.add({
            severity: 'info',
            summary: 'Notificación',
            detail: 'Comprobante Contable cargado correctamente',
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al buscar el comprobante',
            life: 3000
        });
    }
};

// Manejador del submit
const onSubmit = handleSubmit(async (source): Source => {
    try {
        await saveSource(source);
        await getAllSource();
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Comprobante guardado correctamente',
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar el comprobante',
            life: 3000
        });
    }
});
onMounted(async () => {
    await initializeForm();
});
</script>

<template>
    <div class="card">
        <Form @submit="onSubmit">
            <Message v-if="Object.keys(states).some((key) => states[key]?.error)" severity="error" :closable="false" class="mt-4"> Por favor, corrija los errores en el formulario </Message>

            <div class="flex flex-wrap gap-2 justify-end mt-4">
                <Button icon="pi pi-file" label="Nuevo" type="button" severity="secondary" @click="initializeForm" />
                <Button icon="pi pi-save" label="Guardar" type="submit" severity="success" :loading="isSubmitting" />
            </div>

            <div class="flex justify-end mb-4 mt-4">
                <div class="flex items-center gap-2">
                    <label for="active">Activo</label>
                    <Checkbox v-model="states.active.value" :binary="true" id="active" />
                </div>
            </div>

            <div class="flex flex-col gap-4">
                
                <div class="grid grid-cols-12 gap-2">
                    <label for="codeSource" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"> Código Contable: * </label>
                    <div class="col-span-12 md:col-span-4">
                        <InputNumber v-model="states.codeSource.value" id="codeSource" class="w-full" :class="{ 'p-invalid': states.codeSource?.error }" :maxFractionDigits="0" :min="1" :max="9999" @blur="handleCodeSearch(states.codeSource.value)" />
                        <small class="p-error" v-if="states.codeSource?.error">{{ states.codeSource.error }}</small>
                    </div>
                </div>

                
                <div class="grid grid-cols-12 gap-2">
                    <label for="nameSource" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"> Nombre Comprobante: * </label>
                    <div class="col-span-12 md:col-span-8">
                        <InputText v-model="nameSourceUpperCase" id="nameSource" class="w-full" :class="{ 'p-invalid': states.nameSource?.error }" maxlength="100" />
                        <small class="p-error" v-if="states.nameSource?.error">{{ states.nameSource.error }}</small>
                    </div>
                </div>

                
                <div class="grid grid-cols-12 gap-2">
                    <label for="drivenum" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"> ¿Numeración manejada por el sistema?: </label>
                    <div class="col-span-12 md:col-span-2">
                        <Checkbox v-model="states.drivenum.value" :binary="true" id="drivenum" />
                    </div>
                </div>

                
                <div class="grid grid-cols-12 gap-2" v-if="states.drivenum.value">
                    <label for="restartperiode" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0"> ¿La numeración es reiniciada mes a mes?: </label>
                    <div class="col-span-12 md:col-span-2">
                        <Checkbox v-model="states.restartperiode.value" :binary="true" id="restartperiode" />
                    </div>
                </div>

                <Divider />

                
                <DataTable :value="sourceList" v-model:selection="states" selectionMode="single" dataKey="idsource" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]" responsiveLayout="scroll">
                    <Column field="codeSource" header="Código Fuente" sortable />
                    <Column field="nameSource" header="Nombre Fuente" sortable />
                    <Column field="active" header="Activa" sortable>
                        <template #body="slotProps">
                            {{ slotProps.data.active ? 'SI' : 'NO' }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </Form>
    </div>
</template> -->
