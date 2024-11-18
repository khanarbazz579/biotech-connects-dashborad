// Dynamic Confirm Dialog Interface
export interface CanConfirmDialog {
    title: string;
    message: string;
    buttonText: {
        cancel: string;
        confirm: string;
    }
}