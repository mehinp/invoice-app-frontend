import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login$ = (email: string, password: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .post<CustomHttpResponse<Profile>>(`${this.server}/user/login`, {
          email: email,
          password,
        })
        .pipe(tap(console.log), catchError(this.handleError))
    );

  verifyCode$ = (email: string, code: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<CustomHttpResponse<Profile>>(
          `${this.server}/user/verify/code/${email}/${code}`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

    profile$ = () =>
      <Observable<CustomHttpResponse<Profile>>>(
        this.http
          .get<CustomHttpResponse<Profile>>(
            `${this.server}/user/profile`, { headers : new HttpHeaders().set('Authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNRUhJTl9BUFBMSUNBVElPTiIsImF1ZCI6IkNVU1RPTUVSX01BTkFHRU1FTlRfU0VSVklDRSIsImlhdCI6MTc1MDk2OTQxMywic3ViIjoiZ2VvbWVoaW5AZ21haWwuY29tIiwiYXV0aG9yaXRpZXMiOlsiUkVBRDpVU0VSIiwiIFJFQUQ6Q1VTVE9NRVIiXSwiZXhwIjoxNzUwOTcxMjEzfQ.ewsqU_6lE0aqnAGf7qDPJViQfQtWaoFjvCxgBV20T3pt6jhmgCiwMQNtrQonOzFlDdB0wQMrauY2jW9MvGzpUg')}
          )
          .pipe(tap(console.log), catchError(this.handleError))
      );

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${error.error.message}`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
      } else {
        errorMessage = `An error occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
