import { Component, inject, OnInit, AfterViewInit, ViewChildren, ElementRef, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControlName } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { CreatePixEventoDto } from '../../../../core/models/pix-evento.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PixEventoService } from '../../../../core/services/pix-evento.service';
import { ModalService } from '../../../../core/services/modal.service';
import { FinalidadePix } from '../../../../core/utils/enums/finalidade-pix.enum';

export interface CadastrarPixDto {
  codigoPix: string;
  nomeBeneficiario: string;
}

@Component({
  selector: 'app-cadastrar-qrcode',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cadastrar-qrcode.component.html',
  styleUrl: './cadastrar-qrcode.component.scss'
})
export class CadastrarQrcodeComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  form: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly acRoute = inject(ActivatedRoute);
  private readonly spinner = inject(SpinnerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pixEventoService = inject(PixEventoService);
  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);

  idEvento: number = 0;
  finalidadePix: number = 1;

  cadastrarPix = signal(false);

  constructor() {
    super();

    this.validationMessages = {
      codigoPix: {
        required: 'Informe o código PIX',
        minlength: 'O código PIX deve ter pelo menos 50 caracteres',
        pattern: 'Código PIX inválido. Deve começar com "00020126"'
      },
      nomeBeneficiario: {
        required: 'Informe o Nome do Beneficiário',
        minlength: 'O Nome deve ter pelo menos 3 caracteres'
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);

    this.form = this.fb.group({
      codigoPix: ['', [
        Validators.required,
        Validators.minLength(50),
        Validators.pattern(/^00020126.*/)
      ]],
      nomeBeneficiario: ['', [
        Validators.required,
        Validators.minLength(3)
      ]]
    });
  }

  ngOnInit(): void {
    this.idEvento = Number(this.acRoute.snapshot.paramMap.get('idEvento') || '0');
    this.finalidadePix = Number(this.acRoute.snapshot.paramMap.get('finalidade') || '0');
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.spinner.show();

    const pixData: CreatePixEventoDto = {
      idEvento: this.idEvento,
      finalidade: this.finalidadePix,
      qrCodePix: this.form.get('codigoPix')?.value.trim(),
      nomeBeneficiario: this.form.get('nomeBeneficiario')?.value.trim()
    };

    this.pixEventoService.cadastro(pixData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso) {
            this.modalService.openSuccessModal({
              title: 'QR Code Cadastrado!',
              message: 'Seu QR Code PIX foi cadastrado com sucesso e já está disponível para receber contribuições.'
            })
              .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                if(this.finalidadePix == FinalidadePix.Presentes) {
                  this.router.navigate(['/presentes', this.idEvento]);
                }

                if(this.finalidadePix == FinalidadePix.Ingressos) {
                  //TODO: Navegar para a página de ingressos
                }
              });
          }
        },
        error: (err) => {
          console.error('Erro ao cadastrar PIX:', err);
        }
      });
  }

  cancelar(): void {
    this.modalService.openConfirmationModal({
      title: 'Cancelar Cadastro',
      message: 'Tem certeza que deseja cancelar o cadastro do QR Code PIX? As informações preenchidas serão perdidas.',
      confirmLabel: 'Sim, cancelar',
      cancelLabel: 'Continuar cadastrando'
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: any) => {
        if (confirmed) {
          this.router.navigate(['/presentes', this.idEvento]);
        }
      });
  }
}
