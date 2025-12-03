import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { ModalService } from './modal.service';
import { LoginResponseDTO } from '../models/usuario.model';
import { environment } from '../../../environments/environment';
import { RetornoAPI } from '../models/retorno-api.model';
import { EncryptPassword } from '../utils/security/encrypt-password';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);

  login(user: { email: string; password: string }): Observable<RetornoAPI<LoginResponseDTO>> {
    const senha = EncryptPassword.encryptPassword(user.password);
    user.password = senha;
    const url = `${environment.urlApi}/auth/login`;

    return this.http.post<RetornoAPI<LoginResponseDTO>>(url, user).pipe(
      map((response: RetornoAPI<LoginResponseDTO>) => {
        if (response.executouComSucesso && response.data) {
          this.setSession(response.data);
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro no login:', error);
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<boolean> {
    const token = sessionStorage.getItem('token');
    if (token) {
      const refreshToken = sessionStorage.getItem('refresh_token') as string;
      const url = `${environment.urlApi}/auth/refresh`;
      return this.http.post<any>(url, { refreshToken })
        .pipe(
          map((response: RetornoAPI<LoginResponseDTO>) => {
            if (response.executouComSucesso && response.data) {
              var user = JSON.parse(sessionStorage.getItem('usuarioLogado') || '{}') as LoginResponseDTO;
              user.accessToken = response.data.accessToken;
              user.refreshToken = response.data.refreshToken;
              this.setSession(user);
              return true;
            }
            else {
              this.modalService.openSessionExpiredModal();
              this.logout();
              return false;
            }
          }),
          catchError((error: HttpErrorResponse) => {
            this.modalService.openSessionExpiredModal();
            this.logout();
            return throwError(() => error);
          }));
    }
    return of(false);
  }

  logout(): Observable<RetornoAPI<void>> {
    const refreshToken = sessionStorage.getItem('refresh_token') as string;
    if (refreshToken) {
      const url = `${environment.urlApi}/auth/logout`;

      return this.http.post<RetornoAPI<void>>(url, { refreshToken }).
        pipe(
          map((response: RetornoAPI<void>) => {
            this.router.navigate(['/usuarios/login']);
            sessionStorage.clear();
            return response;
          }),
          catchError((error: HttpErrorResponse) => {
            this.modalService.openErrorModal();
            console.error(error);
            return throwError(() => error);
          }));
    }

    return of();
  }

  setSession(user: LoginResponseDTO): void {
    sessionStorage.setItem('access_token', user.accessToken);
    sessionStorage.setItem('refresh_token', user.refreshToken);
    sessionStorage.setItem('usuarioLogado', JSON.stringify(user));
  }

  logado(): boolean {
    return !!sessionStorage.getItem('access_token');
  }

  getVersaoApp(): string {
    return environment.versaoApp || '1.0.0';
  }
}
