import { Component, computed, inject, OnInit } from '@angular/core';
import { UserService } from '@app/shared/services/user.service';
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
  private readonly userService = inject(UserService);

  users = computed(() => this.userService.getAllUsersFormatted());
  selectdUser?: User;

  formDialogVisible: boolean = false;
  infoDialogVisible: boolean = false;

  constructor() {
    this.userService.getAllUsers();
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
    this.userService.lock(id);
  }

  unlock(id: string): void {
    this.userService.unlock(id);
  }
}
