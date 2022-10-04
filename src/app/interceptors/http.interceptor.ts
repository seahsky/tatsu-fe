import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { SwalService } from '../services/swal.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(private swal: SwalService, private location: Location) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const backendApiUrl = environment.backendApiUrl;
    request = request.clone({ url: backendApiUrl + request.url });

    return next
      .handle(request)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(response: HttpErrorResponse): Observable<never> {
    let errorMessage = response.message;

    switch (response.status) {
      case 403:
      case 404:
        this.swal.alert('Error', errorMessage).then(() => {
          this.location.back();
        });
        break;
      default:
        this.swal.alert('Error', errorMessage);
        break;
    }

    return throwError(() => new Error(errorMessage));
  }
}
