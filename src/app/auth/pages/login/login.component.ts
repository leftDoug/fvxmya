import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { LoginCredentials } from '@app/models';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    PasswordModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  credentialsForm!: FormGroup;

  constructor() {
    this.credentialsForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username(): AbstractControl {
    return this.credentialsForm.get('username')!;
  }

  get password(): AbstractControl {
    return this.credentialsForm.get('password')!;
  }

  login() {
    const credentials: LoginCredentials = {
      username: this.username.value,
      password: this.password.value,
    };

    if (this.credentialsForm.valid) {
      this.authService.login(credentials).subscribe((ok) => {
        if (ok) {
          this.router.navigateByUrl('/acuerdos');
        } else {
          this.credentialsForm.reset();
        }
      });
    }
  }
}
