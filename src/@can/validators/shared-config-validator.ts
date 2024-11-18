import { 
    CanColumnItem, 
    ColumnPropertyBindings, 
    ImagePropertyBindings, 
    DocumentPropertyBindings 
} from 'src/@can/types/shared.type';

// Helpers
import { CanHelper } from 'src/@can/utils/helper.util';

/**
 * Shared Config Validator
 */
export class SharedConfigValidator {

    /**
     * 
     * @param columDef: CanColumnItem
     * 
     * Validate Column Item Config
     */
    public static validateColumnItemConfig(columDef: CanColumnItem): void {
        // Other Column Type Validator
        ColumnPropertyBindings[columDef.type].forEach(element => {
            if (!columDef[element]) {
                CanHelper.throwErrorMessage(element + ' is required in ' + columDef.type + ' type column');
            }
        });
        switch (columDef.type) {
            // Image Type Validator
            case 'image':
                columDef.images.imageItems.forEach(element => {
                    ImagePropertyBindings[element.type].forEach(imageElement => {
                        if (!element[imageElement]) {
                            CanHelper.throwErrorMessage(imageElement + ' is required in ' + columDef.type + ' type column and ' + element + ' image type');
                        }
                    });
                });
                break;
            // Document Type Validator
            case 'document':
                columDef.documents.documentItems.forEach(element => {
                    DocumentPropertyBindings[element.type].forEach(documentElement => {
                        if (!element[documentElement]) {
                            CanHelper.throwErrorMessage(documentElement + ' is required in ' + columDef.type + ' type column and ' + element + ' document type');
                        }
                    });
                });
                break;
            default:
                break;
        }
    }
}