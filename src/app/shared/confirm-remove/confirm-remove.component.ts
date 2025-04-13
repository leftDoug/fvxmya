import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-confirm-remove',
  imports: [ConfirmDialogModule],
  template: '<p-confirmDialog/>',
  styleUrl: './confirm-remove.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ConfirmRemoveComponent implements OnInit {
  private _confirmationService: ConfirmationService =
    inject(ConfirmationService);

  event = input.required<Event>();
  entityType = input.required<string>();
  entityName = input.required<string>();
  onConfirm = output<boolean>();

  ngOnInit(): void {
    this._confirmationService.confirm({
      target: this.event().target as EventTarget,
      message: `Está seguro de eliminar ${this.entityName()}?`,
      header: `Eliminar ${this.entityType()}`,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
      },
      acceptButtonProps: {
        label: 'Sí',
        icon: 'pi pi-trash',
        severity: 'danger',
      },
      accept: () => {
        this.onConfirm.emit(true);
      },
      reject: () => {
        this.onConfirm.emit(false);
      },
    });
  }
}
