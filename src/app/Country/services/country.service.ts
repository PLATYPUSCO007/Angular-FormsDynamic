import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/Country.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map, of, tap } from 'rxjs';

@Injectable()
export class CountryService {

  private _regions: Region[] = [
    Region.Americas,
    Region.Africa,
    Region.Asia,
    Region.Europe,
    Region.Oceania,
  ]

  private URL_BASE: string = 'https://restcountries.com/v3.1';

  private _countries: SmallCountry[] = [];

  private _country: SmallCountry = {
    name: '',
    cca3: '',
    borders: []
  }

  private _borders: SmallCountry[] = [];

  get regions(): Region[]{
    return [...this._regions];
  }

  get countries(): SmallCountry[]{
    return [...this._countries];
  }

  public set countries(c : SmallCountry[]) {
    this._countries = c;
  }

  get country(): SmallCountry{
    return {...this._country};
  }

  public set country(c : SmallCountry) {
    this._country = c;
  }

  get borders(): SmallCountry[]{
    return this._borders;
  }

  public set borders(b : SmallCountry[]) {
    this._borders = b;
  }
  
  constructor(private http: HttpClient) { }

  public getCountries(region: Region): Observable<SmallCountry[]>{
    if (!region) return of([]);

    return this.http.get<Country[]>(`${this.URL_BASE}/region/${region}?fields=name,cca3,borders`)
      .pipe(
        tap(r=>console.log(r)),
        map(countries=>countries.map(c=>({
          name: c.name.common,
          cca3: c.cca3,
          borders: c.borders ?? []
        })))
      )
  }

  public getBorders(name: string): Observable<string[]>{
    if (!name) return of([]);

    return this.http.get<Country[]>(`${this.URL_BASE}/name/${name}?fields=name,cca3,borders`)
      .pipe(
        tap(v=>console.log(v)),
        map(c=>c[0].borders!)
      )
  }

  public getSmallCountry(name: string): Observable<SmallCountry>{
    return this.http.get<Country[]>(`${this.URL_BASE}/name/${name}?fields=name,cca3,borders`)
      .pipe(
        tap(r=>console.log('Response small ', r)),
        map(country=>({
          name: country[0].name.common,
          cca3: country[0].cca3,
          borders: country[0].borders ?? []
        }))
      )
  }

  public getNameBorder(borders: string[]): Observable<SmallCountry[]>{
    if (!borders || borders.length <= 0) return of([]);

    const observablesNameBorders: Observable<SmallCountry>[] = [];
    borders.forEach(border=>{
      const observableName: Observable<SmallCountry> = this.getSmallCountry(border);
      observablesNameBorders.push(observableName);
    });

    return combineLatest(observablesNameBorders);
  }

  // public getNameBorder(country: string): Observable<SmallCountry>{
  //   console.log('Name country border ', country);
  //   if (!country) return of({} as SmallCountry);

  //   return this.http.get<Country[]>(`${this.URL_BASE}/name/${country}?fields=name,cca3,borders`)
  //     .pipe(
  //       tap(v=>console.log('Value Borders ', v)),
  //       map(countries=>({
  //         name: countries[0].name.common,
  //         cca3: countries[0].cca3,
  //         borders: countries[0].borders ?? []
  //       })
  //     )
  //   );
  // }



  // public getBorders(): Observable<any>{
  //   return this.http.get<any>(`https://randomuser.me/api/`)
  // }

}
