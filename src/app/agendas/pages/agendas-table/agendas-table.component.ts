import { DatePipe, NgClass, NgFor } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Agenda } from '@app/agendas/interfaces/agenda.interface';
import { AgendasService } from '@app/agendas/services/agendas.service';
import { ConfirmRemoveComponent } from '@app/shared/confirm-remove/confirm-remove.component';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';

@Component({
  selector: 'app-agendas-table',
  imports: [
    ToolbarModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    NgClass,
    NgFor,
    DataViewModule,
    DatePipe,
    ConfirmRemoveComponent,
  ],
  templateUrl: './agendas-table.component.html',
  styleUrls: ['./agendas-table.component.css'],
})
export class AgendasTableComponent implements OnInit {
  private readonly agendaService = inject(AgendasService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  typeOfMeeting = input.required<TypeOfMeeting>();

  agendas = computed(() =>
    this.agendaService
      .getAllFormatted()
      .filter((age) => age.typeOfMeeting?.id === this.typeOfMeeting().id)
  );
  selectedAgenda?: Agenda;

  sortOptions: SelectItem[] = [
    { label: 'Año Descendente', value: '!year' },
    { label: 'Año Ascendente', value: 'year' },
  ];
  sortOrder!: number;
  sortField!: string;
  sortKey?: string;

  confirmDialogVisible: boolean = false;
  tableIsSorted: boolean | null = null;
  removeEntityName: string | null = null;
  removeEntityId: number | null = null;
  removeEntityEvent: Event | null = null;

  formDialogVisible: boolean = false;
  infoMode: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.agendaService.getAllFrom(this.typeOfMeeting().id);
  }

  onSortChange(event: DropdownChangeEvent) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  showFormDialog() {
    this.formDialogVisible = true;
  }

  showInfo(agenda: Agenda) {
    this.selectedAgenda = agenda;
    this.formDialogVisible = true;
    this.infoMode = true;
  }

  hideFormDialog() {
    this.formDialogVisible = false;
    this.selectedAgenda = undefined;
  }

  goToDetails(id: number) {
    this.router.navigate(['detalles', id], {
      relativeTo: this.route.parent,
    });
  }

  goToAdd() {
    this.router.navigate(['agregar', this.typeOfMeeting().id], {
      relativeTo: this.route.parent,
    });
  }

  goBack() {
    this.router.navigate([
      'organizaciones/detalles',
      this.typeOfMeeting().organization?.id,
    ]);
  }

  // TODO falta meter el remove
  showRemoveConfirmation(event: Event, id: number, name: string) {
    this.removeEntityEvent = event;
    this.removeEntityName = name;
    this.removeEntityId = id;
    this.confirmDialogVisible = true;
  }

  remove(ok: boolean) {
    if (ok) {
      this.agendaService.remove(this.removeEntityId!);
    }

    this.removeEntityId = null;
    this.removeEntityName = null;
    this.confirmDialogVisible = false;
  }
}
