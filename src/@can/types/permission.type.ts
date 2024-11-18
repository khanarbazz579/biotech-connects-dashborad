// Permission Interface
export class CanPermission {
    type: 'single' | 'group';
    match?: { key: string, value: boolean };
    group?: CanGroupPermission;
}

// Permission Group Interface
export interface CanGroupPermission {
    type: 'and' | 'or';
    values: CanPermission[];
}