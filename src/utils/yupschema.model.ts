export interface YupSchema {
    arKey: string;
    value: any;
    type: argType;
    isArray: boolean;
}

export enum argType {
    'string' = 'string',
    'number' = 'number',
    'boolean' = 'boolean',
}