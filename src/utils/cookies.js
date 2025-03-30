export const cookiesUtils = {
    // Establecer una cookie
    setCookie(name, value, days = 1, path = '/') {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + days * 24 * 60 * 60 * 1000);
        const cookieValue = encodeURIComponent(value) + '; expires=' + expirationDate.toUTCString() + '; path=' + path + '; SameSite=Strict';

        document.cookie = name + '=' + cookieValue;
    },
    // Obtener el valor de una cookie
    getCookie(name) {
        const nameEQ = name + '=';
        const cookies = document.cookie.split('; ');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }

            if (cookie.indexOf(nameEQ) === 0) {
                return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
            }
        }
        return null;
    },

    // Eliminar una cookie
    deleteCookie(name, path = '/') {
        document.cookie = name + '=; path=' + path + '; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
};
