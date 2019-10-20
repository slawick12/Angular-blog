import { Injectable } from "@angular/core";
import { User } from "../interfaces";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { tap, catchError } from "rxjs/operators";
import { FbAuthResponse } from "../interfaces";

@Injectable({ providedIn: "root" })
export class AuthService {

  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem("fb-token-exp"));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem("fb-token");
  }
  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        user
      )
      .pipe(
        tap(this.setToken),
        catchError(this.handelError.bind(this))
      );
  }
  logout() {
    this.setToken(null);
  }
  isAuth(): boolean {
    return !!this.token;
  }
  private handelError(error: HttpErrorResponse) {
    const { message } = error.error.error;
    switch (message) {
      case "INVALID_EMAIL":
        this.error$.next("Invalid Email");
        break;
      case "INVALID_PASSWORD":
        this.error$.next("Invalid Passord");
        break;
      case "EMAIL_NOT_FOUND":
        this.error$.next("Email not found");
        break;
    }
    return throwError(error);
  }

  private setToken(response: FbAuthResponse | null) {
    if (response) {
      const expDate = new Date(
        new Date().getTime() + +response.expiresIn * 1000
      );
      localStorage.setItem("fb-token", response.idToken);
      localStorage.setItem("fb-token-exp", expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
