import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { UserForRegistrationDto } from 'src/app/shared/interfaces/users/userForRegistrationDto';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';


@Component({
    templateUrl: './sign-up-3.component.html'
})

export class SignUp3Component {

    signUpForm: FormGroup;

    submitForm(): void {
        for (const i in this.signUpForm.controls) {
            this.signUpForm.controls[ i ].markAsDirty();
            this.signUpForm.controls[ i ].updateValueAndValidity();
        }

        const formValues = { ...this.signUpForm.value };
    
        const user: UserForRegistrationDto = {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          userName : formValues.userName,
          email: formValues.email,
          password: formValues.password,
          confirmPassword: formValues.confirmPassword
          
        };
    debugger;
        this.authService.registerUser(user)
        .subscribe({
          next: (_) => console.log("Successful registration"),
          error: (err: HttpErrorResponse) => console.log(err.error.errors)
        })
    }

    updateConfirmValidator(): void {
        Promise.resolve().then(() => this.signUpForm.controls.checkPassword.updateValueAndValidity());
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.signUpForm.controls.password.value) {
            return { confirm: true, error: true };
        }
    }

    constructor(private fb: FormBuilder ,private authService: AuthenticationService) {
    }

    ngOnInit(): void {
        this.signUpForm = this.fb.group({
            firstName        : [ null, [ Validators.required ] ],
            lastName         : [ null, [ Validators.required ] ],
            userName         : [ null, [ Validators.required ] ],
            email            : [ null, [ Validators.required ] ],
            password         : [ null, [ Validators.required ] ],
            confirmPassword  : [ null, [ Validators.required, this.confirmationValidator ] ],
            agree            : [ false ]
        });
    }

    // public registerUser = (registerFormValue) => {
    //     const formValues = { ...this.signUpForm.value };
    
    //     const user: UserForRegistrationDto = {
    //       firstName: formValues.firstName,
    //       lastName: formValues.lastName,
    //       email: formValues.email,
    //       password: formValues.password,
    //       confirmPassword: formValues.confirm
    //     };
    
    //     this.authService.registerUser(user)
    //     .subscribe({
    //       next: (_) => console.log("Successful registration"),
    //       error: (err: HttpErrorResponse) => console.log(err.error.errors)
    //     })
    //   }
}    