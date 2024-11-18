// Types
import { CanAppCore } from 'src/@can/types/app-core.type';

// Helpers
import { CanHelper } from 'src/@can/utils/helper.util';

/**
 * App Config Validator
 */
export class AppConfigValidator {

    /**
     * 
     * @param appConfig: CanAppCoreConfig
     * 
     * Validate App Level Config
     */
    public static validateAppConfig(appConfig: CanAppCore): void {
        if (!appConfig || appConfig.discriminator !== 'appConfig') {
            CanHelper.throwErrorMessage('Invalid App Config.');
        }
    }
}