import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { BaseComponent } from '../../../../core/components/base.component';
import { DropZoneImageComponent } from '../../../../core/components/drop-zone-image/drop-zone-image.component';
import { Imagem, TipoImagemEvento } from '../../../../core/models/imagem.model';
import { CategoriaPresenteDto,  UpdatePresenteDto } from '../../../../core/models/presente.model';
import { ModalService } from '../../../../core/services/modal.service';
import { PresenteService } from '../../../../core/services/presente.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { Base64ImageUtil } from '../../../../core/utils/base64-image.util';

@Component({
  selector: 'app-editar-presentes',
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
    RouterLink
  ],
  templateUrl: './editar-presentes.component.html',
  styleUrl: './editar-presentes.component.scss'
})
export class EditarPresentesComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  form: FormGroup;
  private readonly router = inject(Router);
  private readonly acRouter = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly presenteService = inject(PresenteService);
  private readonly spinner = inject(SpinnerService);
  private readonly modalService = inject(ModalService);
  imagens: Imagem[] = [];
  categorias = signal<CategoriaPresenteDto[]>([]);
  eventoId: number = Number(this.acRouter.snapshot.paramMap.get('idEvento') || '0');
  presenteId: number = Number(this.acRouter.snapshot.paramMap.get('id') || '0');

  get imagensVisualizacao(): string[] {
    return this.imagens.map(img => Base64ImageUtil.resolveImageSource(img.base64));
  }

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

  ngOnInit(): void {
    this.obterCategoriasPresente();
    this.obterPresentePorId();
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  obterPresentePorId() {
    this.spinner.show();
    this.presenteService.obterPorId(this.presenteId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (retorno) => {
        this.spinner.hide();
        console.log(retorno);
        if (retorno.executouComSucesso && retorno.data) {
          this.form.patchValue({
            nome: retorno.data.nome,
            descricao: retorno.data.descricao,
            categoria: retorno.data.categoria?.id,
            valor: retorno.data.valor
          });
          this.imagens = retorno.data.imagens || [];
        }
      },
      error: (erro) => {
        this.spinner.hide();
        console.error(erro);
      }
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
    if (this.form.invalid || !this.presenteId || this.presenteId === 0) return;

    this.spinner.show();

    const presente: UpdatePresenteDto = {
      id: Number(this.presenteId),
      nome: this.form.value.nome,
      descricao: this.form.value.descricao,
      valor: this.form.value.valor,
      idCategoriaPresente: this.form.value.categoria,
      imagens: this.imagens
    };

    this.presenteService.atualizar(presente).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (retorno) => {
        this.spinner.hide();
        if (retorno.executouComSucesso) {
          this.modalService.openSuccessModal({
            title: 'Presente Atualizado',
            message: 'O presente foi atualizado com sucesso!'
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
      title: 'Cancelar Edição',
      message: 'Tem certeza que deseja cancelar a edição do presente? As informações não salvas serão perdidas.',
      confirmLabel: 'Sim',
      cancelLabel: 'Não'
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(confirmed => {
      if (confirmed) {
        this.router.navigate(['/presentes', this.eventoId]);
      }
    });
  }

  onImagensChange(imagensString: string[]) {
    this.imagens = imagensString.map((imgStr, idx) => {
      const imagemExistente = this.imagens.find(
        img => Base64ImageUtil.resolveImageSource(img.base64) === imgStr
      );
      
      if (imagemExistente) {
        return imagemExistente;
      }
      
      return {
        nomeArquivo: `imagem_${idx + 1}.jpg`,
        base64: Base64ImageUtil.extractBase64(imgStr),
        tipoImagem: TipoImagemEvento.Local
      };
    });
  }
}
