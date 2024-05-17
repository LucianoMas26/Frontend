import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private toastr: ToastrService) {}
  msjError(e: HttpErrorResponse) {
    if (e.error.error) {
      this.toastr.error(e.error.error, 'Error');
    } else {
      this.toastr.error('Upps ocurrio un error', 'Error');
    }
  }
}
