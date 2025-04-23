import { NgClass, NgFor } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Agenda } from '@app/agendas/interfaces/agenda.interface';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { TypeOfMeeting } from 'src/app/types-of-meetings/interfaces/type-of-meeting.interface';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';

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
    RouterLink,
  ],
  templateUrl: './agendas-table.component.html',
  styleUrls: ['./agendas-table.component.css'],
})
export class AgendasTableComponent implements OnInit {
  private readonly tomsService = inject(TypesOfMeetingsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  agendas = signal<Agenda[] | undefined>(undefined);
  selectedAgenda?: Agenda;

  sortOptions: SelectItem[] = [
    { label: 'Año Descendente', value: '!year' },
    { label: 'Año Ascendente', value: 'year' },
  ];
  sortOrder!: number;
  sortField!: string;
  sortKey?: string;

  formDialogVisible: boolean = false;
  infoMode: boolean = false;

  typeOfMeeting = input.required<TypeOfMeeting>();

  constructor() {}

  ngOnInit(): void {
    this.tomsService.getAgendas(this.typeOfMeeting().id).subscribe((resp) => {
      if (resp) {
        this.agendas.set(
          (resp as Agenda[]).sort(
            (a, b) => (b.year as number) - (a.year as number)
          )
        );
      }
    });

    // this.agendasService.getAll().subscribe((a) => {
    //   let tempAgendas: Agenda[] = [];
    //   a.forEach((item) => {
    //     let tempAgenda: Agenda = item;
    //     this.typesOfMeetingsService
    //       .getById(item.idTypeOfMeeting)
    //       .pipe(
    //         switchMap((typeOfMeeting) => {
    //           tempAgenda.idTypeOfMeeting = typeOfMeeting.name;
    //           return this.areasService.getById(typeOfMeeting.idArea!);
    //         })
    //       )
    //       .subscribe(
    //         (rArea) =>
    //           (tempAgenda.idTypeOfMeeting =
    //             tempAgenda.idTypeOfMeeting + ' (' + rArea.name + ')')
    //       );
    //     tempAgendas.push(tempAgenda);
    //   });
    //   this.agendas = tempAgendas;
    // });
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

  showInfo(a: Agenda) {
    this.selectedAgenda = a;
    this.formDialogVisible = true;
    this.infoMode = true;
  }

  reloadTable(ok: boolean) {
    if (ok) {
      // this.typeOfMeetingsService
      //   .getAgendas(this.typeOfMeeting!.id)
      //   .subscribe(
      //     (resp) =>
      //       (this.agendas = (resp.arg as Agenda[]).sort(
      //         (a, b) => b.year - a.year
      //       ))
      //   );
    }
  }

  // changeView(change: boolean) {
  //   if (change) {
  //     this.createVisible = false;
  //     this.agenda = undefined;
  //   }
  // }

  hideFormDialog() {
    this.formDialogVisible = false;
    this.selectedAgenda = undefined;
  }

  goToInfo(id: number) {
    this.router.navigate(['info', id]);
  }

  goToCreate() {
    this.router.navigate(['agregar', this.typeOfMeeting().id], {
      relativeTo: this.route.parent,
    });
  }

  goBack() {
    this.router.navigateByUrl(
      `organizaciones/info/${this.typeOfMeeting().idOrganization}`
    );
  }
}
