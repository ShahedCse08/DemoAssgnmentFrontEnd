import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { User } from '../interfaces/user.type';
import { UserForRegistrationDto } from '../interfaces/users/userForRegistrationDto';
import { RegistrationResponseDto } from '../interfaces/response/registrationResponseDto';
import { UserForAuthenticationDto } from '../interfaces/users/userForAuthenticationDto';


const USER_REG_API_URL  = environment.authUrl+'/Authentication';
const USER_AUTH_API_URL = environment.authUrl+'/Authentication/login';


@Injectable({
    providedIn: 'root'
  })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public loggedIn: boolean = false;


    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          // Add any other headers you need
        })
      };

    login(credential: UserForAuthenticationDto): Observable<any> {
        return this.http.post<any>(USER_AUTH_API_URL, credential)
          .pipe(map(user => {
            if (user && user.token) {
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.httpOptions = {
                headers: new HttpHeaders({
                  'Authorization': `Bearer ${user.token}`
                })
              };
              this.currentUserSubject.next(user);
              this.loggedIn = true;
              console.log('login--'+ this.loggedIn );
            }
            return user;
          }));
      }

    // login(credential : UserForAuthenticationDto) {
    //     return this.http.post<any>(USER_AUTH_API_URL, { credential })
    //     .pipe(map(user => {
    //         if (user && user.token) {
    //             localStorage.setItem('currentUser', JSON.stringify(user));
    //             this.currentUserSubject.next(user);
    //         }
    //         return user;
    //     }));
    // }

    public registerUser = (body: UserForRegistrationDto) => {
        return this.http.post<RegistrationResponseDto> (USER_REG_API_URL, body);
      }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}