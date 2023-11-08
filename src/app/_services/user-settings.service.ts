import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { AppLanguage, ThemeStyle } from '../_enums';

export const USER_SETTINGS_NAME = 'user_settings';

export interface UserSettings {

  userId?: string;

  theme?: ThemeStyle;

  language?: AppLanguage;

}

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  private _defaultUserSettings: UserSettings = {
    userId: '',
    theme: ThemeStyle.Light
  }

  public userWasChanged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private _storageService: LocalStorageService
  ) { }

  /**
   * @return settings object storred for currentUser
   */
   public get userSetting(): UserSettings {
    try {
      const userId = '';
      const userSettingsFromStorage = this._storageService.getItem(USER_SETTINGS_NAME);
      const userSettingsList: UserSettings[] = userSettingsFromStorage ? JSON.parse(userSettingsFromStorage) : [];

      return userSettingsList.find(item => item.userId === userId) ?? this._defaultUserSettings;
    } catch (error) {
      return this._defaultUserSettings;
    }
  }

  /**
   * store in Local storage data for User settings
   */
   public set userSetting(settings: UserSettings) {
    try {
      const userId = '';
      const userSettingsFromStorage = this._storageService.getItem(USER_SETTINGS_NAME);
      const parsedData = userSettingsFromStorage ? JSON.parse(userSettingsFromStorage) : undefined;
      const userSettingsList: UserSettings[] = parsedData ? parsedData.slice() : [];

      settings.userId = userId;

      if (userSettingsList.length === 0) {
        userSettingsList.push(settings);
      } else {
        const editedItemIndex = userSettingsList.findIndex(settingsItem => settingsItem.userId === userId);

        if (editedItemIndex === -1) {
          userSettingsList.push(settings);
        } else {
          userSettingsList[editedItemIndex] = settings;
        }
      }

      this._storageService.setItem(USER_SETTINGS_NAME, JSON.stringify(userSettingsList));

    } catch (error) {
      console.log(error);
    }
  }

}
