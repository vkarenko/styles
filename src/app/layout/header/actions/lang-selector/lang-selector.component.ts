import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppLanguage } from 'src/app/_enums';
import { AppLangService } from 'src/app/_services';

@Component({
  selector: 'app-lang-selector',
  templateUrl: './lang-selector.component.html',
  styleUrls: ['./lang-selector.component.scss']
})
export class LangSelectorComponent implements OnInit, OnDestroy {

  langList: AppLanguage[] = this._appLangService.langList;

  selectedLang!: AppLanguage;

  private _subscription = new Subscription();

  constructor(
    private _appLangService: AppLangService
  ) { }

  ngOnInit(): void {
    this._subscription.add(
      this._appLangService.appLang$.subscribe(lang => {
        if (this.selectedLang !== lang) {
          this.selectedLang = lang;
        }
      })
    );
  }

  set appLang(lang: AppLanguage) {
    this._appLangService.appLang = lang;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}

