// import { HttpClient, HttpContext, HttpContextToken, HttpHandler } from "@angular/common/http";
// import { Injectable } from "@angular/core";


// export abstract class HttpContextBuilder{
//     protected httpContext;
//     protected httpClient;
//     protected constructor(httpContext:HttpContext, httpClient : HttpClient)
//     {
//         this.httpContext = httpContext;
//         this.httpClient = httpClient;
//     }
    
//     // abstract disableBaseUrl() : HttpContextBuilder;
//     // abstract disableBearerToken(): HttpContextBuilder;
//     abstract getHttpContext() : HttpContext;
//     abstract setDisable(disableInterceptorToken : HttpContextToken<boolean>) : HttpContextBuilder;
//     abstract setDisableMany(disableInterceptorTokens : HttpContextToken<boolean>[]) : HttpContextBuilder;
//     abstract setDisableAll() : HttpContextBuilder;
//     abstract getHttpClient(): HttpClient;
// }

// class HttpContextBuilderConcrete extends HttpContextBuilder{
//     constructor(httpContext:HttpContext, httpClient : HttpClient)
//     {
//         super(httpContext, httpClient);
//     }
//     setDisableAll(): HttpContextBuilder {
//         throw new Error("Method not implemented.");
//     }
//     setDisable(disableInterceptorToken: HttpContextToken<boolean>): HttpContextBuilder {
//         this.httpContext.set(disableInterceptorToken, true);
//         return this;
//     }
//     setDisableMany(disableInterceptorTokens : HttpContextToken<boolean>[]) : HttpContextBuilder
//     {
//         disableInterceptorTokens.forEach(disableInterceptorToken => {
//             this.httpContext.set(disableInterceptorToken, true) 
//         });
//         return this;
//     }
//     getHttpContext(): HttpContext {
//         return this.httpContext;
//     }
//     getHttpClient(): HttpClient{
//         return this.getHttpClient();
//     }
    
// }




// declare module '@angular/common/http/' {

//     // Augment HttpClient with the added configuration methods from HttpService, to allow in-place replacement of
//     // HttpClient with HttpService using dependency injection
//     export interface HttpClient {
//         disableInterceptors(context:HttpContext | undefined) : HttpContextBuilder;
//     }

// }

// @Injectable()
// export class HttpClientWithSwitchingInterceptorsService extends HttpClient{
//     private contextBuilder : HttpContextBuilder | undefined = undefined;
//     constructor(handler: HttpHandler){
//         super(handler);
//     }
//     disableInterceptors(context:HttpContext | undefined = undefined) : HttpContextBuilder{
//         this.contextBuilder = new HttpContextBuilderConcrete(context === undefined ? new HttpContext() : context, this);
//         return this.contextBuilder;
//     };
    

//     override request(method?: any, url?: any, options?: any): any {
//         if(this.contextBuilder === undefined)
//             return super.request(method, url, options);
        
//         options.context = this.contextBuilder.getHttpContext();
        
//         return super.request(method, url, options);
//     }
// }

