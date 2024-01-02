export interface Sample {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    progress: number;
    status: string;
    children?: Sample[];
}
export declare const createSamples: (...lengths: number[]) => Sample[];
