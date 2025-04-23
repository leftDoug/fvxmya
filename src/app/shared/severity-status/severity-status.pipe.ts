import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'severityStatus'
})
export class SeverityStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
