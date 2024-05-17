import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _userService: UserService,
    private router: Router,
    private _errorService: ErrorService
  ) {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  addUser() {
    if (this.signUpForm.invalid) {
      this.toastr.error(
        'Por favor, complete todos los campos correctamente',
        'Error'
      );
      return;
    }

    const password = this.signUpForm.get('password')?.value;
    const confirmPassword = this.signUpForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden', 'Error');
      return;
    }

    const email = this.signUpForm.get('email')?.value;

    const user: User = {
      email,
      password,
    };

    this._userService.signIn(user).subscribe({
      next: (v) => {
        this.toastr.success(
          'Usuario registrado con exito',
          'Usuario registrado'
        );
        this.router.navigate(['/login']);
      },
      error: (event: HttpErrorResponse) => {
        this._errorService.msjError(event);
      },
      complete: () => console.info('complete'),
    });
  }
}
