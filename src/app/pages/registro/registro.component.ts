import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component ({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})

export class RegistroComponent {
  registroForm: FormGroup;
  mensaje: string = '';
  error: boolean = false;

  constructor (private fb: FormBuilder, private authService: AuthService) {
    this.registroForm = this.fb.group ({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  registrar() {
    if (this.registroForm.invalid) return;

    this.authService.registrar (this.registroForm.value).subscribe ({
      next: (res: any) => {
        this.error = res.error;
        this.mensaje = res.mensaje;
      },

      error: err => {
        this.error = true;
        this.mensaje = 'Error de Red o del Servidor';
      }
    });
  }
}
