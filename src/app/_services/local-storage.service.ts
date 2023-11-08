import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  storageChanged$ = fromEvent<StorageEvent>(window, 'storage');

  constructor() { }

  /**
   * Save data to the current local store
   */
  public setItem(item: string, itemValue: string) {
    try {
      localStorage.setItem(item, itemValue);
    } catch (error) {
      this.defaultError = error;
    }
  }

  /**
   * Get some stored data from local storage
   */
  public getItem(item: string): string | null  {
    try {
      return localStorage.getItem(item);
    } catch (error) {
      this.defaultError = error;

      return null;
    }
  }

  /**
   * Remove some stored data from local storage
   */
  public removeItem(item: string) {
    try {
      localStorage.removeItem(item);
    } catch (error) {
      this.defaultError = error;
    }
  }

  private set defaultError(error: any) {
    console.log(error);
  }
}
