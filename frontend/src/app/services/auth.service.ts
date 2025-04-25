// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// export interface User {
//   id: string;
//   username: string;
//   role: 'admin' | 'customer';
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private userKey = 'currentUser';

//   constructor(private http: HttpClient, private router: Router) {}

//   getCurrentUser(): User | null {
//     const user = localStorage.getItem(this.userKey);
//     return user ? JSON.parse(user) : null;
//   }

//   isLoggedIn(): boolean {
//     return !!this.getCurrentUser();
//   }

//   isAdmin(): boolean {
//     const user = this.getCurrentUser();
//     return user?.role === 'admin';
//   }

//   login(username: string, password: string): Observable<any> {
//     return this.http.post<{ token: string }>('/api/auth/login', { username, password }).pipe(
//       tap(res => {
//         const payload = JSON.parse(atob(res.token.split('.')[1]));
//         const user = { id: payload.id, username: payload.username, role: payload.role };
//         localStorage.setItem(this.userKey, JSON.stringify(user));
//         localStorage.setItem('authToken', res.token); // Optional token storage
//       })
//     );
//   }

//   logout(): void {
//     localStorage.removeItem(this.userKey);
//     localStorage.removeItem('authToken'); // Also remove token if stored
//     this.router.navigate(['/login']);
//   }

//   saveUser(user: User): void {
//     localStorage.setItem(this.userKey, JSON.stringify(user));
//   }
// }
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'customer';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userKey = 'currentUser';

  constructor(private router: Router) {}

  login(username: string, password: string): Observable<User> {
    const users: User[] = [
      { id: '1', username: 'admin', role: 'admin' },
      { id: '2', username: 'customer', role: 'customer' }
    ];

    const user = users.find(u => u.username === username && password === 'password');

    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
      return of(user);
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }
}
