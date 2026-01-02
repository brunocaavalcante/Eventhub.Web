import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '../../../../core/components/base.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { DropZoneImageComponent } from "../../../../core/components/drop-zone-image/drop-zone-image.component";
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PresenteService } from '../../../../core/services/presente.service';
import { CategoriaPresenteDto, CreatePresenteDto } from '../../../../core/models/presente.model';
import { TipoImagemEvento } from '../../../../core/models/imagem.model';
import { Base64ImageUtil } from '../../../../core/utils/base64-image.util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { ModalService } from '../../../../core/services/modal.service';

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
    MatSelectModule,
    MatSlideToggleModule,
    RouterLink
],
  providers: [provideNgxMask()],
  templateUrl: './cadastrar-presentes.component.html',
  styleUrl: './cadastrar-presentes.component.scss'
})
export class CadastrarPresentesComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  form: FormGroup;
  private readonly router = inject(Router);
  private readonly acRouter = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly presenteService = inject(PresenteService);
  private readonly spinner = inject(SpinnerService);
  private readonly modalService = inject(ModalService);
  imagens: string[] = [];
  categorias = signal<CategoriaPresenteDto[]>([]);
  eventoId: string = '0';

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
      },
      linkCompra: {
        required: 'Informe o Link de Compra',
        pattern: 'Informe uma URL válida (ex: https://www.exemplo.com)'
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);

    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(500)]],
      categoria: ['', [Validators.required]],
      valor: ['', [Validators.required, Validators.min(0)]],
      incluirLink: [false],
      linkCompra: ['', []]
    });
  }

  ngOnInit(): void {
    this.eventoId = this.acRouter.snapshot.paramMap.get('idEvento') || '0';
    this.obterCategoriasPresente();
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
    this.configurarValidacaoLinkCompra();
  }

  configurarValidacaoLinkCompra(): void {
    this.form.get('incluirLink')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((incluirLink) => {
      const linkCompraControl = this.form.get('linkCompra');
      if (incluirLink) {
        linkCompraControl?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/)]);
      } else {
        linkCompraControl?.clearValidators();
        linkCompraControl?.setValue('');
      }
      linkCompraControl?.updateValueAndValidity();
    });
  }

  obterCategoriasPresente() {
    this.spinner.show();
    this.presenteService.obterCategoriasPresentes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (retorno) => {
        this.spinner.hide();
        if (retorno.executouComSucesso) {
          this.categorias.set(retorno.data);
        }
      },
      error: (erro) => {
        this.spinner.hide();
        console.error(erro);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.eventoId || this.eventoId === '0') return;

    this.spinner.show();

    const presente: CreatePresenteDto = {
      nome: this.form.value.nome,
      descricao: this.form.value.descricao,
      valor: this.form.value.valor,
      idCategoria: this.form.value.categoria,
      idEvento: Number(this.eventoId),
      linkProduto: this.form.value.incluirLink ? this.form.value.linkCompra : undefined,
      imagens: this.imagens.map((img, idx) => ({
        nomeArquivo: `imagem_${idx + 1}.jpg`,
        base64: Base64ImageUtil.extractBase64(img),
        tipoImagem: TipoImagemEvento.Local
      }))
    };

    this.presenteService.cadastro(presente).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (retorno) => {
        this.spinner.hide();
        if (retorno.executouComSucesso) {
          this.modalService.openSuccessModal({
            title: 'Presente Cadastrado',
            message: 'O presente foi cadastrado com sucesso!'
          })
            .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
              this.router.navigate(['/presentes', this.eventoId]);
            });
        }
      },
      error: (erro) => {
        this.spinner.hide();
        console.error(erro);
      }
    });
  }

  cancelar() {
    this.modalService.openConfirmationModal({
      title: 'Cancelar Cadastro',
      message: 'Tem certeza que deseja cancelar o cadastro do presente? As informações não salvas serão perdidas.',
      confirmLabel: 'Sim',
      cancelLabel: 'Não'
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(confirmed => {
      if (confirmed) {
        this.router.navigate(['/presentes',this.eventoId]);
      }
    });
  }

  onImagensChange(imagens: string[]) {
    this.imagens = imagens;
  }
}
