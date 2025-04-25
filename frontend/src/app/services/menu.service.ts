import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MenuItem } from '../models/menu-item';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  [x: string]: any;
  private baseUrl = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) {}

  // getAll(): Observable<MenuItem[]> {
  //   return this.http.get<MenuItem[]>(this.baseUrl);
  // }
  // getAll(query: string = ''): Observable<MenuItem[]> {
  //   const params = query ? { params: { q: query } } : {};
  //   return this.http.get<MenuItem[]>(this.baseUrl, params);
  // }  
  getAll(query: string = ''): Observable<MenuItem[]> {
    const params = query ? { params: { q: query } } : {};
    return this.http.get<MenuItem[]>(this.baseUrl, params);
  }

  getById(id: string): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.baseUrl}/${id}`);
  }

  getByName(name: string): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${environment.apiUrl}/menu/searchByName/${name}`);
  }  

  create(item: Omit<MenuItem,'id'>): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.baseUrl, item);
  }

  update(item: MenuItem): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.baseUrl}/${item.id}`, item);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  searchImage(query: string): Observable<string> {
    return this.http.get<{ imageUrl: string }>(`${environment.apiUrl}/menu/image?q=${query}`).pipe(
      map((res: { imageUrl: any; }) => res.imageUrl)
    );
  }
  
}
