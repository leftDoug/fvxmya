import { NgIf } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {
  TypeOfMeeting,
  TypeOfMeetingCreate,
} from '../../interfaces/type-of-meeting.interface';
import { TypesOfMeetingsService } from '../../services/types-of-meetings.service';

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

  newTom!: TypeOfMeetingCreate | TypeOfMeeting;

  submitted: boolean = false;
  visible: boolean = true;

  typeOfMeeting = input<TypeOfMeeting | null>(null);
  idOrganization = input.required<number>();
  onHide = output<void>();

  constructor() {
    this.tomForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    if (this.typeOfMeeting()) {
      // this.tomsService.getById(this.idToM).subscribe((resp) => {
      //   if (resp.ok) {
      //     const typeOfmeeting: TypeOfMeeting = resp.arg as TypeOfMeeting;
      this.newTom = this.typeOfMeeting()!;
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
      if (!this.typeOfMeeting()) {
        this.newTom = {
          name: this.name.value.trim() as string,
          idOrganization:
            this.typeOfMeeting()?.idOrganization || this.idOrganization(),
        };

        this.tomsService
          .create(this.newTom)
          .subscribe((ok) => ok && this.hideDialog());
      } else {
        this.newTom = {
          id: this.typeOfMeeting()!.id,
          name: this.name.value.trim() as string,
          idOrganization: this.typeOfMeeting()!.organization!.id,
        };
        this.tomsService
          .update(this.newTom)
          .subscribe((ok) => ok && this.hideDialog());
      }

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
    // this.visible = false;
    this.onHide.emit();
  }
}
