import { AfterViewInit, Component, DestroyRef, ElementRef, HostListener, inject, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { CadastroOrganizadoresComponent } from '../../organizadores/cadastro-organizadores/cadastro-organizadores.component';
import { BaseComponent } from '../../../../../core/components/base.component';
import { Participante } from '../../../../../core/models/organizador.model';
import { UsuarioInfoDTO } from '../../../../../core/models/usuario.model';
import { CadastroEventoDto } from '../../../../../core/models/evento.model';

import { SpinnerService } from '../../../../../core/services/spinner.service';
import { EventoService } from '../../../../../core/services/evento.service';
import { ModalSucessComponent } from '../../../../../core/components/modal/modal-sucess/modal-sucess.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalConfirmComponent } from '../../../../../core/components/modal/modal-confirm/modal-confirm.component';
import { Observable } from 'rxjs';
import { TipoImagemEvento } from '../../../../../core/models/imagem.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Base64ImageUtil } from '../../../../../core/utils/base64-image.util';
import { DateUtils } from '../../../../../core/utils/date.utils';
import { DropZoneImageComponent } from "../../../../../core/components/drop-zone-image/drop-zone-image.component";

@Component({
  selector: 'app-cadastrar-evento',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    CadastroOrganizadoresComponent,
    DropZoneImageComponent
],
  templateUrl: './cadastrar-evento.component.html',
  styleUrl: './cadastrar-evento.component.scss'
})
export class CadastrarEventoComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(EventoService);
  private readonly spinner = inject(SpinnerService);
  private readonly router = inject(Router);
  private readonly acRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  usuarioLogado: UsuarioInfoDTO | null = null;
  form!: FormGroup;
  imagens: string[] = [];
  organizadores: Participante[] = [];
  etapa = 0;
  private salvou = false;

  constructor() {
    super();
    this.validationMessages = {
      nome: {
        required: 'Informe o Nome do Evento',
        minlength: 'O Nome deve ter pelo menos 3 caracteres'
      },
      descricao: {
        maxlength: 'A Descrição pode ter no máximo 500 caracteres'
      },
      quantidadeParticipantes: {
        required: 'Informe a quantidade de participantes',
        min: 'O valor mínimo é 1',
        max: 'O valor máximo é 9999',
        pattern: 'Informe um valor numérico válido'
      },
      dataInicio: {
        required: 'Informe a data de início do evento'
      },
      horaInicio: {
        required: 'Informe o horário de início do evento'
      },
      dataFim: {
        required: 'Informe a data de término do evento'
      },
      horaFim: {
        required: 'Informe o horário de término do evento'
      },
      cep: {
        pattern: 'CEP inválido'
      },
      rua: {
        required: 'Informe a rua'
      },
      numero: {
        required: 'Informe o número'
      },
      cidade: {
        required: 'Informe a cidade'
      }
    };
    this.configurarMensagensValidacaoBase(this.validationMessages);
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
    this.spinner.hide();
  }

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    this.form = this.fb.group({
      step1: this.fb.group({
        nome: ['', [Validators.required, Validators.minLength(3)]],
        descricao: ['', [Validators.maxLength(500)]],
        quantidadeParticipantes: [null, [Validators.required, Validators.min(1), Validators.max(9999), Validators.pattern('^[0-9]+$')]]
      }),
      step2: this.fb.group({
        dataInicio: [null, [Validators.required]],
        horaInicio: ['', [Validators.required]],
        dataFim: [null, [Validators.required]],
        horaFim: ['', [Validators.required]],
        cep: ['', []],
        rua: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        pontoReferencia: ['']
      }),
    });

    this.usuarioLogado = await this.userService.obterUsuarioLogado();
  }

  proximo() {
    if (this.etapa === 0 && this.form.get('step1')?.valid) {
      this.etapa++;
    }
    else if (this.etapa === 1 && this.form.get('step2')?.valid) {
      this.etapa++;
    }
    else if (this.etapa === 2 && this.form.valid) {
      this.salvarEvento();
    } else {
      this.form.markAllAsTouched();
    }
  }

  salvarEvento() {
    this.spinner.show();

    const dataInicio = DateUtils.combineDateAndTime(
      this.form.get('step2.dataInicio')?.value,
      this.form.get('step2.horaInicio')?.value
    );
    const dataFim = DateUtils.combineDateAndTime(
      this.form.get('step2.dataFim')?.value,
      this.form.get('step2.horaFim')?.value
    );

    const dto: CadastroEventoDto = {
      nome: this.form.get('step1.nome')?.value,
      descricao: this.form.get('step1.descricao')?.value,
      idTipoEvento: Number(this.acRoute.snapshot.params['tipo'] || 8),
      idUsuarioCriador: this.usuarioLogado?.id ?? 0,
      maxConvidado: Number(this.form.get('step1.quantidadeParticipantes')?.value),
      dataInicio: dataInicio!,
      dataFim: dataFim,

      endereco: {
        logradouro: this.form.get('step2.rua')?.value,
        numero: this.form.get('step2.numero')?.value,
        cidade: this.form.get('step2.cidade')?.value,
        cep: this.form.get('step2.cep')?.value,
        pontoReferencia: this.form.get('step2.pontoReferencia')?.value
      },

      imagens: this.imagens.map((img, idx) => ({
        nomeArquivo: `imagem_${idx + 1}.jpg`,
        base64: Base64ImageUtil.extractBase64(img),
        tipoImagem: TipoImagemEvento.Local
      })),

      participantes: this.organizadores.map(org => ({
        tipo: org.tipo,
        nome: org.nome,
        email: org.email,
        telefone: org.telefone,
        idPerfil: org.idPerfil ?? 0
      }))
    };

    this.service.cadastro(dto).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.salvou = true;
        this.spinner.hide();
        this.openSuccessModal().afterClosed().subscribe(() => {
          this.router.navigate(['/eventos/meus-eventos']);
        });
      },
      error: (e) => {
        this.spinner.hide();
        console.error('Erro ao cadastrar evento:', e);
      }
    });
  }

  habilitarBotaoProximo(): boolean {
    const step1Valido = this.form.get('step1')?.valid;
    const step2Valido = this.form.get('step2')?.valid;
    return (this.etapa === 0 && step1Valido) || (this.etapa === 1 && step2Valido) ||
      (this.etapa === 2 && this.form.valid && this.organizadores.length > 0);
  }

  voltar() {
    if (this.etapa > 0) this.etapa--;
  }

  async buscarCep() {
    const cep = this.form.get('step2.cep')?.value?.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          this.form.get('step2')?.patchValue({
            rua: data.logradouro || '',
            cidade: data.localidade || ''
          });
        } else {
          this.form.get('step2')?.patchValue({ rua: '', cidade: '' });
        }
      } catch {
        this.form.get('step2')?.patchValue({ rua: '', cidade: '' });
      }
    }
  }

  changeOrganizadores(event: Participante[]) {
    this.organizadores = event;
  }

  private openSuccessModal(): MatDialogRef<ModalSucessComponent> {
    return this.dialog.open(ModalSucessComponent, {
      data: {
        title: 'Evento criado',
        message: 'Seu evento foi cadastrado com sucesso!',
        okLabel: 'Fechar'
      }
    });
  }

  // Protege contra saída acidental com alterações não salvas
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  // Usado pelo guard de navegação entre rotas
  canDeactivate(): boolean | Observable<boolean> {
    if (!this.hasUnsavedChanges()) return true;
    return this.dialog.open(ModalConfirmComponent, {
      data: {
        title: 'Sair sem salvar?',
        message: 'Você tem alterações não salvas. Deseja realmente sair e perder as mudanças?',
        cancelLabel: 'Continuar editando',
        confirmLabel: 'Sair'
      }
    }).afterClosed();
  }

  private hasUnsavedChanges(): boolean {
    const formDirty = this.form?.dirty;
    const hasOtherChanges = (this.imagens?.length ?? 0) > 0 || (this.organizadores?.length ?? 0) > 0;
    return !this.salvou && (!!formDirty || hasOtherChanges);
  }
}