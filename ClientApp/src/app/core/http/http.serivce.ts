import { Inject, Injectable, Injector, Optional } from '@angular/core';
import { HttpClient, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BearerTokenInterceptor } from './interceptors/bearer-token.interceptor';
import { SetDefaultUrlInterceptor } from './interceptors/set-default-url.interceptor';


// HttpClient is declared in a re-exported module, so we have to extend the original module to make it work properly
// (see https://github.com/Microsoft/TypeScript/issues/13897)
declare module '@angular/common/http/' {

    // Augment HttpClient with the added configuration methods from HttpService, to allow in-place replacement of
    // HttpClient with HttpService using dependency injection
    export interface HttpClient {

        disableBearerToken() : HttpClient;
        disableDefaultUrl() : HttpClient;
        disableAll(): HttpClient;
    }

}

// From @angular/common/http/src/interceptor: allows to chain interceptors
class HttpInterceptorHandler implements HttpHandler {

    constructor(private next: HttpHandler, private interceptor: HttpInterceptor) { }

    handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
        return this.interceptor.intercept(request, this.next);
    }

}

/**
 * Allows to override default dynamic interceptors that can be disabled with the HttpService extension.
 * Except for very specific needs, you should better configure these interceptors directly in the constructor below
 * for better readability.
 *
 * For static interceptors that should always be enabled (like EndpointInterceptor), use the standard
 * HTTP_INTERCEPTORS token.
 */


/**
 * Extends HttpClient with per request configuration using dynamic interceptors.
 */
@Injectable()
export class HttpService extends HttpClient {

    constructor(private httpHandler: HttpHandler,
        private injector: Injector,
        @Optional() @Inject(HTTP_INTERCEPTORS) private interceptors: HttpInterceptor[] = []) {
        super(httpHandler);

        if (!this.interceptors) {
            // Configure default interceptors that can be disabled here
            this.interceptors = [
                this.injector.get(BearerTokenInterceptor),
                this.injector.get(SetDefaultUrlInterceptor),
            ];
            
        }
    }


    override disableAll(): HttpClient {
        return this
            .removeInterceptor(BearerTokenInterceptor)
            .removeInterceptor(SetDefaultUrlInterceptor);
            
    }
    override disableBearerToken(): HttpClient {
        return this.removeInterceptor(BearerTokenInterceptor);
    }
    override disableDefaultUrl(): HttpClient {
        return this.removeInterceptor(SetDefaultUrlInterceptor);
    }
   

    // Override the original method to wire interceptors when triggering the request.
    override request(method?: any, url?: any, options?: any): any {
        const handler = this.interceptors.reduceRight(
            (next, interceptor) => new HttpInterceptorHandler(next, interceptor),
            this.httpHandler
        );
        return new HttpClient(handler).request(method, url, options);
    }

    private removeInterceptor(interceptorType: Function): HttpService {
        console.log("ew");
        return new HttpService(
            this.httpHandler,
            this.injector,
            this.interceptors.filter(i => !(i instanceof interceptorType))
        );
    }


}
