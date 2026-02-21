import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '../../../../../core/components/base.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PresenteService } from '../../../../../core/services/presente/presente.service';
import { Presente } from '../../../../../core/models/presente.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpinnerService } from '../../../../../core/services/spinner.service';
import { ModalService } from '../../../../../core/services/modal.service';
import { DropZoneImageComponent } from '../../../../../core/components/drop-zone-image/drop-zone-image.component';
import { MatCardModule } from '@angular/material/card';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationService } from '../../../../../core/services/notification.service';
import { PixEventoService } from '../../../../../core/services/pix-evento.service';
import { FinalidadePix } from '../../../../../core/utils/enums/finalidade-pix.enum';
import { CreateContribuicaoPresenteDto } from '../../../../../core/models/contribuicao-presente.model';
import { TipoImagemEvento } from '../../../../../core/models/imagem.model';
import { Base64ImageUtil } from '../../../../../core/utils/base64-image.util';

@Component({
  selector: 'app-cadastrar-contribuicao-presente',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    NgxMaskDirective,
    DropZoneImageComponent
  ],
  providers: [provideNgxMask()],
  templateUrl: './cadastrar-contribuicao-presente.component.html',
  styleUrl: './cadastrar-contribuicao-presente.component.scss'
})
export class CadastrarContribuicaoPresenteComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  form: FormGroup;
  private readonly acRouter = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly presenteService = inject(PresenteService);
  private readonly pixEventoService = inject(PixEventoService);
  private readonly spinner = inject(SpinnerService);
  private readonly modalService = inject(ModalService);
  private readonly clipboard = inject(Clipboard);
  private readonly notification = inject(NotificationService);

  presente = signal<Presente | null>(null);
  eventoId: string = '0';
  presenteId: string = '0';
  pixCode = signal('');
  comprovante: string[] = [];
  mostrarComprovante = false;

  constructor() {
    super();

    this.validationMessages = {
      valor: {
        required: 'Informe o valor que deseja contribuir',
        min: 'O valor deve ser maior que zero'
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);

    this.form = this.fb.group({
      valor: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.eventoId = this.acRouter.snapshot.params['idEvento'] || '0';
    this.presenteId = this.acRouter.snapshot.params['id'] || '0';

    if (this.presenteId !== '0') {
      this.carregarPresente();
      this.carregarPixCode();
    }
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  carregarPixCode(): void {
    this.spinner.show();
    this.pixEventoService.buscarPixEventoFinalidade(Number(this.eventoId), FinalidadePix.Presentes)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso && response.data) {
            this.pixCode.set(response.data.qrCodePix);
          }
        },
        error: (err) => console.error('Erro ao carregar código PIX:', err),
        complete: () => this.spinner.hide()
      });
  }

  carregarPresente(): void {
    this.spinner.show();

    this.presenteService.obterPorId(Number(this.presenteId))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso) {
            this.presente.set(response.data);
          }
        },
        error: (err) => console.error('Erro ao carregar presente:', err),
        complete: () => this.spinner.hide()
      });
    this.spinner.hide();
  }

  copiarCodigoPix(): void {
    const copiado = this.clipboard.copy(this.pixCode());

    if (copiado) {
      this.notification.showSuccess('Código PIX copiado com sucesso!');
    } else {
      this.notification.showError('Erro ao copiar código PIX');
    }
  }

  anexarComprovante(): void {
    if (!this.form.valid) {
      this.validarFormulario(this.form);
      this.modalService.openErrorModal({
        title: 'Formulário Inválido',
        message: 'Por favor, informe o valor da contribuição antes de anexar o comprovante.'
      });
      return;
    }

    this.mostrarComprovante = true;
  }

  confirmarPagamento(): void {
    if (!this.form.valid) {
      this.validarFormulario(this.form);
      return;
    }

    if (this.comprovante.length === 0) {
      this.modalService.openErrorModal({
        title: 'Comprovante Necessário',
        message: 'Por favor, anexe o comprovante de pagamento para confirmar a contribuição.'
      });
      return;
    }

    this.spinner.show();

    const usuario = this.obterUsuarioLogado();

    const contribuicao: CreateContribuicaoPresenteDto = {
      idPresente: this.presenteId ? Number(this.presenteId) : 0,
      idParticipante: usuario ? Number(usuario.id) : 0,
      valor: this.form.value.valor,
      formaPagamento: 'Pix',
      comprovante: {
        nomeArquivo: `comprovante_${this.presenteId}_${Date.now()}.jpg`,
        base64: Base64ImageUtil.extractBase64(this.comprovante[0]),
        tipoImagem: TipoImagemEvento.Comprovante,
        tipoArquivo: 'image/jpeg'
      }
    };

    this.presenteService.contribuir(contribuicao).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        if (response.executouComSucesso) {

          this.modalService.openSuccessModal({
            title: 'Contribuição Confirmada!',
            message: 'Sua contribuição foi registrada com sucesso. Obrigado por participar!'
          }).subscribe(() => { this.router.navigate(['/presentes', this.eventoId]); });
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Erro ao confirmar pagamento:', err);
      }
    });
  }

  cancelar(): void {
    this.modalService.openConfirmationModal({
      title: 'Cancelar Contribuição',
      message: 'Tem certeza de que deseja cancelar? As informações inseridas serão perdidas.',
      cancelLabel: 'Não, continuar'
    }).subscribe((result) => {
      if (result) {
        this.router.navigate(['/presentes', this.eventoId]);
      }
    });
  }
}
