import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CountriesFromApi, CountriesList } from '../_interfaces';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private _http: HttpClient
  ) { }

  public getCountriesList(): Observable<CountriesList[]> {
    return this._http.get<CountriesFromApi[]>('https://restcountries.com/v3.1/all?fields=name').pipe(
      map((countriesList) => {
        return countriesList.map((country) => {
          return {
            name: country.name.common
          };
        });
      })
    );
  }

}
