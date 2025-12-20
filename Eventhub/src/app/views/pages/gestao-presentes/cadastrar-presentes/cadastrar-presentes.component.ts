import { AfterViewInit, Component, DestroyRef, ElementRef, inject, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '../../../../core/components/base.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { DropZoneImageComponent } from "../../../../core/components/drop-zone-image/drop-zone-image.component";
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-cadastrar-presentes',
  imports: [
    CommonModule,
    MatFormField,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatTooltip,
    MatIconModule,
    DropZoneImageComponent,
    NgxMaskDirective,
    MatSelectModule
  ],
  providers: [provideNgxMask()],
  templateUrl: './cadastrar-presentes.component.html',
  styleUrl: './cadastrar-presentes.component.scss'
})
export class CadastrarPresentesComponent extends BaseComponent implements AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  form: FormGroup;
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  imagens: string[] = [];

  constructor() {
    super();

    this.validationMessages = {
      nome: {
        required: 'Informe o Nome do Presente',
        minlength: 'O Nome deve ter pelo menos 3 caracteres',
        maxlength: 'O Nome deve ter no máximo 100 caracteres'
      },
      descricao: {
        maxlength: 'A Descrição deve ter no máximo 500 caracteres'
      },
      categoria: {
        required: 'Selecione uma Categoria'
      },
      valor: {
        required: 'Informe o Valor do Presente',
        min: 'O Valor deve ser maior que zero'
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);

    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(500)]],
      categoria: ['', [Validators.required]],
      valor: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  onSubmit() { }

  cancelar() {
    this.router.navigate(['/gestao-presentes']);
  }

  onImagensChange(imagens: string[]) {
    this.imagens = imagens;
  }
}
