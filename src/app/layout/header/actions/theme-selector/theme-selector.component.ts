import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeStyle } from 'src/app/_enums';
import { StyleManagerService } from 'src/app/_services';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss']
})
export class ThemeSelectorComponent implements OnInit, OnDestroy {

  ThemeStyle = ThemeStyle;

  selectedTheme: ThemeStyle = ThemeStyle.Light;

  _subscription = new Subscription();

  constructor(
    private _styleManagerService: StyleManagerService
  ) { }

  ngOnInit(): void {
    this._subscription.add(this._subscription = this._styleManagerService.styleType$.subscribe(
      style => this.selectedTheme = style
    ));
  }

  selectDarkTheme() {
    this._styleManagerService.styleType$.next(ThemeStyle.Dark);
  }

  selectLightTheme() {
    this._styleManagerService.styleType$.next(ThemeStyle.Light);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
