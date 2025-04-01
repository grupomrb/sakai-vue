import { Company } from './company';

export interface Source {
    idsource: number | null;
    codeSource: number | null;
    nameSource: string;
    modulemrb: boolean;
    drivenum: boolean;
    restartperiode: boolean;
    active: boolean;
    company: Company | null;
}

export interface SourceDTO {
    codesource: number;
    idcompany: number;
}
