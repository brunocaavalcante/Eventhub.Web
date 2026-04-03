import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function telefoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        // Se vazio, aceita (campo opcional)
        if (!value || value.trim() === '') {
            return null;
        }

        // Remove qualquer formatação e valida apenas os números
        const numerosSomente = value.replace(/\D/g, '');

        // Deve ter 10 dígitos (fixo) ou 11 dígitos (celular)
        const telefoneRegex = /^(\d{10}|\d{11})$/;

        return telefoneRegex.test(numerosSomente) ? null : { telefoneInvalido: true };
    };
}