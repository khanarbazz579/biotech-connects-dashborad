// Types
import { CanDetailView } from 'src/@can/types/detail-view.type';

// Helpers
import { CanHelper } from 'src/@can/utils/helper.util';

// Shared Validator
import { SharedConfigValidator } from './shared-config-validator';

/**
 * Detail View Component Config Validator
 */
export class DetailViewConfigValidator {

    /**
     * 
     * @param detailViewData: CanDetailView
     * 
     * Validate Detail View Config
     */
    public static validateDetailViewConfig(detailViewData: CanDetailView): void {
        if (detailViewData.discriminator === 'detailViewConfig') {
            // Dislayed Item validation
            if (detailViewData.displayedFields && detailViewData.displayedFields.length) {
                detailViewData.displayedFields.forEach(columnDef => {
                    SharedConfigValidator.validateColumnItemConfig(columnDef);
                });
            } else {
                CanHelper.throwErrorMessage('Empty or invalid displayedFields in detailView Config')
            }

            // Data Source validation
            if (!detailViewData.dataSource) {
                if (!detailViewData.api) {
                    CanHelper.throwErrorMessage('Api config is required');
                }
            }
        } else {
            CanHelper.throwErrorMessage('Invalid Detail View config');
        }

    }

}