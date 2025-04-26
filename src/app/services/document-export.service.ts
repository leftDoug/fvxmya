import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Docxtemplater from 'docxtemplater';
import saveAs from 'file-saver';
import PizZip from 'pizzip';
import { NotificatorService } from './notificator.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentExportService {
  private readonly http = inject(HttpClient);
  private readonly notificatorService = inject(NotificatorService);

  constructor() {}

  async generateDocument(data: any): Promise<void> {
    this.http
      .get('assets/templates/plantilla_acta.docx', {
        responseType: 'arraybuffer',
      })
      .subscribe((templateFile: ArrayBuffer) => {
        // this.documentExportService.generateDocument(templateFile, data);
        const zip = new PizZip(templateFile);
        const doc = new Docxtemplater(zip);

        try {
          doc.render(data);

          const content = doc.getZip().generate({
            type: 'blob',
            mimeType:
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });
          saveAs(content, 'documento_acta.docx');
        } catch (error) {
          console.error('Error al generar el documento:', error);
          this.notificatorService.notificate({
            severity: 'error',
            summary: 'ERROR',
            detail: 'Error al generar el documento de acta',
          });
        }
      });
  }
}
