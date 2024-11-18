// NPM Packages
import * as _ from 'underscore';
import * as moment from 'moment';
/**
 * Shared Methods
 */
export class CanHelper {
    /**
     *
     * @param data:object
     * @param key:string
     *
     * Map Value With Key
     */
    public static mapValueWithApiKey(data: object, key: string): any {
        // return data in case of undefined key
        if (!key) {
            return data;
        }

        // return in case of empty
        if (this.isEmpty(data)) {
            return undefined;
        }

        // Calculating Key Length for nested object
        const keyLength = key.split('.').length;
        // Storing the nested key in array
        const splittedKey = key.split('.');
        // Array Pattern
        const arrayPattern = new RegExp('\\[\\d+\\]');
        // Not Nested Object
        if (keyLength === 1 && !arrayPattern.test(key)) {
            // Returning Final value
            if(_.isNumber(data[key]) || _.isBoolean(data[key])){
                return data[key];
              }
              return (data[key] || data[key] == false) ? data[key] : '-';

        } else { // Nested Object
            // Default Init of Data
            let value: any = data;
            // Fetching the value for nested object
            splittedKey.forEach(sk => {
                // return in case of empty
                if (this.isEmpty(value)) {
                    return 'undefined';
                }
                // Checking if the key has array pattern or not
                const result = arrayPattern.test(sk);
                // If key value is Array
                if (result) {
                    // Splitting the key and storing the array key
                    let arrKey: any = sk.split('[');
                    // Setting Default value
                    sk = arrKey[0];
                    // Getting the array full data
                    value = value[sk];
                    // Removing the first element for iterating with object key
                    arrKey.shift();
                    // if key value is array
                    if (_.isArray(value)) {
                        // Mapping the string index to number index
                        // tslint:disable-next-line: radix
                        arrKey = arrKey.map(ak => ak = parseInt(ak));
                        // Fetching and assigning the value based on index
                        arrKey.forEach(ak => {
                            // Not Valid Index
                            if (ak > value.length - 1) {
                                return false;
                            } else { // Valid Index
                                value = value[ak];
                            }
                        });
                    } else { // If Value is not array assigning the default data
                        value = data;
                    }
                } else { // if key value is not array then iterating as object
                    value = value[sk];
                }
            });
            // Returning the final value
            if (_.isBoolean(value) || _.isNumber(value)) {
                return value;
            } 
            else {
                return value ? value : '-';
            }
        }
    }

    /**
     *
     * @param data:object
     * @param key:string
     *
     * Fetching Value with API KEY
     */
    public static getValueWithApiKey(data: object, key: string, separators?: Array<string>): any {
        // Check for separarors
        if (separators && separators.length) {
            // Init value
            let value = key;
            // Create key by splitting them from separators add a single separator
            separators.forEach((separator) => {
                key = key.split(separator).join(', ');
            });
            // Create array of keys
            const keys = key.split(', ');
            // Get value of each key and replace it with that key in value
            keys.forEach((eachKey) => {
                const val = this.mapValueWithApiKey(data, eachKey);
                if (!this.isEmpty(val)) {
                    value = value.replace(eachKey, val);
                } else {
                    if (value.endsWith(eachKey)) {
                        value = value.replace(eachKey, '');
                        for (let each of separators) {
                            if (value.endsWith(each)) {
                                value = value.substring(0, value.length - each.length);
                                break;
                            }
                        }
                    } else {
                        let found = false;
                        for (let each of separators) {
                            if (value.includes(eachKey + each)) {
                                value = value.replace(eachKey + each, '');
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            value = value.replace(eachKey, '');
                        }
                    }
                }
            });

            return value;
        } else {
            return this.mapValueWithApiKey(data, key);
        }
    }

    /**
     * 
     * Replace Dynamic Text with Value
     * 
     * @param data 
     * @param text 
     */
    public static mapDynamicTextWithApiKey(data: object, text: string) {
        /**
         * Separators
         */
        const separator = new RegExp(/\$\{(.*?)\}/gm); // match ${anyText}
        const startBraceSeparator = new RegExp(/\$\{/); // match ${
        const endBraceSeparator = new RegExp(/\}/); // match }

        // Copied Text
        let mappedText = text;

        // Separate key from text
        const separatedKey = mappedText.match(separator);

        // Map Dynamic Text with Value
        if (separatedKey.length > 0) {
            separatedKey.forEach(key => {
                let mappedKey = key
                mappedKey = mappedKey.replace(startBraceSeparator, '').replace(endBraceSeparator, '');
                const splittedKey = mappedKey.split('->')
                if(splittedKey.length > 1){
                    mappedKey = splittedKey[0];
                    const mappedValue = moment(this.mapValueWithApiKey(data, mappedKey)).format(splittedKey[1].trim());
                    mappedText = mappedText.replace(key, mappedValue);
                }else{
                    const mappedValue = this.mapValueWithApiKey(data, mappedKey);
                    mappedText = mappedText.replace(key, mappedValue);
                }
            })
            return mappedText;
        } else {
            return text;
        }
    }


    /**
     *
     * @param url:string
     *
     * Validate URL is Complete URL or not
     *
     * eg: http:// | https:// -> valid
     * eg: /dashboard -> invalid
     */
    static validateUrl(url: string): boolean {
        const urlRegex = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/;
        return urlRegex.test(url);
    }

    /**
     * 
     * @param val : any
     * Check for Empty value
     */
    public static isEmpty(val: any): boolean {
        return val === null || val === undefined || val === '' || val === '-'  || JSON.stringify(val) === JSON.stringify({}) || JSON.stringify(val) === JSON.stringify([]);
    }

    /**
     * 
     * @param url : string
     * 
     * Match string with regex
     * Get variable which is in form of ${id}
     */
    public static getVariablesFromUrl(url: string): any {
        const regex = new RegExp(/\$\{(\w+?)\}/g);
        let result;
        const variables = [];
        while (result = regex.exec(url)) {
            variables.push(result[1]);
        }
        return variables;
    }

    /**
     * 
     * @param str : string
     * Returns object of Prams
     */
    public static getParamsFromString(str: string): object {
        // Storing the nested params in array
        let splitArr = str.split('&');
        // init object
        const resultant = {}
        // check for each key
        splitArr.forEach((el) => {
            // Split value from =
            const k = el.split('=');
            // Add the param to object
            resultant[k[0]] = k[1];
        });
        return resultant;
    }

    // /**
    //  * 
    //  * @param str : string
    //  * Returns object of Prams
    //  */
    // public static getParamsFromString(str: string): object[] {
    //     // Storing the nested params in array
    //     let splitArr = str.split('&');
    //     // init object
    //     const resultant = [];
    //     // check for each key
    //     splitArr.forEach((el) => {
    //         // Split value from =
    //         const k = el.split('=');
    //         // Add the param to object
    //         const obj = {};
    //         obj[k[0]] = k[1];
    //         resultant.push(obj);
    //     });
    //     return resultant;
    // }

    /**
     * 
     * @param str: string
     * 
     * Check string is JSON or not
     */
    public static isJson(str: string): boolean {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * 
     * @param url : string
     * @param data : object
     * Return url with replaced variables
     */
    public static replaceVariableInUrl(url: string, data: object): string {
        // Get variables from url
        const variables = this.getVariablesFromUrl(url);
        let resultUrl = url;
        // Replace each variable with value
        for (const variable of variables) {
            resultUrl = resultUrl.replace('${' + variable + '}', this.mapValueWithApiKey(data, variable));
        }
        return resultUrl;
    }

    /**
     * 
     * @param message :string
     * Throws error
     */
    public static throwErrorMessage(message: string) {
        throw new Error(message);
    }

    /**
     * 
     * @param url : string
     * @param data : object
     * Return url with replaced variables
     */
    public static checkAndReplaceVariableInUrl(url: string, data: object) {
        // Get variables from url
        const variables = this.getVariablesFromUrl(url);
        let resultUrl = url;
        // Replace each variable with value
        for (const variable of variables) {
            if (this.mapValueWithApiKey(data, variable)) {
                resultUrl = resultUrl.replace('${' + variable + '}', this.mapValueWithApiKey(data, variable));
            } else {
                return false;
            }
        }
        return resultUrl;
    }

    /**
     * Convert DataURI to Blob
     * 
     * @param dataURI 
     */
    public static dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(",")[1]);
        const mimeString = dataURI
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        return blob;
    }
}