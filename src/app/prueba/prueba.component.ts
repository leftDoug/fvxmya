import { Component } from '@angular/core';
import { PickListModule } from 'primeng/picklist';

@Component({
  selector: 'app-prueba',
  imports: [PickListModule],
  templateUrl: './prueba.component.html',
  styleUrl: './prueba.component.css',
})
export class PruebaComponent {
  sourceWorkers: string[] = ['asd', 'qwe', 'zxc'];
  selectedWorkers: string[] = [];
}
