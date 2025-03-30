import router from '@/router';

export function navigateToLogin(summary: string, detail: string) {
    // La navegación al login se manejará en el componente
    router.push('/auth/login');
}
