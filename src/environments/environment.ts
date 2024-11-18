// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl: "https://biotech-connects-api.onrender.com/v1",
  tokenKey: "authorization",
  baseUrl: "http://localhost:4000/v1",
  razorpayUrl: 'https://razorpay.com'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zonebuild related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
