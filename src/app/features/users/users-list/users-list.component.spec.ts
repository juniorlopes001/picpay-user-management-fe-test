import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { By } from '@angular/platform-browser';
import { IUser } from '@app/core/models/user.model';

describe('UsersListComponent', () => {
    let component: UsersListComponent;
    let fixture: ComponentFixture<UsersListComponent>;

    const mockUsers: IUser[] = [
        { id: '1', name: 'Test User', email: 'test@example.com' }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsersListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(UsersListComponent);
        component = fixture.componentInstance;
        component.users = mockUsers;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display users in table', () => {
        const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
        expect(rows.length).toBe(1);
        expect(rows[0].nativeElement.textContent).toContain('Test User');
    });

    it('should emit edit event when click edit', () => {
        spyOn(component.edit, 'emit');
        const editBtn = fixture.debugElement.query(By.css('p-button[icon="pi pi-pencil"]'));
        editBtn.triggerEventHandler('onClick', null);
        expect(component.edit.emit).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('should emit delete event when click delete', () => {
        spyOn(component.delete, 'emit');
        const deleteBtn = fixture.debugElement.query(By.css('p-button[icon="pi pi-trash"]'));
        deleteBtn.triggerEventHandler('onClick', null);
        expect(component.delete.emit).toHaveBeenCalledWith('1');
    });
});
