import { Component, inject, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControlName } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '../../../../../core/components/base.component';
import { ContribuicaoDetalhesDto } from '../../../../../core/models/presente.model';
import { CurrencyBrPipe } from '../../../../../core/utils/pipes/currency-br.pipe';

export interface CancelarContribuicaoData {
  contribuicao: ContribuicaoDetalhesDto;
}

export interface CancelarContribuicaoResult {
  confirmado: boolean;
  justificativa?: string;
}

@Component({
  selector: 'app-cancelar-contribuicao-presente',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CurrencyBrPipe
  ],
  templateUrl: './cancelar-contribuicao-presente.component.html',
  styleUrl: './cancelar-contribuicao-presente.component.scss'
})
export class CancelarContribuicaoPresenteComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  
  readonly dialogRef = inject(MatDialogRef<CancelarContribuicaoPresenteComponent>);
  readonly data = inject<CancelarContribuicaoData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  form!: FormGroup;

  constructor() {
    super();

    this.validationMessages = {
      justificativa: {
        required: 'A justificativa é obrigatória',
        minlength: 'A justificativa deve ter pelo menos 10 caracteres'
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      justificativa: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  cancelar(): void {
    this.dialogRef.close({ confirmado: false });
  }

  confirmar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const result: CancelarContribuicaoResult = {
      confirmado: true,
      justificativa: this.form.get('justificativa')?.value
    };

    this.dialogRef.close(result);
  }

  get contribuicao(): ContribuicaoDetalhesDto {
    return this.data.contribuicao;
  }
}
