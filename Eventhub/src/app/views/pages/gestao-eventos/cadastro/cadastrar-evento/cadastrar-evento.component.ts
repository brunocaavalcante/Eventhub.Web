import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { CadastroOrganizadoresComponent } from '../../organizadores/cadastro-organizadores/cadastro-organizadores.component';
import { BaseComponent } from '../../../../../core/components/base.component';
import { Organizador } from '../../../../../core/models/organizador.model';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { Usuario } from '../../../../../core/models/usuario.model';
import { Evento } from '../../../../../core/models/evento.model';
import { SpinnerService } from '../../../../../core/services/spinner.service';
import { EventoService } from '../../../../../core/services/evento.service';
import { ModalSucessComponent } from '../../../../../core/components/modal/modal-sucess/modal-sucess.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    CadastroOrganizadoresComponent
  ],
  templateUrl: './cadastrar-evento.component.html',
  styleUrl: './cadastrar-evento.component.scss'
})
export class CadastrarEventoComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UsuarioService);
  private readonly service = inject(EventoService);
  private readonly spinner = inject(SpinnerService);
  private readonly router = inject(Router);

  usuarioLogado: Usuario | null = null;
  form!: FormGroup;
  imagens: string[] = [];
  organizadores: Organizador[] = [];
  etapa = 0;

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
      tipoData: {
        required: 'Selecione o tipo de data'
      },
      data: {
        required: 'Informe a data do evento'
      },
      start: {
        required: 'Informe a data de início do evento'
      },
      end: {
        required: 'Informe a data de término do evento'
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
        descricao: ['', [Validators.maxLength(500)]]
      }),
      step2: this.fb.group({
        tipoData: ['unica', Validators.required],
        data: [null, [Validators.required]],
        periodo: this.fb.group({
          start: [null],
          end: [null]
        }),
        cep: ['', []],
        rua: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        pontoReferencia: ['']
      }),
    });

    this.configuraValidacaoDatas();
    this.usuarioLogado = await this.userService.obterUsuarioLogado();
  }

  configuraValidacaoDatas() {
    const step2 = this.form.get('step2') as FormGroup;
    const tipoDataCtrl = step2.get('tipoData');
    const dataCtrl = step2.get('data');
    const start = step2.get('periodo.start');
    const end = step2.get('periodo.end');

    tipoDataCtrl?.valueChanges.subscribe((tipo: string) => {
      if (tipo === 'unica') {
        dataCtrl?.setValidators([Validators.required]);
        start?.setValue(null);
        start?.setValidators(null);
        end?.setValue(null);
        end?.setValidators(null);
      } else if (tipo === 'periodo') {
        dataCtrl?.setValidators(null);
        start?.setValidators([Validators.required]);
        end?.setValidators([Validators.required]);
        dataCtrl?.setValue(null);
      }

      dataCtrl?.updateValueAndValidity();
      start?.updateValueAndValidity();
      end?.updateValueAndValidity();
    });
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
    const evento: Evento = {
      nome: this.form.get('step1.nome')?.value,
      descricao: this.form.get('step1.descricao')?.value,
      tipoData: this.form.get('step2.tipoData')?.value,
      cep: this.form.get('step2.cep')?.value,
      rua: this.form.get('step2.rua')?.value,
      cidade: this.form.get('step2.cidade')?.value,
      numero: this.form.get('step2.numero')?.value,
      pontoReferencia: this.form.get('step2.pontoReferencia')?.value,
      // imagens: this.imagens,
      organizadores: this.organizadores,
      status: 'ativo',
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    if (this.usuarioLogado?.uid) {
      evento.IdUsuario = this.usuarioLogado.uid;
    }

    if (evento.tipoData === 'unica') {
      evento.dataInicio = this.form.get('step2.data')?.value;
      evento.dataFim = null;
    }
    else {
      evento.dataInicio = this.form.get('step2.periodo.start')?.value ?? null;
      evento.dataFim = this.form.get('step2.periodo.end')?.value ?? null;
    }
    this.service.cadastro(evento)
      .then(() => {
        this.spinner.hide();
        this.openSuccessModal().afterClosed().subscribe(() => {
          this.router.navigate(['/eventos/meus-eventos']);
        });
      })
      .catch((e) => {
        this.spinner.hide();
        console.error('Erro ao cadastrar evento:', e);
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

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
      input.value = '';
    }
  }

  handleFiles(files: FileList) {
    const arquivosNovos = Array.from(files).slice(0, 10 - this.imagens.length);
    arquivosNovos.forEach(file => {
      if (this.imagens.length < 10) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagens.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  removerImagem(index: number) {
    this.imagens.splice(index, 1);
  }

  changeOrganizadores(event: Organizador[]) {
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
}