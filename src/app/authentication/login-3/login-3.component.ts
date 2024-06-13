import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core'
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { UserForAuthenticationDto } from 'src/app/shared/interfaces/users/userForAuthenticationDto';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router'; // Import the Router
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
    templateUrl: './login-3.component.html'
})

export class Login3Component {
    loginForm: FormGroup;



    submitForm(): void {
        // Mark form controls as dirty and trigger validation
        for (const controlName in this.loginForm.controls) {
            if (this.loginForm.controls.hasOwnProperty(controlName)) {
                const control = this.loginForm.controls[controlName];
                control.markAsDirty();
                control.updateValueAndValidity();
            }
        }
    
        // Extract form values
        const formValues = { ...this.loginForm.value };
    
        // Prepare credentials for authentication
        const credential: UserForAuthenticationDto = {
            userName: formValues.userName,
            password: formValues.password,
        };
    
        // Authenticate user
        this.authService.login(credential).subscribe({
            next: (_) => {
                this.router.navigate(['/dashboard']); // Navigate to the dashboard immediately
                this.notification.success('Login Successful', 'Welcome to the dashboard!', { nzPlacement: 'bottomRight' });
            },
            error: (err: HttpErrorResponse) => {
                // Failed login
                console.error('Login error:', err);
                this.notification.error('Login Failed', 'Invalid username or password');
            }
        });
    }
    
    constructor(private fb: FormBuilder ,
         private authService: AuthenticationService,
          private router: Router ,
          private notification: NzNotificationService) {
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            userName: [ null, [ Validators.required ] ],
            password: [ null, [ Validators.required ] ]
        });
    }
}    