import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserSettingsService } from '.';
import { ThemeStyle } from '../_enums';

@Injectable({
  providedIn: 'root'
})
export class StyleManagerService {

  styleType$ = new BehaviorSubject<ThemeStyle>(this._themeFromSettings);

  constructor(
    private _userSettingsService: UserSettingsService
  ) {
    this.styleType$.subscribe(
      (styleType: ThemeStyle) => {
        switch (styleType) {
          case ThemeStyle.Dark:
            this._getLinkElementForKey('dark-theme').setAttribute('href', 'dark-theme.css');
            document.body.classList.remove('wscad-theme');
            document.body.classList.add('dark-theme');
            break;

          default:
            this._removeStyle('dark-theme');
            document.body.classList.remove('dark-theme');
            break;
        }

        this._storeThemeToSettings(styleType);
      }
    );

    this._userSettingsService.userWasChanged$.subscribe(status => {
      if (status) {
        this.applyThemeFromSettings();
      }
    });
  }

  applyThemeFromSettings(): void {
    if (this._themeFromSettings) {
      this.styleType$.next(this._themeFromSettings);
    }
  }

  private get _themeFromSettings(): ThemeStyle {
    const userSettings = this._userSettingsService.userSetting;

    return userSettings.theme || ThemeStyle.Light;
  }

  private _storeThemeToSettings(theme: ThemeStyle): void {
    const userSettings = this._userSettingsService.userSetting;
    userSettings.theme = theme;
    this._userSettingsService.userSetting = userSettings;
  }

  private _removeStyle(key: string): void {
    const existingLinkElement = this._getExistingLinkElementByKey(key);

    if (existingLinkElement) {
      document.head.removeChild(existingLinkElement);
    }
  }

  private _getLinkElementForKey(key: string): Element {
    return this._getExistingLinkElementByKey(key) || this._createLinkElementWithKey(key);
  }

  private _getExistingLinkElementByKey(key: string): Element | null {
    return document.head.querySelector(`link[rel="stylesheet"].${this.getClassNameForKey(key)}`);
  }

  private _createLinkElementWithKey(key: string): HTMLLinkElement {
    const linkEl = document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.classList.add(this.getClassNameForKey(key));
    document.head.appendChild(linkEl);

    return linkEl;
  }

  private getClassNameForKey(key: string): string {
    return `style-manager-${key}`;
  }

}
