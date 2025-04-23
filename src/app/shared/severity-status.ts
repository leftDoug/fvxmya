// export function getStatus(agreement: Agreement): Status {
//   const today: Date = new Date();
//   const date: Date = new Date(agreement.compilanceDate);

import { Agreement, Status } from '@app/agreements/interfaces';

//   if (!agreement.state) return Status.canceled;

//   if (agreement.completed) return Status.fulfilled;
//   else if (today.getTime() < date.getTime()) return Status.inProcess;
//   else return Status.unfulfilled;
// }

// export function getSeverity(
//   agreement: Agreement | null,
//   agreementStatus: Status | null
// ) {
//   let status: Status;

//   if (agreement) status = getStatus(agreement);
//   else status = agreementStatus!;

//   switch (status) {
//     case Status.canceled:
//       return 'secondary';
//     case Status.fulfilled:
//       return 'success';
//     case Status.inProcess:
//       return 'info';
//     case Status.unfulfilled:
//       return 'danger';
//   }
// }

export function getStatus(agreement: Agreement): Status {
  const date: Date = new Date(agreement.compilanceDate);
  const today: Date = new Date();

  if (agreement.completed) {
    return Status.FULFILLED;
  } else if (!agreement.state) {
    return Status.CANCELLED;
  } else if (today.getTime() < date.getTime()) {
    return Status.IN_PROCESS;
  } else {
    return Status.UNFULFILLED;
  }
}

export function getSeverity(status: Status) {
  switch (status) {
    case Status.CANCELLED:
      return 'secondary';
    case Status.FULFILLED:
      return 'success';
    case Status.IN_PROCESS:
      return 'info';
    case Status.UNFULFILLED:
      return 'danger';
    default:
      return 'warn';
  }
}

export function getSeverityFromAgreement(agreement: Agreement) {
  const status = getStatus(agreement);
  return getSeverity(status);
}
