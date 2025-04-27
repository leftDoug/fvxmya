import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidatorService } from '@app/shared/services/validator.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { Role, User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    DialogModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly validatorService = inject(ValidatorService);
  private readonly authService = inject(AuthService);

  user = input<User>();
  pwdMode = input<boolean>(false);

  userForm!: FormGroup;
  newUser!: User;
  roles = [Role.ADMIN, Role.ORG_LEADER, Role.WORKER];

  visible: boolean = true;
  submitted: boolean = false;

  onHide = output<void>();

  constructor() {
    this.userForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        occupation: ['', [Validators.required, Validators.minLength(3)]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(3)]],
        checkPassword: ['', Validators.required],
        oldPassword: ['', Validators.required],
        area: ['', [Validators.required, Validators.minLength(3)]],
        role: ['', [Validators.required, Validators.minLength(3)]],
      },
      {
        validators: [
          this.validatorService.differentPasswords('password', 'checkPassword'),
        ],
      }
    );
  }

  ngOnInit(): void {
    if (this.user()) {
      this.userForm.patchValue({
        name: this.user()!.name,
        username: this.user()!.username,
        occupation: this.user()!.occupation,
        area: this.user()!.area,
        role: this.user()!.role,
      });
      this.username.disable();
    }
  }

  get checkPassword(): AbstractControl {
    return this.userForm.get('checkPassword')!;
  }

  get oldPassword(): AbstractControl {
    return this.userForm.get('oldPassword')!;
  }

  get password(): AbstractControl {
    return this.userForm.get('password')!;
  }

  get username(): AbstractControl {
    return this.userForm.get('username')!;
  }

  get name(): AbstractControl {
    return this.userForm.get('name')!;
  }

  get occupation(): AbstractControl {
    return this.userForm.get('occupation')!;
  }

  get area(): AbstractControl {
    return this.userForm.get('area')!;
  }

  get role(): AbstractControl {
    return this.userForm.get('role')!;
  }

  get usernameErrorMsg(): string {
    this.username.markAsDirty();

    if (this.username.hasError('required')) {
      return 'El nombre de usuario es requerido';
    } else if (this.username.hasError('minlength')) {
      return 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    return '';
  }

  get nameErrorMsg(): string {
    this.name.markAsDirty();

    if (this.name.hasError('required')) {
      return 'El nombre es requerido';
    } else if (this.name.hasError('minlength')) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    return '';
  }

  get occupationErrorMsg(): string {
    this.occupation.markAsDirty();

    if (this.occupation.hasError('required')) {
      return 'La ocupación es requerido';
    } else if (this.occupation.hasError('minlength')) {
      return 'La ocupación debe tener al menos 3 caracteres';
    }
    return '';
  }

  get areaErrorMsg(): string {
    this.area.markAsDirty();

    if (this.area.hasError('required')) {
      return 'El área es requerida';
    } else if (this.area.hasError('minlength')) {
      return 'El área debe tener al menos 3 caracteres';
    }
    return '';
  }

  get roleErrorMsg(): string {
    this.role.markAsDirty();

    if (this.role.hasError('required')) {
      return 'El rol es requerido';
    }
    return '';
  }

  get passwordErrorMsg(): string {
    this.password.markAsDirty();

    if (this.password.hasError('required')) {
      return 'La contraseña es requerida';
    } else if (this.password.hasError('minlength')) {
      return 'La contraseña debe tener al menos 3 caracteres';
    }
    return '';
  }

  get checkPasswordErrorMsg(): string {
    this.checkPassword.markAsDirty();

    if (this.checkPassword.hasError('required')) {
      return 'La contraseña es requerida';
    } else if (this.checkPassword.hasError('differentPasswords')) {
      return 'Las contraseñas deben ser iguales';
    }
    return '';
  }

  get oldPasswordErrorMsg(): string {
    this.oldPassword.markAsDirty();

    if (this.oldPassword.hasError('required')) {
      return 'La contraseña anterior es requerida';
    }
    return '';
  }

  save() {
    this.submitted = true;

    if (this.user()) {
      this.password.setErrors(null);
      this.checkPassword.setErrors(null);
      this.oldPassword.setErrors(null);
    } else if (this.pwdMode()) {
      this.name.setErrors(null);
      this.username.setErrors(null);
      this.occupation.setErrors(null);
      this.area.setErrors(null);
      this.role.setErrors(null);
    } else {
      this.oldPassword.setErrors(null);
    }

    if (this.userForm.valid) {
      this.newUser = {
        id: this.user()?.id || '',
        name: this.name.value.trim(),
        username: this.username.value,
        occupation: this.occupation.value.trim(),
        password: this.password.value,
        role: this.role.value,
        area: this.area.value,
      };

      if (!this.user() && !this.pwdMode()) {
        this.authService.register(this.newUser).subscribe((ok) => {
          if (ok) {
            this.hideDialog();
          }
        });
      } else if (this.user()) {
        this.authService.update(this.newUser).subscribe((ok) => {
          if (ok) {
            this.hideDialog();
          }
        });
      } else {
        const pwds = {
          oldPwd: this.oldPassword.value,
          newPwd: this.password.value,
        };
        this.authService.changePassword(pwds).subscribe((ok) => {
          if (ok) {
            this.hideDialog();
          }
        });
      }
    }
  }

  hideDialog() {
    this.onHide.emit();
  }
}
