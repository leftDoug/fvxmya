import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Meeting, Session } from '../../interfaces/meeting.interface';
// import { ValidatorService } from 'src/app/validator/validator.service';
import { User } from '@app/auth/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Organization } from 'src/app/organizations/interfaces/organization.interface';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
// import { OrganizationsService } from 'src/app/organizations/services/organizations.service';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AgendasService } from '@app/agendas/services/agendas.service';
import { NotificatorService } from '@app/services/notificator.service';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { Topic } from '@app/topics/interfaces/topic.interface';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PickListModule } from 'primeng/picklist';
import { SelectModule } from 'primeng/select';
import { StepperModule } from 'primeng/stepper';

@Component({
  selector: 'app-meeting-form',
  imports: [
    StepperModule,
    ReactiveFormsModule,
    NgIf,
    SelectModule,
    ButtonModule,
    PickListModule,
    DialogModule,
    StepperModule,
    InputTextModule,
    DatePickerModule,
    IconFieldModule,
    InputIconModule,
    LoadingComponent,
  ],
  templateUrl: './meeting-form.component.html',
  styleUrls: ['./meeting-form.component.css'],
})
export class MeetingFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificatorService = inject(NotificatorService);
  private readonly agendasService = inject(AgendasService);
  private readonly route = inject(ActivatedRoute);

  meetingForm: FormGroup;

  newMeeting!: Meeting;

  sessions: Session[] = [Session.ORDINARY, Session.EXTRAORDINARY];

  // organizationMembers: Worker[] = [];
  availableMembers: User[] = [];
  availableWorkers = computed(() => {
    if (this.meeting()?.id) {
      return this.authService
        .getAllWorkersFormatted()
        .filter((w) => !this.guests.some((w2) => w2.id === w.id));
    }
    return this.authService
      .getAllWorkersFormatted()
      .filter(
        (w) =>
          w.id !== this.organization().leader?.id &&
          !this.organization().members?.some((w2) => w2.id === w.id)
      );
  });
  members: User[] = [];
  guests: User[] = [];
  // sourceTopics: string[] = ['asd', 'qwe', 'zxc'];
  // targetTopics: string[] = [];
  sourceTopics = signal<Topic[]>([]);
  targetTopics: Topic[] = [];

  dataSubmitted: boolean = false;
  visible: boolean = true;
  submitted: boolean = false;
  loadingTopics: boolean = true;

  typeOfMeeting = input.required<TypeOfMeeting>();
  organization = input.required<Organization>();
  meeting = input<Meeting | null>(null);
  onChanges = output<boolean>();
  onHide = output<void>();
  // @Input() organization!: Organization;
  // @Input() meeting?: Meeting;

  // @Output() onSave = new EventEmitter<boolean>();

  idTom!: number;

  constructor() {
    this.idTom = Number(this.route.snapshot.paramMap.get('id')!);
    // private validatorService: ValidatorService,
    this.meetingForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(5)]],
        idSecretary: ['', Validators.required],
        date: [new Date(), Validators.required],
        startTime: [new Date(), Validators.required],
        endTime: [new Date(), Validators.required],
        session: ['', Validators.required],
      }
      // {
      //   validators: [
      //     this.validatorService.compareBeginningAndEnd('startTime', 'endTime'),
      //   ],
      // }
    );
    this.authService.getAllWorkers();
  }

  ngOnInit(): void {
    // this.availableWorkers.set(
    //   this.authService
    //     .getAllWorkersFormatted()
    //     .filter(
    //       (w) =>
    //         w.id !== this.organization().leader?.id &&
    //         !this.organization().members?.some((w2) => w2.id === w.id)
    //     )
    // );

    // this.organizationsService
    //   .getWorkers(this.organization.id)
    //   .subscribe((resp) => {
    //     this.organizationMembers = resp.arg as Worker[];

    //     if (this.meeting) {
    //       this.members = (this.meeting.participants as Worker[]).filter(
    //         (worker) => worker.member
    //       );
    //       this.guests = (this.meeting.participants as Worker[]).filter(
    //         (worker) => !worker.member
    //       );
    //     }

    //     this.organizationsService
    //       .getById(this.organization.id)
    //       .subscribe((resp2) => {
    //         this.authService.getWorkers().subscribe((resp3) => {
    //           this.availableWorkers = (resp3.arg as Worker[]).filter(
    //             (worker) =>
    //               worker.id !== (resp2.arg as Organization).idLeader &&
    //               !this.organizationMembers.some(
    //                 (worker2) => worker2.id === worker.id
    //               )
    //           );
    //         });
    //       });
    //   });

    if (this.meeting()?.id) {
      this.meetingForm.patchValue({
        name: this.meeting()!.name,
        date: new Date(this.meeting()!.date),
        startTime: new Date(this.meeting()!.startTime),
        endTime: new Date(this.meeting()!.endTime),
        session: this.meeting()!.session,
        secretary: this.meeting()!.secretary!.id,
      });
    }
  }

  get name(): AbstractControl {
    return this.meetingForm.get('name')!;
  }

  get secretary(): AbstractControl {
    return this.meetingForm.get('idSecretary')!;
  }

  get date(): AbstractControl {
    return this.meetingForm.get('date')!;
  }

  get startTime(): AbstractControl {
    return this.meetingForm.get('startTime')!;
  }

  get endTime(): AbstractControl {
    return this.meetingForm.get('endTime')!;
  }

  get session(): AbstractControl {
    return this.meetingForm.get('session')!;
  }

  get nameErrorMsg(): string {
    this.name.markAsDirty();

    if (this.name.errors!['required']) {
      return 'El nombre es requerido';
    }

    return '';
  }

  get secretaryErrorMsg(): string {
    this.secretary.markAsDirty();

    if (this.secretary.errors!['required']) {
      return 'El secretario es requerido';
    }

    return '';
  }

  get dateErrorMsg(): string {
    this.date.markAsDirty();

    if (this.date.errors!['required']) {
      return 'La fecha es requerida';
    }

    return '';
  }

  get startTimeErrorMsg(): string {
    this.startTime.markAsDirty();

    if (this.startTime.errors!['required']) {
      return 'La hora de inicio es requerida';
    }

    return '';
  }

  get endTimeErrorMsg(): string {
    this.endTime.markAsDirty();

    if (this.endTime.errors!['required']) {
      return 'La hora de fin es requerida';
    } else if (this.meetingForm.get('endTime')?.errors!['endBeginningError']) {
      return 'La hora de fin no puede ser anterior a la hora de inicio';
    }

    return '';
  }

  get sessionErrorMsg(): string {
    this.session.markAsDirty();

    if (this.session.errors!['required']) {
      return 'La sesión es requerida';
    }

    return '';
  }

  setAvailableGuests() {
    if (this.meeting()?.id) {
      // this.availableWorkers.set(
      //   this.availableWorkers().filter(
      //     (w) => !this.guests.some((w2) => w2.id === w.id)
      //   )
      // );
    }
  }

  submitData() {
    this.dataSubmitted = true;

    if (this.meetingForm.valid) {
      this.getTopics();
      this.setAvailableMembers();
    }
  }

  // setTopics() {
  //   this.agendasService
  //     .getTopicsFrom(this.idTom, (this.date.value as Date).getFullYear())
  //     .subscribe((resp) => {
  //       if (resp) {
  //         this.sourceTopics = resp;
  //       }
  //     });
  // }

  setAvailableMembers() {
    if (this.meeting()?.id) {
      this.members = this.members.filter((m) => m.id !== this.secretary.value);

      this.availableMembers = this.organization().members!.filter(
        (m) =>
          m.id !== this.secretary.value &&
          !this.members.some((m2) => m2.id === m.id)
      );
    } else {
      this.availableMembers = this.organization().members!.filter(
        (m) => m.id !== this.secretary.value
      );
    }
  }

  checkParticipants() {
    if (this.members.length === 0) {
      this.notificatorService.notificate({
        severity: 'error',
        summary: 'ERROR',
        detail: 'Debe haber al menos un miembro convocado',
      });
    }

    return this.members.length !== 0;
  }

  checkTopics() {
    if (this.targetTopics.length === 0) {
      this.notificatorService.notificate({
        severity: 'error',
        summary: 'ERROR',
        detail: 'Debe haber al menos un Tema para tratar en la Reunión',
      });
    }

    return this.targetTopics.length !== 0;
  }

  hideDialog(hasChanges?: boolean) {
    this.submitted = false;
    this.meetingForm.reset();
    // this.availableWorkers.set(
    //   this.authService
    //     .getAllWorkersFormatted()
    //     .filter(
    //       (w) =>
    //         w.id !== this.organization().leader?.id &&
    //         !this.organization().members?.some((w2) => w2.id === w.id)
    //     )
    // );
    this.availableMembers = [
      ...this.organization().members!.filter(
        (m) => m.id !== this.secretary.value
      ),
    ];
    this.members = [];
    this.guests = [];
    if (hasChanges) {
      this.onChanges.emit(hasChanges);
    }
    this.onHide.emit();
  }

  // submit() {
  //   this.submitted = true;
  //   this.organizationForm.valid && this.setSourceWorkers();
  // }

  // save(): void {
  //   this.newMeeting = {
  //     id: this.meeting ? this.meeting.id : '',
  //     name: this.name.value.trim(),
  //     date: this.date.value,
  //     startTime: this.startTime.value,
  //     endTime: this.endTime.value,
  //     session: this.session.value,
  //     idTypeOfMeeting: this.typeOfMeeting.id,
  //     idSecretary: this.secretary.value,
  //     members: this.members.map((member) => member.id),
  //     guests: this.guests.map((guest) => guest.id),
  //   };

  //   if (!this.meeting) {
  //     this.meetingsService.add(this.newMeeting).subscribe((resp) => {
  //       this.messageService.add(getNotification(resp.msg!, resp.ok));

  //       if (resp.ok) {
  //         this.meetingForm.reset({
  //           id: '',
  //           name: '',
  //           date: new Date(),
  //           startTime: new Date(),
  //           endTime: new Date(),
  //           session: '',
  //         });

  //         this.onSave.emit(true);
  //       }
  //     });
  //   } else {
  //     this.meetingsService.update(this.newMeeting).subscribe((resp) => {
  //       this.messageService.add(getNotification(resp.msg!, resp.ok));

  //       if (resp.ok) {
  //         this.meetingForm.reset({
  //           id: '',
  //           name: '',
  //           date: new Date(),
  //           startTime: new Date(),
  //           endTime: new Date(),
  //           session: '',
  //         });

  //         this.onSave.emit(true);
  //       }
  //     });
  //   }
  // }

  getTopics() {
    console.log('LOADING:', this.loadingTopics);
    this.agendasService
      .getTopicsFrom(
        this.typeOfMeeting().id,
        (this.date.value as Date).getFullYear()
      )
      .subscribe((resp) => {
        this.sourceTopics.set(resp);
        console.log('TOPICS:', this.sourceTopics());
        this.loadingTopics = false;
        console.log('LOADING:', this.loadingTopics);
      });
  }
}
