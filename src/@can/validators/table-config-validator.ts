// Types
import {
    CanTable,
    CanFilter,
    FilterPropertyBindings,
    CanFieldAction,
    FieldActionPropertyBindings
} from 'src/@can/types/table.type';

// Helpers
import { CanHelper } from 'src/@can/utils/helper.util';

// Shared Validator
import { SharedConfigValidator } from './shared-config-validator';
import { CanAction } from '../types/shared.type';

/**
 * Table Component Config Validator
 */
export class TableConfigValidator {

    /**
     * 
     * @param tableData: CanTable
     * 
     * Validate Table Config
     */
    public static validateTableConfig(tableData: CanTable): void {
        if (tableData.discriminator === 'tableConfig') {
            // Column Item validation
            if (tableData.displayedColumns && tableData.displayedColumns.length) {
                tableData.displayedColumns.forEach(columnDef => {
                    SharedConfigValidator.validateColumnItemConfig(columnDef);
                });
            } else {
                CanHelper.throwErrorMessage('Empty or invalid displayedColumns in tableConfig')
            }
            // Data Source validation
            if (!tableData.dataSource) {
                if (!tableData.api) {
                    CanHelper.throwErrorMessage('Api config is required');
                }
            }
            // Filter Validation
            if (tableData.filters) {
                tableData.filters.forEach(filter => {
                    this.validateFilterConfig(filter);
                });
            }
            // Field Action Validation
            if (tableData.fieldActions) {
                tableData.fieldActions.forEach(fieldAction => {
                    this.validateFieldActionConfig(fieldAction.action);
                });
            }
        } else {
            CanHelper.throwErrorMessage('Invalid table config');
        }
    }

    /**
     * 
     * @param filter: CanFilter
     * 
     * Validate Table Filter Config
     * 
     * Only in Case of API Filtering
     */
    private static validateFilterConfig(filter: CanFilter): void {
        switch (filter.filtertype) {
            case 'api':
                if (!filter.key  && filter.type != 'download') {
                    CanHelper.throwErrorMessage('key is required in case of filter type api')
                }
                if (!filter.type) {
                    CanHelper.throwErrorMessage('type is required in case of filter type api')
                }
                FilterPropertyBindings[filter.type].forEach(element => {
                    if (!filter[element]) {
                        CanHelper.throwErrorMessage(element + ' is required in ' + filter.type + ' type column');
                    }
                });
                switch (filter.type) {
                    case 'text':
                        if (filter.searchType === 'autocomplete') {
                            if (!filter.autoComplete) {
                                CanHelper.throwErrorMessage('autoComplete is required in case of filtertype text and search type autocomplete')
                            } else {
                                if (filter.autoComplete.type === 'local') {
                                    if (!(filter.value && filter.value.length)) {
                                        CanHelper.throwErrorMessage('value is required in case of filtertype text and autocomplete type local')
                                    }
                                } else {
                                    if (!(filter.autoComplete.autocompleteParamKeys && filter.autoComplete.autocompleteParamKeys.length)) {
                                        CanHelper.throwErrorMessage('autocompleteParamKey is required in case of filtertype text and search type autocomplete and autocompleteType api')
                                    }
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
                break;

            default:
                break;
        }
    }

    /**
     * 
     * @param actionDef: CanAction
     * 
     * Validate Table Field Action Buttons Config
     */
    private static validateFieldActionConfig(actionDef: CanAction): void {
        FieldActionPropertyBindings[actionDef.actionType].forEach(element => {
            if (!actionDef[element]) {
                CanHelper.throwErrorMessage(element + ' is required in ' + actionDef.actionType + ' type column');
            }
        });

    }
}