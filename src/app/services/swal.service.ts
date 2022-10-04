import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  get isOpen(): boolean {
    return Swal.isVisible();
  }

  alert(
    title: string,
    html: string | HTMLElement,
    icon: SweetAlertIcon = 'error'
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      html,
      icon,
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      heightAuto: false,
      scrollbarPadding: false,
      returnInputValueOnDeny: true,
    });
  }

  confirm(
    title: string,
    html: string | HTMLElement,
    icon: SweetAlertIcon = 'warning'
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      html,
      icon,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      heightAuto: false,
      scrollbarPadding: false,
      returnInputValueOnDeny: true,
    });
  }
}
