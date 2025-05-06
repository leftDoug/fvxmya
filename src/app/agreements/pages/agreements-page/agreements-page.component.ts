import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);

  userUsername = computed(() => this.authService.getCurrentUserUsername());
  general = false;

  constructor() {
    if (this.route.snapshot.routeConfig?.path?.includes('general')) {
      this.general = true;
    }
  }
}
