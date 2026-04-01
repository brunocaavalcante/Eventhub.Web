import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BaseComponent } from '../../../../core/components/base.component';
import { ProgramacaoEventoService } from '../../../../core/services/programacao-evento.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ProgramacaoEventoUpdateDto, ProgramacaoEventoResponseDto } from '../../../../core/models/programacao-evento.model';
import { finalize } from 'rxjs';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-editar-programacao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './editar-programacao.component.html',
  styleUrl: './editar-programacao.component.scss'
})
export class EditarProgramacaoComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  form: FormGroup;
  private readonly acRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly programacaoService = inject(ProgramacaoEventoService);
  private readonly spinner = inject(SpinnerService);
  private readonly modalService = inject(ModalService);
  private readonly notificationService = inject(NotificationService);

  eventoId = 0;
  programacaoId = 0;
  programacao?: ProgramacaoEventoResponseDto;

  constructor() {
    super();

    this.validationMessages = {
      titulo: {
        required: 'Informe o Título da programação',
        minlength: 'O Título deve ter pelo menos 3 caracteres',
        maxlength: 'O Título deve ter no máximo 200 caracteres'
      },
      descricao: {
        maxlength: 'A Descrição deve ter no máximo 1000 caracteres'
      },
      data: {
        required: 'Informe a Data e Hora'
      },
      duracao: {
        pattern: 'Formato inválido. Use HH:MM (ex: 02:30)'
      },
      local: {
        required: 'Informe o Local',
        maxlength: 'O Local deve ter no máximo 200 caracteres'
      },
      responsavel: {
        required: 'Informe o Responsável',
        maxlength: 'O Responsável deve ter no máximo 200 caracteres'
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);

    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      descricao: ['', [Validators.maxLength(1000)]],
      data: ['', [Validators.required]],
      hora: ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      duracao: ['01:00', [Validators.pattern(/^([0-9]{1,2}):([0-5][0-9])$/)]],
      local: ['', [Validators.required, Validators.maxLength(200)]],
      responsavel: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.eventoId = Number(this.acRoute.snapshot.paramMap.get('idEvento'));
    this.programacaoId = Number(this.acRoute.snapshot.paramMap.get('id'));
    this.carregarProgramacao();
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  carregarProgramacao(): void {
    this.spinner.show();
    this.programacaoService.buscarPorId(this.programacaoId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.programacao = response.data;
            this.preencherFormulario(this.programacao);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar programação:', error);
          this.notificationService.showError('Erro ao carregar programação');
          this.cancelar();
        }
      });
  }

  preencherFormulario(programacao: ProgramacaoEventoResponseDto): void {
    const dataHora = new Date(programacao.data);
    const hora = this.formatarHora(dataHora);
    const duracao = this.extrairDuracao(programacao.duracao);

    this.form.patchValue({
      titulo: programacao.titulo,
      descricao: programacao.descricao,
      data: dataHora,
      hora: hora,
      duracao: duracao,
      local: programacao.local,
      responsavel: programacao.responsavel
    });
  }

  private formatarHora(data: Date): string {
    const hours = data.getHours().toString().padStart(2, '0');
    const minutes = data.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private extrairDuracao(duracao: string): string {
    // Extrai "HH:MM" de "HH:MM:SS"
    const parts = duracao.split(':');
    return `${parts[0]}:${parts[1]}`;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.eventoId || !this.programacaoId) {
      this.exibirErrosFormulario();
      return;
    }

    const dataHora = this.combinarDataHora(this.form.value.data, this.form.value.hora);
    const duracaoFormatada = this.formatarDuracaoCompleta(this.form.value.duracao);

    const dto: ProgramacaoEventoUpdateDto = {
      id: this.programacaoId,
      titulo: this.form.value.titulo,
      descricao: this.form.value.descricao,
      data: dataHora.toISOString(),
      duracao: duracaoFormatada,
      local: this.form.value.local,
      responsavel: this.form.value.responsavel,
      idStatus: this.programacao?.idStatus || 1
    };

    this.spinner.show();
    this.programacaoService.atualizar(this.programacaoId, dto)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: () => {
          this.modalService.openSuccessModal({
            title: 'Programação Atualizada',
            message: 'A programação foi atualizada com sucesso!'}).subscribe(() => {
              this.router.navigate(['/programacoes', this.eventoId]);
            });
        },
        error: (error) => {
          console.error('Erro ao atualizar programação:', error);
          this.notificationService.showError('Erro ao atualizar programação');
        }
      });
  }

  private combinarDataHora(data: Date, hora: string): Date {
    const [hours, minutes] = hora.split(':').map(Number);
    const dataCompleta = new Date(data);
    dataCompleta.setHours(hours, minutes, 0, 0);
    return dataCompleta;
  }

  private formatarDuracaoCompleta(duracao: string): string {
    // Converte "HH:MM" para "HH:MM:00" (formato TimeSpan)
    return `${duracao}:00`;
  }

  private exibirErrosFormulario(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/gestao-programacao', this.eventoId]);
  }
}
