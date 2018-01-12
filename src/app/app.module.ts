import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { LoginReducer } from './store/cacheStore.reducer';

import { AppRoutes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes),
    HttpModule,
    StoreModule.forRoot({
      login: LoginReducer
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
