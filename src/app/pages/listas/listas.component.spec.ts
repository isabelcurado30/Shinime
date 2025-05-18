import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListasComponent } from './listas.component';
import { ListasService } from 'src/app/services/listas.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';

describe('ListasComponent', () => {
  let component: ListasComponent;
  let fixture: ComponentFixture<ListasComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockListasService: jasmine.SpyObj<ListasService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['obtenerUsuario']);
    mockListasService = jasmine.createSpyObj('ListasService', ['getListasByUserId']);

    await TestBed.configureTestingModule({
      declarations: [ListasComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ListasService, useValue: mockListasService },
        { provide: AuthService, useValue: mockAuthService },
        StorageService // si este servicio no requiere métodos para este test, lo puedes dejar sin mockear
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListasComponent);
    component = fixture.componentInstance;
  });

  it('should create when user is logged in', () => {
    mockAuthService.obtenerUsuario.and.returnValue({ id: 1, nombre: 'Usuario de prueba' });
    mockListasService.getListasByUserId.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.bloqueado).toBeFalse();
  });

  it('should block access when no user is logged in', () => {
    mockAuthService.obtenerUsuario.and.returnValue(null);

    fixture.detectChanges();

    expect(component.bloqueado).toBeTrue();
  });
});
