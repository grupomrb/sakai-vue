/**
 * Interface representing the authentication response
 */
export interface LoginResponseV2 {
    /** Contains the authenticated user */
    username: string;

    /** Token assigned by the system */
    token: string;

    /** Indicates if the user was authenticated */
    authenticate: boolean;

    /** Indicates if the company is active */
    companyActive: boolean;

    /** Message in case of authentication failure */
    message: string;
}
