import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  timeLimits(control: FormControl): ValidationErrors | null {
    const time: Date = new Date(control.value);
    const beginning: Date = new Date(time);

    beginning.setHours(7);
    beginning.setMinutes(0);

    if (time.getTime() < beginning.getTime()) {
      return { tooEarlyError: true };
    }

    return null;
  }

  compareBeginningAndEnd(b: string, e: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const beginning: Date = new Date(formGroup.get(b)?.value);
      const end: Date = new Date(formGroup.get(e)?.value);

      if (beginning.getTime() > end.getTime()) {
        if (!formGroup.get(e)?.errors) {
          formGroup.get(e)?.setErrors({ endBeginningError: true });
        }

        return {
          endBeginningError: true,
        };
      } else {
        formGroup.get(e)?.setErrors(this.timeLimits(formGroup.get(e)?.value));
      }

      return null;
    };
  }

  compareMeetingAndCompilance(m: string, c: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const meeting: Date = new Date(formGroup.get(m)?.value);
      const compilance: Date = new Date(formGroup.get(c)?.value);

      if (meeting.getTime() > compilance.getTime()) {
        if (!formGroup.get(c)?.errors) {
          formGroup.get(c)?.setErrors({ meetingCompilanceError: true });
        }

        return {
          meetingCompilanceError: true,
        };
      } else {
        formGroup
          .get(c)
          ?.setErrors(!formGroup.get(c)?.value ? { required: true } : null);
      }

      return null;
    };
  }

  meetingDate(control: FormControl): ValidationErrors | null {
    const meetingDate: Date = new Date(control.value);
    const today: Date = new Date();

    if (today.getTime() < meetingDate.getTime()) {
      return { meetingDateError: true };
    }

    return null;
  }

  differentPasswords(pass: string, check: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password: string = formGroup.get(pass)?.value;
      const checkPassword: string = formGroup.get(check)?.value;

      if (password !== checkPassword) {
        formGroup.get(check)?.setErrors({ differentPasswords: true });

        return {
          meetingCompilanceError: true,
        };
      }

      return null;
    };
  }
}
