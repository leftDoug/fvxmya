import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { CardModule } from 'primeng/card';
import { AgreementsTableComponent } from '../agreements-table/agreements-table.component';

@Component({
  selector: 'app-agreements-page',
  imports: [CardModule, AgreementsTableComponent],
  templateUrl: './agreements-page.component.html',
  styleUrl: './agreements-page.component.css',
})
export class AgreementsPageComponent {
  private readonly authService = inject(AuthService);

  userUsername = computed(() => this.authService.getCurrentUserUsername());

  constructor() {}
}
