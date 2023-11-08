import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpBackend, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MaterialModule } from './_shared/material.module';
import { MainNavComponent } from './layout/header/main-nav/main-nav.component';
import { ActionsComponent } from './layout/header/actions/actions.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ThemeSelectorComponent } from './layout/header/actions/theme-selector/theme-selector.component';
import { LangSelectorComponent } from './layout/header/actions/lang-selector/lang-selector.component';
import { AppLangService } from './_services';

export const HttpLoaderFactory = (httpHandler: HttpBackend) => {
  return new TranslateHttpLoader(new HttpClient(httpHandler), './assets/i18n/', '.json?cb=' + new Date().getTime());
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainNavComponent,
    ActionsComponent,
    HomeComponent,
    PageNotFoundComponent,
    ThemeSelectorComponent,
    LangSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpBackend ]
      }
    }),
    MaterialModule
  ],
  providers: [
    AppLangService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
