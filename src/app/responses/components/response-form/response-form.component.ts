import { UpperCasePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Agreement } from '@app/agreements/interfaces';
import { getSeverity, getStatus } from '@app/shared/severity-status';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-response-form',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    TextareaModule,
    ButtonModule,
    UpperCasePipe,
    TagModule,
  ],
  templateUrl: './response-form.component.html',
  styleUrl: './response-form.component.css',
})
export class ResponseFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  responseForm: FormGroup;

  visible: boolean = true;
  submitted: boolean = false;

  agreement = input.required<Agreement>();
  onHide = output<void>();
  onShow = output<void>();

  constructor() {
    this.responseForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  get responseContent(): AbstractControl {
    return this.responseForm.get('content')!;
  }

  get contentErrorMsg(): string {
    this.responseContent.markAsDirty();

    if (this.responseContent.errors!['required']) {
      return 'La respuesta es requerida';
    }
    return '';
  }

  getStatusLocal(agreement: Agreement) {
    return getStatus(agreement);
  }

  getSeverityLocal(agreement: Agreement) {
    const status = getStatus(agreement);
    return getSeverity(status);
  }

  hide() {
    this.onHide.emit();
  }

  save() {}

  disableMainPageScroll() {
    document.body.classList.add('p-overflow-hidden');
  }
}
