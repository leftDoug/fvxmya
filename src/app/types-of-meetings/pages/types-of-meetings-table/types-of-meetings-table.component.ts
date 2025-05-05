import { Component, computed, inject, input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TypeOfMeeting } from '../../interfaces/type-of-meeting.interface';
import { TypesOfMeetingsService } from '../../services/types-of-meetings.service';
// import { Agenda } from 'src/app/agenda/interfaces/agenda.interface';
// import { AgendasService } from 'src/app/agenda/services/agendas.service';
import { Router } from '@angular/router';
import { ConfirmRemoveComponent } from '@app/shared/confirm-remove/confirm-remove.component';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Organization } from 'src/app/organizations/interfaces/organization.interface';
import { TypeOfMeetingFormComponent } from '../type-of-meeting-form/type-of-meeting-form.component';

@Component({
  selector: 'app-typesOfMeetings-table',
  imports: [
    TableModule,
    ButtonModule,
    DividerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TypeOfMeetingFormComponent,
    ConfirmRemoveComponent,
    ConfirmDialogModule,
  ],
  templateUrl: './types-of-meetings-table.component.html',
  styleUrls: ['./types-of-meetings-table.component.css'],
  providers: [ConfirmationService, MessageService, TypeOfMeetingFormComponent],
})
export class TypesOfMeetingsTableComponent implements OnInit {
  private readonly tomsService = inject(TypesOfMeetingsService);
  private readonly router = inject(Router);

  organization = input.required<Organization>();
  // FIXME: arrglar k nunca se van a pedir todos los toms, sino getAllFrom
  typesOfMeetings = computed(() => {
    return this.tomsService
      .getAllFormatted()
      .filter((tom) => tom.organization?.id === this.organization().id);
  });

  formDialogVisible: boolean = false;

  selectedTom: TypeOfMeeting | null = null;

  confirmDialogVisible: boolean = false;
  tableIsSorted: boolean | null = null;
  removeEntityName: string | null = null;
  removeEntityId: number | null = null;
  removeEntityEvent: Event | null = null;

  loading: boolean = true;

  // submitted: boolean = false;
  // agendaSubmitted: boolean = false;

  // infoContent: boolean = false;
  // createContent: boolean = false;

  // agendas: Agenda[] = [];

  // agendaForm: FormGroup = this.fb.group({
  //   id: [-1],
  //   year: [new Date(), Validators.required],
  //   idOrganization: [-1],
  // });

  // outputId: string = '';

  // @Input() organization!: Organization;

  // sortOptions!: SelectItem[];
  // sortOrder!: number;
  // sortField!: string;
  // sortKey: string | undefined;

  constructor() {}

  ngOnInit(): void {
    console.log(this.organization());
    this.tomsService.getAllFrom(this.organization().id);
    // this.organizationsService
    //   .getToMs(this.organization.id)
    //   .subscribe(
    //     (resp) => (this.typesOfMeetings = resp.arg as TypeOfMeeting[])
    //   );
    // this.sortOptions = [
    //   { label: 'Año Descendente', value: '!year' },
    //   { label: 'Año Ascendente', value: 'year' },
    // ];
  }

  showRemoveConfirmation(event: Event, id: number, name: string) {
    this.removeEntityEvent = event;
    this.removeEntityName = name;
    this.removeEntityId = id;
    this.confirmDialogVisible = true;
  }

  remove(ok: boolean) {
    if (ok) {
      this.tomsService.remove(this.removeEntityId!);
    }

    this.removeEntityId = null;
    this.removeEntityName = null;
    this.confirmDialogVisible = false;
  }

  showFormDialog(typeOfMeeting?: TypeOfMeeting) {
    if (typeOfMeeting) {
      this.selectedTom = typeOfMeeting;
    }
    this.formDialogVisible = true;
  }

  hideFormDialog() {
    this.formDialogVisible = false;
    this.selectedTom = null;
  }

  // showMeetings(tom: TypeOfMeeting) {
  //   this.meetingsContent = true;
  //   this.typeOfMeeting = tom;
  //   this.showXDialog = true;
  // }

  // // onSortChange(event: any) {
  // //   let value = event.value;

  // //   if (value.indexOf('!') === 0) {
  // //     this.sortOrder = -1;
  // //     this.sortField = value.substring(1, value.length);
  // //   } else {
  // //     this.sortOrder = 1;
  // //     this.sortField = value;
  // //   }
  // // }

  // // get year() {
  // //   return this.agendaForm.get('year')!;
  // // }

  // // get yearErrorMsg(): string {
  // //   this.year.markAsDirty();

  // //   if (this.year.errors!['required']) {
  // //     return 'El año es requerido';
  // //   }

  // //   return '';
  // // }

  // hideForm(event: boolean) {
  //   if (event) {
  //     this.tomDialog = false;
  //     this.typeOfMeeting = undefined;
  //   }
  // }

  // hideDialog(event: boolean) {
  //   if (event) {
  //     this.agendasDialog = false;
  //   }
  // }

  // reloadTable(event: boolean) {
  //   if (event) {
  //     this.organizationsService
  //       .getToMs(this.organization.id)
  //       .subscribe(
  //         (resp) => (this.typesOfMeetings = resp.arg as TypeOfMeeting[])
  //       );
  //   }
  // }

  // // close(resp: StandardResponse) {
  // //   this.messageService.add({
  // //     severity: resp.ok ? 'success' : 'error',
  // //     summary: resp.ok ? 'ÉXITO' : 'ERROR',
  // //     detail: resp.msg,
  // //     life: 3000,
  // //   });

  // //   if (resp.ok) {
  // //     this.organizationsService
  // //       .getToMs(this.idOrganization)
  // //       .subscribe((resp) => (this.typesOfMeetings = resp));
  // //   }
  // // }

  // // createAgenda() {
  // //   this.infoContent = false;
  // //   this.createContent = true;
  // // }

  // hideXDialog() {
  //   this.showXDialog = false;
  //   this.meetingsContent = false;
  //   // this.infoContent = false;
  // }

  // showForm(id: string | null) {
  //   if (id) {
  //     this.findToM(id!).then((tom) => {
  //       this.typeOfMeeting = tom;
  //       this.tomDialog = true;
  //     });
  //   } else {
  //     this.tomDialog = true;
  //   }
  // }

  // // closeAgendas(event: boolean) {
  // //   if (event) {
  // //     this.agendasDialog = false;
  // //   }
  // // }

  // showAgendasDialog(id: string) {
  //   if (id) {
  //     this.findToM(id!).then((tom) => {
  //       this.typeOfMeeting = tom;
  //       this.agendasDialog = true;
  //     });
  //   }

  //   // this.agendasDialog = true;
  //   // // this.infoContent = true;
  //   // this.outputToMId = id;

  //   // this.tomsServices.getAgendas(id).subscribe((resp) => {
  //   //   if (!resp.ok) {
  //   //     this.messageService.add({
  //   //       severity: 'error',
  //   //       summary: 'Error',
  //   //       detail: resp.msg,
  //   //       life: 3000,
  //   //     });
  //   //   } else {
  //   //     this.agendas = (resp.arg as Agenda[]).sort((a, b) => b.year - a.year);
  //   //   }
  //   // });
  // }

  // // FIXME: llamar a getNotification
  // findToM(id: string): Promise<TypeOfMeeting> {
  //   return new Promise((resolve, reject) => {
  //     this.tomsServices.getById(id).subscribe((resp) => {
  //       if (resp.ok) {
  //         resolve(resp.arg as TypeOfMeeting);
  //       } else {
  //         reject(
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'ERROR',
  //             detail: resp.msg,
  //             life: 3000,
  //           })
  //         );
  //       }
  //     });
  //   });
  // }

  // // FIXME: llamar a getNotification
  // remove(event: Event, id: string): void {
  //   this.findToM(id).then((typeOfMeeting) => {
  //     this.confirmationService.confirm({
  //       target: event.target as EventTarget,
  //       header: 'Eliminar',
  //       message: 'Está seguro de eliminar este Tipo de Reunión?',
  //       icon: 'pi pi-exclamation-triangle',
  //       acceptButtonStyleClass: 'p-button-danger p-button-text',
  //       acceptLabel: 'Sí',
  //       rejectButtonStyleClass: 'p-button-text p-button-text',
  //       accept: () => {
  //         this.tomsServices.remove(typeOfMeeting).subscribe((resp) => {
  //           this.messageService.add({
  //             severity: resp.ok ? 'info' : 'error',
  //             summary: resp.ok ? 'INFO' : 'ERROR',
  //             detail: resp.msg,
  //           });

  //           if (resp.ok) {
  //             this.typesOfMeetings = this.typesOfMeetings.filter(
  //               (tom) => tom.id !== id
  //             );
  //           }
  //         });
  //       },
  //       reject: () => {},
  //     });
  //   });
  // }

  goToMeetings(id: number) {
    this.router.navigate(['reuniones/tipo-reunion', id]);
  }

  goToAgendas(id: number) {
    this.router.navigate(['agendas/tipo-reunion', id]);
  }
}
