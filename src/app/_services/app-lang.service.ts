import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { UserSettingsService } from '.';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AppLanguage } from '../_enums';


@Injectable({
  providedIn: 'root'
})
export class AppLangService {

  public langList: AppLanguage[] = [
    AppLanguage.en, AppLanguage.de, AppLanguage.es
  ];

  public appLang$ = new BehaviorSubject<AppLanguage>(AppLanguage.en);

  private _subscription = new Subscription();

  constructor(
    private _userSettingsService: UserSettingsService,
    private _translateService: TranslateService
  ) {
    // Default language for app
    // If translation not found for key, it will be used from default language
    this._translateService.setDefaultLang(AppLanguage.en);

    // Set initial language for app
    this.appLang = this._languageForApp;

    // Here is subscription for language change from TranslateService
    // It is needed for updating language in app
    // Logic is to update app language only when it was updated in TranslateService
    this._subscription.add(this._translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      const lang = event.lang as AppLanguage;

      this.appLang$.next(lang);
      this._saveLangToSettings(lang);
    }));

    // Here is subscription for User update event
    // It is needed for updating language in app when user was changed
    // And user has storred language in settings
    this._subscription.add(
      this._userSettingsService.userWasChanged$.subscribe(status => {
        if (status) {
          this.appLang = this._languageForApp;
        }
      })
    );
  }

  /**
   * @return string value for app language
   */
  public get appLang(): AppLanguage {
    return this.appLang$.value;
  }

   /**
   * Set value for app language
   * @param lang lang: AppLanguage
   */
  public set appLang(lang: AppLanguage) {
    this._translateService.use(lang).subscribe({
      error: (error: HttpErrorResponse) => {
        this._handleError(error);
      }
    });
  }

  /**
   * Get translation for key
   * @param key string
   * @return usualy string but can be object
   */
  public getTranslation(key: string, translateParams: object = {}): Observable<string | any> {
    return this._translateService.get(key, translateParams);
  };

  /**
   * Get instant translation for key
   * @param key string
   * @return string of translation
   */
  public getInstantTranslation(key: string): string {
    return this._translateService.instant(key);
  };

  /**
   * 1). Checks for a language settings in Local storage.
   *
   * 2). If there is no settings, checks for a language from browser.
   *
   * 3). If browser lang not in our list takes `'en'`
   */
  private get _languageForApp(): AppLanguage {
    const storredLang = this._userSettingsService.userSetting.language;

    const lang = storredLang ?? this._translateService.getBrowserLang();

    return this._isLangFromList(lang) ? lang as AppLanguage : AppLanguage.en;
  }

  /**
   * Check if new value is in list of languages
   */
  private _isLangFromList(lang: string | undefined): boolean {
    return (this.langList.indexOf(lang as AppLanguage) !== -1);
  }

  /**
   * Save language to user settings
   */
  private _saveLangToSettings(lang: AppLanguage): void {
    const userSettings = this._userSettingsService.userSetting;

    userSettings.language = lang;

    this._userSettingsService.userSetting = userSettings;
  }

  private _handleError(error: HttpErrorResponse): void {
    console.log(error);
  }

}
