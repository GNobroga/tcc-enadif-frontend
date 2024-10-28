import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export default abstract class CustomValidators {

    static passwordMatcher(controlToCompare: FormControl): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = controlToCompare.value;
            const confirmationPassword = control.value;
            return password === confirmationPassword ? null : { mismatch: true };
          }; 
    }
}


