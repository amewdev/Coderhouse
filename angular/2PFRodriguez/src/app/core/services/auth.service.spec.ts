import { TestBed } from "@angular/core/testing"
import { AuthService } from "./auth.services"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { AuthData } from "../../features/auth/models";
import { User } from "../../features/dashboard/users/models";
import { MockProvider } from "ng-mocks";
import { NavigationExtras, Router, RouterLink } from "@angular/router";

const mockUser: User = { id: 'dsds', firstName: 'mockname', lastName: 'mocksur', email: 'mock@mail.com', password: '123456', createdAt: new Date(), token: 'w389nyxcng7npm29xi9' }
const mockAuthData: AuthData = { email: 'mockuser@mail.com', password: '123456' };

fdescribe('AuthService', () => {

    let service: AuthService;
    let httpController: HttpTestingController;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            providers: [
                AuthService,
                MockProvider(Router, {
                    navigate: (comands: any[], extras?: NavigationExtras) => {
                        return new Promise((res) => res(true));
                    }
                })
            ],
        })

        httpController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(AuthService);
        router = TestBed.inject(Router);
        localStorage.clear();
    })

    it('must be defined', () => {
        expect(service).toBeTruthy();
    });

    it('must do login and insert token at LocalStorage', (done) => {

        service.login(mockAuthData).subscribe({
            next: (student) => {
                expect(student).toEqual(mockUser);
                expect(localStorage.getItem('token')).toEqual(mockUser.token);
                done();
            }
        });

        const mockReq = httpController.expectOne({
            url: `${service['baseURL']}/students?email=${mockAuthData.email}&password=${mockAuthData.password}`,
            method: 'GET',
        });

        mockReq.flush([mockUser]);
    })

    it('must throw error at when invalid login', (done) => {

        service.login(mockAuthData).subscribe({
            error: (err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err['message']).toBe('Datos inválidos');
                done();
            }
        });

        const mockReq = httpController.expectOne({
            url: `${service['baseURL']}/students?email=${mockAuthData.email}&password=${mockAuthData.password}`,
            method: 'GET',
        });

        //mockReq.flush([], { status: 401, statusText: 'Unauthorized' });
        mockReq.flush([]);
    })

    it('logout must remove token from localstorage, unset authed user and redirect to /auth/login', (done) => {

        const spyOnNavigate = spyOn(router, 'navigate');

        service.login(mockAuthData).subscribe();
        const mockReq = httpController.expectOne({
            url: `${service['baseURL']}/students?email=${mockAuthData.email}&password=${mockAuthData.password}`,
            method: 'GET',
        });
        mockReq.flush([mockUser]);

        service.logout();
        expect(localStorage.getItem('token')).toBeNull();

        service.authUser$.subscribe({
            next: (student) => {
                expect(student).toBeNull();
                done();
            }
        })

        expect(spyOnNavigate).toHaveBeenCalledOnceWith(['auth','login'])

    })

})