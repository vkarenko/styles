import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CountriesList, ExampleForm } from 'src/app/_interfaces';
import { FormService } from 'src/app/_services/form.service';

export type IForm<T> = {
  [K in keyof T]: any;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  countriesList: CountriesList[] = [];

  private _formData: IForm<ExampleForm> = {
    firstName: ['', [Validators.required, this._trim]],
    lastName: ['', [Validators.required, this._trim]],
    email: ['', [Validators.required, Validators.email]],
    country: ''
  }

  submittedValues: ExampleForm | undefined = undefined;

  formGroup = this._formBuilder.group<ExampleForm>(this._formData);

  constructor(
    private _formService: FormService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this._formService.getCountriesList().subscribe((countriesList) => {
      this.countriesList = countriesList;
    });
  }

  submitForm(): void {
    this.submittedValues = {
      firstName: this.formGroup.get('firstName')?.value as string,
      lastName: this.formGroup.get('lastName')?.value as string,
      email: this.formGroup.get('email')?.value as string,
      country: this.formGroup.get('country')?.value as string
    };
  }

  resetForm(): void {
    this.formGroup.reset();
  }

  restartForm(): void {
    this.resetForm();
    this.submittedValues = undefined;
  };

  private _trim(control: FormControl): { whitespace: boolean; } | null {
    const valueTrimmed = typeof control.value === 'string' ? control.value.trim() : '';
    const isWhitespace = valueTrimmed.length === 0;
    const isValid = !isWhitespace;

    return isValid ? null : { whitespace: true };
  }

}
