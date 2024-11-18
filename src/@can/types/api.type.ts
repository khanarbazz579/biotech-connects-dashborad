// Types
import { HttpHeaders, HttpParams } from '@angular/common/http';

// API Handling Interface
export interface CanApi {
    baseUrl?: string;
    apiPath: string;
    params?: HttpParams;
    headers?: HttpHeaders;
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
    apiType? : ApiType;
    method: 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'GET';
    loopbackDataType?: 'list' | 'count';
}

// Api Type Enum
export enum ApiType {
    Default = 1,
    Loopback = 2
}