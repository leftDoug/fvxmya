import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-access-denied',
  imports: [CardModule],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.css',
})
export class AccessDeniedComponent {}
