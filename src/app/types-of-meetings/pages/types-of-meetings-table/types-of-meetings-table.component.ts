import { Component, inject, input, Input, OnInit } from '@angular/core';
import { TypeOfMeeting } from '../../interfaces/type-of-meeting.interface';
import { TypesOfMeetingsService } from '../../services/types-of-meetings.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { OrganizationsService } from 'src/app/organizations/services/organizations.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Agenda } from 'src/app/agenda/interfaces/agenda.interface';
// import { AgendasService } from 'src/app/agenda/services/agendas.service';
import { Organization } from 'src/app/organizations/interfaces/organization.interface';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-types-of-meetings-table',
  imports: [
    TableModule,
    ButtonModule,
    RouterLink,
    DividerModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './types-of-meetings-table.component.html',
  styleUrls: ['./types-of-meetings-table.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class TypesOfMeetingsTableComponent implements OnInit {
  private readonly _tomsService = inject(TypesOfMeetingsService);
  typesOfMeetings: TypeOfMeeting[] = [];

  tomDialog: boolean = false;
  agendasDialog: boolean = false;
  showXDialog: boolean = false;

  meetingsContent: boolean = false;

  dialogHeader: string = '';

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
  typeOfMeeting?: TypeOfMeeting;

  // @Input() organization!: Organization;
  organization = input.required<Organization>();

  // sortOptions!: SelectItem[];
  // sortOrder!: number;
  // sortField!: string;
  // sortKey: string | undefined;

  constructor(
    private fb: FormBuilder,
    private organizationsService: OrganizationsService,
    // private tomsServices: TypesOfMeetingsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService // private agendasService: AgendasService
  ) {
    // this.tomsServices.getAll();
  }

  ngOnInit(): void {
    console.log('ORGANIZATION:', this.organization);
    this._tomsService.getAllFrom(this.organization().id).subscribe((resp) => {
      if (resp) {
        console.log(resp);
        this.typesOfMeetings = resp;
      }
    });
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
}
