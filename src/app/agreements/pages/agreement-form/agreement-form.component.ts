import {
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  output,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '@app/auth/interfaces/user.interface';
import { ValidatorService } from '@app/shared/services/validator.service';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
import { Agreement } from '../../interfaces/agreement.interface';
import { AgreementsService } from '../../services/agreements.service';

@Component({
  selector: 'app-agreement-form',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './agreement-form.component.html',
  styleUrls: ['./agreement-form.component.css'],
})
export class AgreementFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly validatorsService = inject(ValidatorService);
  private readonly agreementsService = inject(AgreementsService);

  agreementForm: FormGroup;
  newAgreement!: Agreement;
  workers: User[] = [];

  submitted: boolean = false;
  visible: boolean = true;

  meeting = input.required<Meeting>();
  agreement = input<Agreement>();

  onHide = output<void>();
  @Output() onSubmit = new EventEmitter<boolean>();

  constructor() {
    this.agreementForm = this.fb.group(
      {
        content: ['', [Validators.required, Validators.minLength(10)]],
        compilanceDate: [new Date(), Validators.required],
        responsible: ['', Validators.required],
      },
      {
        validators: [
          this.validatorsService.compareMeetingAndCompilance(
            'meetingDate',
            'compilanceDate'
          ),
        ],
      }
    );
  }

  ngOnInit(): void {
    this.workers = this.meeting().participants as User[];

    if (this.agreement()) {
      this.agreementForm.patchValue({
        content: this.agreement()?.content,
        compilanceDate: this.agreement()?.compilanceDate,
        responsible: this.agreement()?.responsible?.id,
      });
      this.agreementContent.disable();
      this.responsible.disable();
    }
    // this.meetingsService
    //   .getInfo(this.meeting.id)
    //   .pipe(
    //     switchMap((resp) => {
    //       this.meeting = resp.arg as Meeting;

    //       return this.organizationsService.getInfo(
    //         (resp.arg as Meeting).organization!.id
    //       );
    //     })
    //   )
    //   .subscribe((resp2) => {
    //     this.workers = [
    //       (resp2.arg as Organization).leader!,
    //       this.meeting.secretary!,
    //       ...(this.meeting.participants as Worker[]),
    //     ];
    //   });

    // if (this.agreement) {
    //   this.agreementForm.patchValue({
    //     content: this.agreement.content,
    //     compilanceDate: new Date(this.agreement.compilanceDate),
    //     responsible: this.agreement.responsible!.id,
    //   });

    //   this.content.disable();
    //   this.responsible.disable();
    // }

    // if (!this.router.url.includes('editar')) {
    //   this.agreementsService
    //     .getAll()
    //     .subscribe((resp) =>
    //       resp.length > 0
    //         ? (this.newAgreement.number = resp.at(-1)?.number! + 1)
    //         : (this.newAgreement.number = 1)
    //     );

    //   // this.agreementForm
    //   //   .get('meeting')
    //   //   ?.valueChanges.pipe(
    //   //     tap(() => {
    //   //       this.agreementForm.get('createdBy')?.reset('');
    //   //       this.agreementForm.get('createdBy')?.enable();

    //   //       this.agreementForm.get('compilanceDate')?.reset('');
    //   //       this.agreementForm.get('compilanceDate')?.enable();

    //   //       this.agreementForm.get('responsible')?.reset('');
    //   //       this.agreementForm.get('responsible')?.enable();
    //   //     }),
    //   //     switchMap((im) => {
    //   //       const m = this.meetings.find((m) => im === m.id)!;
    //   //       console.log(m);
    //   //       console.log(m.idTypeOfMeeting);
    //   //       const date = new Date(m.date);

    //   //       date.setDate(date.getDate() + 7);

    //   //       this.agreementForm.get('meetingDate')?.setValue(new Date(m.date));
    //   //       this.agreementForm.get('compilanceDate')?.setValue(new Date(date));

    //   //       return this.typesOfMeetingsService.getById(m.idTypeOfMeeting);
    //   //     })
    //   //   )
    //   //   .subscribe((t) => {
    //   //     this.typeOfMeeting = t;

    //   //     console.log(this.typeOfMeeting);

    //   //     // this.workersAreasService
    //   //     //   .getByIdArea(this.typeOfMeeting.idArea)
    //   //     //   .subscribe((wa) => (this.workersArea = wa));

    //   //     console.log(this.workers);

    //   //     // this.workersService.getAll().subscribe((w) => {
    //   //     //   const responsibles: Worker[] = [];
    //   //     //   const s: Worker[] = [];

    //   //     //   w.forEach((worker) => {
    //   //     //     if (this.workersArea.find((wa) => worker.id === wa.FK_idWorker)) {
    //   //     //       responsibles.push(worker);
    //   //     //       s.push(worker);
    //   //     //     }
    //   //     //   });

    //   //     //   this.workers = responsibles;
    //   //     //   this.secretaries = s;
    //   //     // });
    //   //   });
    // } else {
    //   this.showAnswer = true;
    //   this.showCheck = true;
    //   this.agreementForm.get('compilanceDate')?.enable();
    //   this.agreementForm.get('meeting')?.disable();
    //   // this.agreementForm.get('responsible')?.disable();
    //   this.agreementForm.get('content')?.disable();
    //   // this.responsible.enable();
    //   this.activatedRoute.params
    //     .pipe(switchMap(({ id }) => this.agreementsService.getById(id)))
    //     .subscribe((resp) => {
    //       this.newAgreement = resp;
    //       this.agreementForm.patchValue({
    //         responsible: this.newAgreement.idResponsible,
    //         completed: this.newAgreement.completed,
    //         content: this.newAgreement.content,
    //         meeting: this.newAgreement.idMeeting,
    //         compilanceDate: new Date(this.newAgreement.compilanceDate),
    //       });
    //       this.workersService
    //         .getById(resp.idResponsible!)
    //         .subscribe((worker) => {
    //           console.log(worker);
    //           this.workers = [worker];
    //         });
    //     });
    // }
  }

  get responsible(): AbstractControl {
    return this.agreementForm.get('responsible')!;
  }

  get agreementContent(): AbstractControl {
    return this.agreementForm.get('content')!;
  }

  get compilanceDate(): AbstractControl {
    return this.agreementForm.get('compilanceDate')!;
  }

  get compilanceDateErrorMsg(): string {
    this.compilanceDate.markAsDirty();

    if (this.agreementForm.get('compilanceDate')?.errors!['required']) {
      return 'La fecha de cumplimiento es requerida';
    } else if (
      this.agreementForm.get('compilanceDate')?.errors![
        'meetingCompilanceError'
      ]
    ) {
      return 'La fecha de cumplimiento no puede ser anterior a la de la reunión';
    }
    return '';
  }

  get contentErrorMsg(): string {
    this.agreementContent.markAsDirty();

    if (this.agreementForm.get('content')?.errors!['required']) {
      return 'El contenido es requerido';
    } else if (this.agreementForm.get('content')?.errors!['minlength']) {
      return 'El contenido debe tener al menos 10 caracteres';
    }
    return '';
  }

  get responsibleErrorMsg(): string {
    this.responsible.markAsDirty();

    if (this.agreementForm.get('responsible')?.errors!['required']) {
      return 'El responsable es requerido';
    }
    return '';
  }

  // create(): void {
  //   this.newAgreement.idMeeting = this.agreementForm.get('meeting')?.value;
  //   this.newAgreement.idResponsible =
  //     this.agreementForm.get('responsible')?.value;
  //   this.newAgreement.completed = this.agreementForm.get('completed')?.value;
  //   this.newAgreement.content = this.agreementForm.get('content')?.value;
  //   this.newAgreement.compilanceDate =
  //     this.agreementForm.get('compilanceDate')?.value;

  //   if (!this.newAgreement.id) {
  //     this.generateId();

  //     this.agreementsService.add(this.newAgreement).subscribe(console.log);

  //     this.newAgreement.id = '';
  //     this.newAgreement.number = this.newAgreement.number + 1;

  //     // FIXME: esta dando palo aqui xk no se vuelven a crear las fechas en el reset
  //     this.agreementForm.reset({
  //       answer: '',
  //       completed: false,
  //       content: '',
  //       compilanceDate: this.newAgreement.compilanceDate,
  //       meeting: this.newAgreement.idMeeting,
  //       // meetingDate: this.agreementForm.get('meetingDate')?.value,
  //       responsible: this.newAgreement.idResponsible,
  //     });

  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Acuerdo Creado',
  //       detail: 'El acuerdo ha sido creado.',
  //     });
  //   } else {
  //     this.agreementsService.update(this.newAgreement).subscribe(console.log);

  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Acuerdo Actualizado',
  //       detail: 'El acuerdo ha sido actualizado.',
  //     });

  //     this.agreementForm.reset(this.agreementForm.value);
  //   }
  // }

  // generateId(): void {
  //   this.newAgreement.id =
  //     this.newAgreement.idMeeting! + this.newAgreement.number;
  // }

  validate(control: string): boolean {
    if (
      control === 'content' &&
      this.agreementForm.get(control)?.pristine &&
      this.agreementForm.get(control)?.touched &&
      this.agreementForm.get(control)?.errors!['required']
    ) {
      this.agreementForm.controls[control].markAsDirty();
    }

    return (
      this.agreementForm.get(control)?.errors! &&
      this.agreementForm.controls[control].touched
    );
  }

  save(): void {
    this.submitted = true;

    // if (this.agreementForm.valid) {
    //   if (!this.agreement) {
    //     this.newAgreement = {
    //       id: '',
    //       content: this.content.value.trim(),
    //       idMeeting: this.meeting.id,
    //       idResponsible: this.responsible.value,
    //       compilanceDate: this.compilanceDate.value,
    //     };

    //     this.agreementsService.add(this.newAgreement).subscribe((resp) => {
    //       this.messageService.add(getNotification(resp.msg!, resp.ok));

    //       if (resp.ok) {
    //         this.onSubmit.emit(true);

    //         this.agreementForm.reset();

    //         this.hideDialog();
    //       }
    //     });
    //   } else {
    //     this.newAgreement = {
    //       id: this.agreement ? this.agreement.id : '',
    //       content: this.agreement.content,
    //       idMeeting: this.agreement.meeting!.id,
    //       idResponsible: this.agreement.responsible!.id,
    //       compilanceDate: this.compilanceDate.value,
    //     };
    //     this.agreementsService.update(this.newAgreement).subscribe((resp) => {
    //       this.messageService.add(getNotification(resp.msg!, resp.ok));

    //       if (resp.ok) {
    //         this.onSubmit.emit(true);

    //         this.agreementForm.reset();

    //         this.hideDialog();
    //       }
    //     });
    //   }
    // }
  }

  hide() {
    this.onHide.emit();
  }
}
