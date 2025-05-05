import { NgIf } from '@angular/common';
import {
  Component,
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
import { AgendasService } from '@app/agendas/services/agendas.service';
import { User } from '@app/auth/interfaces/user.interface';
import { MeetingsService } from '@app/meetings/services/meetings.service';
import { OrganizationsService } from '@app/organizations/services/organizations.service';
import { NotificatorService } from '@app/services/notificator.service';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { UserService } from '@app/shared/services/user.service';
import { ValidatorService } from '@app/shared/services/validator.service';
import { Topic } from '@app/topics/interfaces/topic.interface';
import { TypeOfMeeting } from '@app/types-of-meetings/interfaces/type-of-meeting.interface';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PickListModule } from 'primeng/picklist';
import { SelectModule } from 'primeng/select';
import { StepperModule } from 'primeng/stepper';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Organization } from 'src/app/organizations/interfaces/organization.interface';
import { Meeting, Session } from '../../interfaces/meeting.interface';

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
  private readonly validatorService = inject(ValidatorService);
  private readonly meetingsService = inject(MeetingsService);
  private readonly organizationsService = inject(OrganizationsService);
  private readonly userService = inject(UserService);

  meeting = input<Meeting>();
  typeOfMeeting = input.required<TypeOfMeeting>();

  meetingForm: FormGroup;
  newMeeting!: Meeting;
  sessions: Session[] = [Session.ORDINARY, Session.EXTRAORDINARY];
  organization?: Organization;
  availableSecretaries: User[] = [];
  sourceMembers = signal<User[]>([]);
  sourceWorkers = signal<User[]>([]);
  sourceTopics = signal<Topic[]>([]);
  targetMembers: User[] = [];
  targetGuests: User[] = [];
  targetTopics: Topic[] = [];

  visible: boolean = true;
  dataSubmitted: boolean = false;
  loadingTopics: boolean = true;

  onUpdate = output<Meeting>();
  onHide = output<void>();

  constructor() {
    this.meetingForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(5)]],
        idSecretary: ['', Validators.required],
        date: [new Date(), Validators.required],
        startTime: [new Date(), Validators.required],
        endTime: [new Date(), Validators.required],
        session: ['', Validators.required],
      },
      {
        validators: [
          this.validatorService.compareBeginningAndEnd('startTime', 'endTime'),
        ],
      }
    );
    this.userService.getAllWorkers();
    // this.authService.getAll();
  }

  ngOnInit(): void {
    this.organizationsService
      .getById(this.typeOfMeeting().organization?.id!)
      .subscribe((org) => {
        if (org) {
          this.organization = org;
          this.availableSecretaries = [org.leader!, ...org.members!];
        }
      });

    if (this.meeting()) {
      this.meetingForm.patchValue({
        name: this.meeting()!.name,
        date: new Date(this.meeting()!.date),
        startTime: new Date(this.meeting()!.startTime),
        endTime: new Date(this.meeting()!.endTime),
        session: this.meeting()!.session,
        idSecretary: this.meeting()!.secretary!.id,
      });
      this.targetTopics = [...this.meeting()?.topics!];
      this.targetMembers = [
        ...(this.meeting()?.participants as User[]).filter((w) => w.member),
      ];
      this.targetGuests = [
        ...(this.meeting()?.participants as User[]).filter((w) => !w.member),
      ];
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
    this.sourceWorkers.set(
      this.userService
        .getAllWorkersFormatted()
        .filter(
          (w) =>
            w.id !== this.organization?.leader?.id &&
            !this.organization?.members?.some((m) => m.id === w.id) &&
            !this.targetGuests.some((g) => g.id === w.id)
        )

      // this.authService
      //   .getAllWorkersFormatted()
      //   .filter(
      //     (w) =>
      //       w.id !== this.organization?.leader?.id &&
      //       !this.organization?.members?.some((m) => m.id === w.id) &&
      //       !this.targetGuests.some((g) => g.id === w.id)
      //   )
    );
  }

  submitData() {
    this.dataSubmitted = true;

    if (this.meetingForm.valid) {
      this.setTopicsList();
      this.setMembersLists();
      this.setAvailableGuests();
    }
  }

  setMembersLists() {
    this.targetMembers = [
      ...this.targetMembers.filter((m) => m.id !== this.secretary.value),
    ];

    if (this.organization) {
      this.sourceMembers.set(
        this.organization.members!.filter(
          (m) =>
            m.id !== this.secretary.value &&
            !this.targetMembers.some((m2) => m2.id === m.id)
        )
      );
    }
  }

  checkParticipants() {
    if (this.targetMembers.length === 0) {
      this.notificatorService.notificate({
        severity: 'error',
        summary: 'ERROR',
        detail: 'Debe haber al menos un miembro convocado',
      });
    }
    return this.targetMembers.length !== 0;
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

  hideDialog(meet?: Meeting) {
    if (meet) {
      this.onUpdate.emit(meet);
    }
    this.onHide.emit();
  }

  save(): void {
    this.newMeeting = {
      id: this.meeting()?.id || 0,
      name: this.name.value.trim(),
      date: this.date.value,
      startTime: this.startTime.value,
      endTime: this.endTime.value,
      session: this.session.value,
      idTypeOfMeeting: this.typeOfMeeting().id,
      idSecretary: this.secretary.value,
      members: [...this.targetMembers],
      guests: [...this.targetGuests],
      topics: [...this.targetTopics],
    };

    if (!this.meeting()) {
      this.meetingsService.add(this.newMeeting).subscribe((ok) => {
        if (ok) {
          this.hideDialog();
        }
      });
    } else {
      this.meetingsService.update(this.newMeeting).subscribe((meet) => {
        if (meet) {
          this.hideDialog(meet);
        }
      });
    }
  }

  setTopicsList() {
    this.agendasService
      .getFromTomAndYear(
        this.typeOfMeeting().id,
        (this.date.value as Date).getFullYear()
      )
      .subscribe((age) => {
        if (age) {
          const topics: Topic[] = age.topics!;

          this.sourceTopics.set(
            topics.filter(
              (t) => !this.targetTopics.some((t2) => t2.id === t.id)
            )
          );
        }

        this.loadingTopics = false;
      });
  }
}
