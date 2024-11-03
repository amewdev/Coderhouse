import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component"
import { HttpClientTestingModule, provideHttpClientTesting } from "@angular/common/http/testing";
import { SharedModule } from "../../../shared/shared.module";
import { AuthService } from "../../../core/services/auth.services";
import { of } from "rxjs";
import { MockProvider } from "ng-mocks";

describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoginComponent
            ],
            imports: [
                HttpClientTestingModule,
                SharedModule,
            ],
            providers: [
                MockProvider(
                    AuthService,
                    {
                        login() {
                            return of()
                        }
                    }
                ),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
    })

    it("El componente debe haber sido instanciado", () => {
        expect(component).toBeTruthy();
    })

    it("El email debe ser requerido", () => {
        const emailControl = component.loginForm.get('email');

        emailControl?.setValue('');

        expect(emailControl?.hasError('required')).toBeTrue();
    })

    it("Al llamar onSubmit, si el form es inválido, todos los campos deben ser marcados como touched", () => {
        component.loginForm.setValue({
            email: '',
            password: '',
        });

        const spyOnMarkAllAsTouched = spyOn(component.loginForm,'markAllAsTouched');

        component.onSubmit();
        expect(spyOnMarkAllAsTouched).toHaveBeenCalledTimes(1);
    })

    it("Al llamar onSubmit debe llamar al login de AuthService", () => {
        component.loginForm.setValue({
            email: 'fake@mail.com',
            password: '12345',
        });

        const spyOnLogin = spyOn(component,'doLogin');

        component.onSubmit();
        expect(spyOnLogin).toHaveBeenCalled();
    })

    it("Toggle debe poder alternar entre text y password", () => {
        component.passwordInputType = "password";
        component.togglePasswordInputType();
        expect(component.passwordInputType).toBe("text");

        component.passwordInputType = "text";
        component.togglePasswordInputType();
        expect(component.passwordInputType).toBe("password");
    })

})