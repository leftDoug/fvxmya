import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  output,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TypeOfMeeting } from '../../interfaces/type-of-meeting.interface';
import { MessageService } from 'primeng/api';
import { TypesOfMeetingsService } from '../../services/types-of-meetings.service';
import { Organization } from 'src/app/organizations/interfaces/organization.interface';
import { DialogModule } from 'primeng/dialog';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-typeOfMeeting-form',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    NgIf,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './type-of-meeting-form.component.html',
  styleUrls: ['./type-of-meeting-form.component.css'],
})
export class TypeOfMeetingFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly tomsService = inject(TypesOfMeetingsService);

  tomForm: FormGroup;

  newToM: TypeOfMeeting;

  submitted: boolean = false;
  visible: boolean = true;

  typeOfMeeting = input<TypeOfMeeting | null>(null);
  idOrganization = input<number>();
  onHide = output<boolean>();

  constructor() {
    this.tomForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.newToM = {
      id: 0,
      name: '',
      idOrganization: 0,
    };
  }

  ngOnInit(): void {
    if (this.typeOfMeeting()) {
      // this.tomsService.getById(this.idToM).subscribe((resp) => {
      //   if (resp.ok) {
      //     const typeOfmeeting: TypeOfMeeting = resp.arg as TypeOfMeeting;

      this.tomForm.patchValue({
        id: this.typeOfMeeting()!.id,
        name: this.typeOfMeeting()!.name,
      });
      //   }
      // });
    }
  }

  get name(): AbstractControl {
    return this.tomForm.get('name')!;
  }

  get nameErrorMsg(): string {
    this.name.markAsDirty();

    if (this.name.errors!['required']) {
      return 'El nombre es requerido';
    } else if (this.name.errors!['minlength']) {
      return 'El nombre debe tener al menos 5 caracteres';
    }
    return '';
  }

  save(): void {
    this.submitted = true;

    if (this.tomForm.valid) {
      this.newToM = {
        id: this.typeOfMeeting()?.id || 0,
        name: this.name.value.trim(),
        idOrganization:
          this.idOrganization() || this.typeOfMeeting()?.idOrganization,
      };

      // if (!this.id.value) {
      //   this.tomsService.add(this.newToM).subscribe((resp) => {
      //     this.messageService.add(getNotification(resp.msg!, resp.ok));

      //     if (resp.ok) {
      //       this.onSubmit.emit(true);

      //       this.tomForm.reset({
      //         id: '',
      //         name: '',
      //       });

      //       this.hideDialog();
      //     }
      //   });
      // } else {
      //   this.tomsService.update(this.newToM).subscribe((resp) => {
      //     this.messageService.add(getNotification(resp.msg!, resp.ok));

      //     if (resp.ok) {
      //       this.onSubmit.emit(true);

      //       this.tomForm.reset({
      //         id: '',
      //         name: '',
      //       });

      //       this.hideDialog();
      //     }
      //   });
      // }
    }
  }

  hideDialog() {
    this.visible = false;
    this.onHide.emit(true);
  }
}
