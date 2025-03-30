<script setup lang="ts">
import AppMenuItem from '@/layout/AppMenuItem.vue';
import { ref } from 'vue';

const model = ref([
    {
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Maestros',
        items: [{ label: 'Comprobantes Contables', icon: 'pi pi-calculator', to: '/accounting/master/voucher' }]
    }
]);
</script>

<template>
    <div class="layout-sidebar">
        <ul class="layout-menu">
            <template v-for="(item, i) in model" :key="i">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </template>
        </ul>
    </div>
</template>

<style lang="scss" scoped></style>
