<script setup lang="ts">
import AppTopbar from '@/layout/AppTopbar.vue';
import { useLayout } from '@/layout/composables/layout';
import AccountingFooter from '@/layout/modules/accounting/AccountingFooter.vue';
import AccountingSidebar from '@/layout/modules/accounting/AccountingSidebar.vue';
import Toast from 'primevue/toast';
import { computed, ref, Ref, watch } from 'vue';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener: Ref<((event: MouseEvent) => void) | null> = ref(null);

// Agregar el watch para el isSidebarActive
watch(isSidebarActive, (newVal: boolean) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive
    };
});

function bindOutsideClickListener(): void {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event: MouseEvent) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive = false;
                layoutState.staticMenuMobileActive = false;
                layoutState.menuHoverActive = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener(): void {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event: MouseEvent): boolean {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    if (!sidebarEl || !topbarEl || !(event.target instanceof Node)) {
        return false;
    }

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <AppTopbar />
        <AccountingSidebar />
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view></router-view>
            </div>
            <AccountingFooter />
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <Toast />
</template>
