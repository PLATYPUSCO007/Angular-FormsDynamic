import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../services/country.service';
import { Region, SmallCountry } from '../interfaces/Country.interface';
import { delay, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrl: './selector-page.component.css'
})
export class SelectorPageComponent implements OnInit{

  public formCountry: FormGroup = this.fb.group({
    "region": ['', Validators.required],
    "pais": ['', Validators.required],
    "borders": ['', Validators.required],
  })

  constructor(private fb: FormBuilder, private countryService: CountryService){}

  get regions(): Region[]{
    return this.countryService.regions;
  }

  get countries(): SmallCountry[]{
    return this.countryService.countries;
  }

  get borders(): SmallCountry[]{
    return this.countryService.borders;
  }

  ngOnInit(): void {
    this.getCountries();
    this.getBorders();
  }

  getCountries(){
    this.formCountry.get('region')?.valueChanges
      .pipe(
        tap(()=>{
          this.formCountry.get('pais')?.setValue('');
          this.countryService.countries = [];
        }),
        switchMap(v=>this.countryService.getCountries(v))
      ).subscribe(c=>{
        this.countryService.countries = c;
      })
  }

  // getBorders(){
  //   this.formCountry.get('pais')?.valueChanges
  //     .pipe(
  //       tap((v)=>{
  //         this.formCountry.get('borders')?.setValue('');
  //         this.countryService.borders = [];
  //       }),
  //       switchMap(v=>this.countryService.getBorders(v)),
  //     ).subscribe(borders=>{
  //       console.log(borders);
  //       borders.forEach(b=>{
  //         this.countryService.getNameBorder(b)
  //           .pipe(
  //             delay(100)
  //           )
  //           .subscribe(v=>{
  //             this.countryService.borders.push(v.name);
  //           })
  //       })
  //     })
  // }

  getBorders(){
    this.formCountry.get('pais')?.valueChanges
    .pipe(
      switchMap(country=>this.countryService.getBorders(country)),
      switchMap(borders=>this.countryService.getNameBorder(borders))
    ).subscribe(smallCountries=>{
      this.countryService.borders = smallCountries;
    })
  }

}
