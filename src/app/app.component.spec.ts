import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from './core/services/auth.service';
import { BehaviorSubject } from 'rxjs';

describe('AppComponent', () => {
  const authServiceMock = {
    isLoggedIn$: new BehaviorSubject(false),
    logout: jasmine.createSpy('logout')
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppComponent, RouterTestingModule, LoadingSpinnerComponent],
    providers: [
      { provide: AuthService, useValue: authServiceMock }
    ]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'picpay-user-management-fe-test' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('picpay-user-management-fe-test');
  });
});
