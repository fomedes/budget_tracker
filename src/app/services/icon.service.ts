import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private iconsUrl = 'assets/icons';

  constructor(private http: HttpClient) {}

  getIcons(): Observable<string[]> {
    return this.http.get<string[]>(this.iconsUrl);
  }
}
