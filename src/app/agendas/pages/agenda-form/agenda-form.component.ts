import { DatePipe, NgIf, UpperCasePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Agenda } from '@app/agendas/interfaces/agenda.interface';
import { AgendasService } from '@app/agendas/services/agendas.service';
import { NotificatorService } from '@app/services/notificator.service';
import { ConfirmRemoveComponent } from '@app/shared/confirm-remove/confirm-remove.component';
import { TopicFormComponent } from '@app/topics/components/topic-form/topic-form.component';
import { Topic } from '@app/topics/interfaces/topic.interface';
import { TypeOfMeeting } from '@app/types-of-meetings/interfaces/type-of-meeting.interface';
import { TypesOfMeetingsService } from '@app/types-of-meetings/services/types-of-meetings.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { of } from 'rxjs';

@Component({
  selector: 'app-agenda-form',
  imports: [
    DatePipe,
    ToolbarModule,
    NgIf,
    ButtonModule,
    DatePickerModule,
    TableModule,
    UpperCasePipe,
    DialogModule,
    ReactiveFormsModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TopicFormComponent,
    ConfirmRemoveComponent,
  ],
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.css'],
})
export class AgendaFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly agendasService = inject(AgendasService);
  private readonly tomsService = inject(TypesOfMeetingsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificatorService = inject(NotificatorService);
  private state = signal({ topics: new Map<number, Topic>() });

  topics = computed(() => Array.from(this.state().topics.values()));
  agendaForm: FormGroup;
  newAgenda?: Agenda;
  selectedTopic?: Topic;
  typeOfMeeting?: TypeOfMeeting;

  topicDialogVisible: boolean = false;
  submitted: boolean = false;
  infoMode: boolean = false;
  editMode: boolean = false;
  createMode: boolean = false;
  confirmDialogVisible: boolean = false;
  removeEntityName: string | null = null;
  removeEntityId: number | null = null;
  removeEntityEvent: Event | null = null;

  counter: number = -1;

  id = input.required<string>();

  constructor() {
    this.agendaForm = this.fb.group({
      year: [
        new Date(),
        [Validators.required, Validators.min(2000), Validators.max(2070)],
      ],
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.routeConfig?.path?.includes('detalles')) {
      this.infoMode = true;
    } else {
      this.createMode = true;
    }

    if (!this.createMode) {
      this.agendasService.getById(Number(this.id())).subscribe((age) => {
        if (age) {
          this.newAgenda = age;
          this.agendaForm.patchValue({
            year: new Date(age.year),
          });
          const tempTopic: Topic[] = age.topics!;
          of(tempTopic).subscribe((result) => {
            result.forEach((t) => {
              this.state().topics.set(t.id, t);
            });
            this.state.set({ topics: this.state().topics });
          });
        }
      });
    } else {
      this.tomsService.getInfo(Number(this.id())).subscribe((resp) => {
        if (resp) {
          this.typeOfMeeting = resp;
        }
      });
    }
  }

  get year(): AbstractControl {
    return this.agendaForm.get('year')!;
  }

  get yearErrorMsg(): string {
    if (this.year.errors!['required']) {
      return 'El año es requerido';
    } else if (this.year.errors!['min']) {
      return 'El año debe ser igual o posterior al 2000';
    }
    return '';
  }

  edit() {
    this.infoMode = false;
    this.editMode = true;
  }

  save() {
    this.submitted = true;

    if (this.topics().length === 0) {
      this.notificatorService.notificate({
        severity: 'error',
        summary: 'ERROR',
        detail: 'La Agenda debe tener al menos un Tema',
      });
    } else if (this.agendaForm.valid) {
      this.newAgenda = {
        id: this.newAgenda?.id || 0,
        year: this.year.value.getFullYear(),
        idTypeOfMeeting: this.newAgenda?.typeOfMeeting?.id || Number(this.id()),
        topics: this.topics(),
      };

      if (this.editMode) {
        this.agendasService.update(this.newAgenda).subscribe((resp) => {
          if (resp) {
            this.goBack();
          }
        });
      } else {
        this.agendasService.add(this.newAgenda).subscribe((resp) => {
          if (resp) {
            this.goBack();
          }
        });
      }
    }
  }

  hideTopicDialog() {
    this.topicDialogVisible = false;
    this.selectedTopic = undefined;
  }

  showRemoveConfirmation(event: Event, id: number, name: string) {
    this.removeEntityEvent = event;
    this.removeEntityName = name;
    this.removeEntityId = id;
    this.confirmDialogVisible = true;
  }

  remove(ok: boolean) {
    if (ok) {
      this.state().topics.delete(this.removeEntityId!);
      this.notificatorService.notificate({
        severity: 'info',
        summary: 'ELIMINADO',
        detail: 'Se ha eliminado el Tema',
      });
      this.state.set({ topics: this.state().topics });
    }
    this.removeEntityId = null;
    this.removeEntityName = null;
    this.confirmDialogVisible = false;
  }

  showTopicDialog(topic?: Topic) {
    if (topic) {
      this.selectedTopic = topic;
    }
    this.topicDialogVisible = true;
  }

  goBack() {
    if (this.editMode || this.infoMode) {
      this.router.navigateByUrl(
        `agendas/${
          this.newAgenda?.typeOfMeeting?.id || this.newAgenda?.idTypeOfMeeting
        }`
      );
    } else {
      this.router.navigateByUrl(`agendas/${this.id()}`);
    }
  }

  addTopic(topic: Topic) {
    const coincidence: boolean = this.topics().some(
      (t) =>
        t.monthNumber === topic.monthNumber &&
        t.name.toLowerCase() === topic.name.toLowerCase() &&
        t.id !== topic.id
    );

    if (coincidence) {
      this.notificatorService.notificate({
        severity: 'error',
        summary: 'ERROR',
        detail: 'Este Tema ya existe para este mes',
      });
    } else {
      if (topic.id === 0) {
        topic.id = this.counter;
        this.counter--;
        this.state().topics.set(topic.id, topic);
        this.notificatorService.notificate({
          severity: 'success',
          summary: 'AGREGADO',
          detail: 'Tema agregado',
        });
      } else {
        this.state().topics.set(topic.id, topic);
        this.notificatorService.notificate({
          severity: 'info',
          summary: 'ACTUALIZADO',
          detail: 'Tema actualizado',
        });
      }
      this.hideTopicDialog();
      this.state.set({ topics: this.state().topics });
    }
  }
}
