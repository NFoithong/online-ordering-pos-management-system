import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private accessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // replace this!
  private apiUrl = 'https://api.unsplash.com/search/photos';

  constructor(private http: HttpClient) {}

  searchFoodImage(query: string): Observable<string | null> {
    const params = new HttpParams()
      .set('query', query)
      .set('client_id', this.accessKey)
      .set('per_page', '1');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(res => {
        if (res.results && res.results.length > 0) {
          return res.results[0].urls.small;
        }
        return null;
      })
    );
  }
}
