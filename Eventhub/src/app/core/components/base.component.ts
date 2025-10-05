import { ElementRef, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable, fromEvent, merge } from "rxjs";
import { DisplayMessage, ValidadorGenerico, ValidationMessages } from "../utils/validations/generic-form.validator";
import { MatDialog } from "@angular/material/dialog";

export abstract class BaseComponent {

    displayMessage: DisplayMessage = {};
    genericValidator!: ValidadorGenerico;
    validationMessages!: ValidationMessages;
    protected dialog = inject(MatDialog);

    protected configurarMensagensValidacaoBase(validationMessages: ValidationMessages) {
        this.genericValidator = new ValidadorGenerico(validationMessages);
    }

    protected configurarValidacaoFormularioBase(
        formInputElements: ElementRef[],
        formGroup: FormGroup) {

        let controlBlurs: Observable<any>[] = formInputElements
            .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

        merge(...controlBlurs).subscribe(() => { //No evento blur em um formcontrol vamos validar o formgroup
            this.validarFormulario(formGroup)
        });

        let controlChanges: Observable<any>[] = formInputElements
            .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'change'));

        merge(...controlChanges).subscribe(() => { //No evento change em um formcontrol vamos validar o formgroup
            this.validarFormulario(formGroup)
        });
    }

    protected validarFormulario(formGroup: FormGroup) {
        this.displayMessage = this.genericValidator.processarMensagens(formGroup);
    }
}