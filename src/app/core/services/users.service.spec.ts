import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { IUser } from '@app/core/models/user.model';

describe('UsersService', () => {
    let service: UsersService;
    let httpMock: HttpTestingController;

    const mockUsers: IUser[] = [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UsersService]
        });
        service = TestBed.inject(UsersService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should load users and update subject', () => {
        service.loadUsers();

        const req = httpMock.expectOne('http://localhost:3000/users');
        expect(req.request.method).toBe('GET');
        req.flush(mockUsers);

        service.users$.subscribe(users => {
            if (users.length > 0) {
                expect(users.length).toBe(2);
                expect(users).toEqual(mockUsers);
            }
        });
    });

    it('should delete user and update subject', () => {
        service['usersSubject'].next(mockUsers);

        service.deleteUser('1').subscribe();

        const req = httpMock.expectOne('http://localhost:3000/users/1');
        expect(req.request.method).toBe('DELETE');
        req.flush({});

        service.users$.subscribe(users => {
            if (users.length === 1) {
                expect(users.length).toBe(1);
                expect(users[0].id).toBe('2');
            }
        });
    });
});
