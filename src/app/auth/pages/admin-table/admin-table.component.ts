import { Component, computed, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-admin-table',
  imports: [
    CardModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    RegisterComponent,
  ],
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.css'],
})
export class AdminTableComponent implements OnInit {
  private readonly authService = inject(AuthService);

  users = computed(() => this.authService.getAllFormatted());
  selectdUser?: User;

  formDialogVisible: boolean = false;
  infoDialogVisible: boolean = false;

  constructor() {
    this.authService.getAll();
  }

  ngOnInit(): void {}

  showFormDialog(usr?: User): void {
    if (usr) {
      this.selectdUser = usr;
    }

    this.formDialogVisible = true;
  }

  hideFormDialog(): void {
    if (this.selectdUser) {
      this.selectdUser = undefined;
    }

    this.formDialogVisible = false;
  }

  showInfoDialog(usr: User) {
    if (usr) {
      this.selectdUser = usr;
    }

    this.infoDialogVisible = true;
  }

  hideInfoDialog() {
    if (this.selectdUser) {
      this.selectdUser = undefined;
    }

    this.infoDialogVisible = false;
  }

  lock(id: string): void {
    this.authService.setLocked(id);
  }

  unlock(id: string): void {
    this.authService.setUnlocked(id);
  }
}
