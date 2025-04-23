import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Topic } from '@app/topics/interfaces/topic.interface';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-topic-form',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    DatePickerModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './topic-form.component.html',
  styleUrl: './topic-form.component.css',
})
export class TopicFormComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  topicForm: FormGroup;
  newTopic?: Topic;

  visible: boolean = true;
  submitted: boolean = false;

  topic = input<Topic>();
  onHide = output<void>();
  onSave = output<Topic>();

  constructor() {
    this.topicForm = this.fb.group({
      month: [new Date(), Validators.required],
      name: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    if (this.topic()) {
      this.topicForm.patchValue({
        month: this.topic()?.month,
        name: this.topic()?.name,
      });
    }
  }

  get month(): AbstractControl {
    return this.topicForm.get('month')!;
  }

  get name(): AbstractControl {
    return this.topicForm.get('name')!;
  }

  get monthErrorMsg(): string {
    this.month.markAsDirty();

    if (this.month.errors!['required']) {
      return 'El mes es requerido';
    }
    return '';
  }

  get nameErrorMsg(): string {
    this.name.markAsDirty();

    if (this.name.errors!['required']) {
      return 'El tema es requerido';
    } else if (this.name.errors!['minlength']) {
      return 'El tema debe tener al menos 10 caracteres';
    }
    return '';
  }

  hide() {
    this.onHide.emit();
  }

  add() {
    this.submitted = true;
    if (this.topicForm.valid) {
      this.newTopic = {
        id: this.topic()?.id || 0,
        month: this.month.value,
        name: this.name.value.trim(),
        monthNumber: this.month.value.getMonth(),
      };
      this.onSave.emit(this.newTopic);
    }
  }
}
