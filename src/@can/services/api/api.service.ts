// In-Built
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

// Packages
import { Observable } from "rxjs";

// Types
import { CanApi, ApiType } from "src/@can/types/api.type";

// Environment File
import { environment } from "src/environments/environment";

// Helpers
import { CanHelper } from "src/@can/utils/helper.util";

// Configs
import { AppConfig } from "src/app/main/config/app.config";

@Injectable({
  providedIn: "root",
})
export class CanApiService {
  // API URL
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // List Data
  public list(payload: CanApi): Observable<object> {
    // Path Init
    let path;
    if (payload.baseUrl) {
      path = payload.baseUrl + payload.apiPath;
    } else {
      path = this.apiUrl + payload.apiPath;
    }

    const params = this.createHttpParams(payload);
    // Options Init
    const options = {
      headers: payload.headers,
      params: params,
      responseType: payload.responseType as "json",
    };
    // Api Call
    return this.http.get(path, options);
  }

  // Post Data
  public post(payload: CanApi, body: any): Observable<object> {
    // Path Init
    let path;
    if (payload.baseUrl) {
      path = payload.baseUrl + payload.apiPath;
    } else {
      path = this.apiUrl + payload.apiPath;
    }
    // Options Init
    const options = {
      headers: payload.headers,
      params: payload.params,
    };
    // Api Call
    return this.http.post(path, body, options);
  }

  // Get Data
  public get(payload: CanApi): Observable<object> {
    // Path Init
    let path;
    if (payload.baseUrl) {
      path = payload.baseUrl + payload.apiPath;
    } else {
      path = this.apiUrl + payload.apiPath;
    }

    const params = this.createHttpParams(payload);
    // Options Init
    const options = {
      headers: payload.headers,
      params: params,
    };
    // Api Call
    return this.http.get(path, options);
  }

  // Delete Data
  public delete(payload: CanApi): Observable<object> {
    // Path Init
    let path;
    if (payload.baseUrl) {
      path = payload.baseUrl + payload.apiPath;
    } else {
      path = this.apiUrl + payload.apiPath;
    }
    // Options Init
    const options = {
      headers: payload.headers,
      params: payload.params,
    };
    // Api Call
    return this.http.delete(path, options);
  }

  // Replace Data
  public put(payload: CanApi, body: any): Observable<object> {
    // Path Init
    let path;
    if (payload.baseUrl) {
      path = payload.baseUrl + payload.apiPath;
    } else {
      path = this.apiUrl + payload.apiPath;
    }
    // Options Init
    const options = {
      headers: payload.headers,
      params: payload.params,
    };
    // Api Call
    return this.http.put(path, body, options);
  }

  // Update Data
  public patch(payload: CanApi, body: any): Observable<object> {
    // Path Init
    let path;
    if (payload.baseUrl) {
      path = payload.baseUrl + payload.apiPath;
    } else {
      path = this.apiUrl + payload.apiPath;
    }
    // Options Init
    const options = {
      headers: payload.headers,
      params: payload.params,
    };
    // Api Call
    return this.http.patch(path, body, options);
  }

  // Request Api
  public request(payload: CanApi, body?: any): Observable<object> {
    switch (payload.method) {
      case "GET":
        return this.get(payload);
      case "PUT":
        return this.put(payload, body);
      case "POST":
        return this.post(payload, body);
      case "PATCH":
        return this.patch(payload, body);
      case "DELETE":
        return this.delete(payload);
    }
  }

  /**
   *
   * @param payload: CanApi
   *
   * Create HTTP Params for API Call
   */
  private createHttpParams(payload: CanApi): HttpParams {
    let httpParams = new HttpParams();
    if (payload.params) {
      if (payload.params.keys().length) {
        const apiType = this.getApiType(payload);
        if (apiType === ApiType.Loopback) {
          httpParams = this.setLoopbackParams(payload, httpParams);
        } else {
          httpParams = payload.params;
        }
      }
    }
    return httpParams;
  }

  /**
   *
   * @param payload: CanApi
   * @param httpParams: HttpParams
   *
   * Create Params for Loopback Api Call
   */
  private setLoopbackParams(
    payload: CanApi,
    httpParams: HttpParams
  ): HttpParams {
    const params = CanHelper.getParamsFromString(payload.params.toString());
    const loopbackFilterParams = this.getParamsForLoopback(params);
    if (loopbackFilterParams) {
      if (payload.loopbackDataType === "count") {
        if (loopbackFilterParams["where"]) {
          httpParams = httpParams.append(
            "where",
            JSON.stringify(loopbackFilterParams["where"])
          );
        }
      } else {
        httpParams = httpParams.append(
          "filter",
          JSON.stringify(loopbackFilterParams)
        );
      }
    }
    return httpParams;
  }

  /**
   *
   * @param params: object
   *
   * Get Created Params for Loopback
   */
  private getParamsForLoopback(params: object): object {
    const filter = {};
    const paramsKeys = Object.keys(params);
    if (paramsKeys.length) {
      paramsKeys.forEach((pK) => {
        if (this.isJson(decodeURI(params[pK])) && isNaN(params[pK])) {
          params[pK] = JSON.parse(decodeURI(params[pK]));
        }
        if (pK === "limit" && !isNaN(parseInt(params[pK]))) {
          filter["limit"] = params[pK];
        } else if (
          pK === "page" &&
          !isNaN(parseInt(params[pK])) &&
          params["limit"] &&
          !isNaN(parseInt(params["limit"]))
        ) {
          const offset = (parseInt(params[pK]) - 1) * parseInt(params["limit"]);
          filter["offset"] = offset;
        } else if (pK === "order") {
          filter["order"] = params[pK];
        } else if (pK === "include") {
          filter["include"] = params[pK];
        } else {
          if (!filter["where"]) {
            filter["where"] = { and: [] };
          }
          const val = {};
          val[pK] = params[pK];

          // Properties Filter Interceptor Start
          // const selectedProperties: number[] = localStorage.getItem(
          //   "properties"
          // )
          //   ? JSON.parse(localStorage.getItem("properties")).map(property => property.id)
          //   : [];
          // if (selectedProperties.length) {
          //   const or = [];
          //   selectedProperties.forEach((property) => {
          //     or.push({ propertyId: property });
          //   });
          //   if (pK === "or") {
          //     val[pK] = [...val[pK], ...or];
          //   }
          // }
          // Properties Filter Interceptor End

          filter["where"]["and"].push(val);
        }
      });

      // Properties Filter Interceptor Start
      // if (!filter["where"]) {
      //   filter["where"] = { and: [] };
      //   const selectedProperties: number[] = localStorage.getItem("properties")
      //     ? JSON.parse(localStorage.getItem("properties")).map(property => property.id)
      //     : [];
      //   if (selectedProperties.length) {
      //     const or = [];
      //     selectedProperties.forEach((property) => {
      //       or.push({ propertyId: property });
      //     });
      //     filter["where"]["and"].push({
      //       or: or,
      //     });
      //   }
      // }
      // Properties Filter Interceptor End
    } else {
      // Properties Filter Interceptor Start
      // const selectedProperties: number[] = localStorage.getItem("properties")
      //   ? JSON.parse(localStorage.getItem("properties")).map(property => property.id)
      //   : [];
      // if (selectedProperties.length) {
      //   const or = [];
      //   selectedProperties.forEach((property) => {
      //     or.push({ propertyId: property });
      //   });
      //   filter["or"] = or;
      // }
      // Properties Filter Interceptor End
    }
    return filter === {} ? null : filter;
  }

  // /**
  //  *
  //  * @param params: object
  //  *
  //  * Get Created Params for Loopback
  //  */
  // private getParamsForLoopback(params: object[]): object {
  //   const filter = {};
  //   params.forEach(p => {
  //     // Get Object Keys
  //     const keys = Object.keys(p);
  //     if (this.isJson(decodeURI(p[keys[0]]))) {
  //       p[keys[0]] = JSON.parse(decodeURI(p[keys[0]]));
  //     }
  //     if (keys[0] === 'limit' && !isNaN(parseInt(p[keys[0]]))) {
  //       filter['limit'] = p[keys[0]];
  //     } else if (keys[0] === 'page' && !isNaN(parseInt(p[keys[0]])) && p['limit'] && !isNaN(parseInt(p['limit']))) {
  //       const offset = (parseInt(p[keys[0]]) - 1) * parseInt(p['limit']);
  //       filter['offset'] = offset;
  //     } else if (keys[0] === 'order') {
  //       filter['order'] = p[keys[0]];
  //     } else if (keys[0] === 'include') {
  //       filter['include'] = p[keys[0]];
  //     } else {
  //       if (!filter['where']) {
  //         filter['where'] = { 'and': [] };
  //       }
  //       const val = {}
  //       val[keys[0]] = p[keys[0]];
  //       filter['where']['and'].push(val);
  //     }
  //   });
  //   return filter === {} ? null : filter;
  // }

  /**
   *
   * @param str: string
   *
   * Check string is JSON or not
   */
  private isJson(str: string): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   *
   * @param payload: CanApi
   *
   * Return Api Type
   */
  public getApiType(payload: CanApi) {
    if (payload.apiType) {
      return payload.apiType;
    } else {
      return AppConfig.authConfig.apiType;
    }
  }
}
