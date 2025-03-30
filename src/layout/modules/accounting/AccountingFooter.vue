<script setup lang="ts"></script>

<template>
    <div class="layout-footer">
        <div class="footer-content">
            <span class="font-medium ml-2">Sistema de Contabilidad</span>
            <div class="footer-info">
                <span>© 2024 Tu Empresa</span>
                <span>Versión 1.0.0</span>
                <span>Soporte: soporte@tuempresa.com</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
}

.footer-info {
    display: flex;
    gap: 2rem;
}
</style>
