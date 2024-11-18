// Types
import { CanModal, CanIcon } from './shared.type';
import { CanPermission } from './permission.type';

// Fab Button Interface
export interface CanFabButton {
    icon: CanIcon;
    position: CanFabButtonPosition;
    type: 'modal' | 'link';
    modal?: CanModal;
    link?: {
        url: string;
        target: 'self' | 'external';
    };
    data?: object;
    permission?: CanPermission;
}

// Enum for Fab Button Position
export enum CanFabButtonPosition {
    BottomRight = 1,
    BottomLeft = 2,
    TopRight = 3,
    TopLeft = 4
}