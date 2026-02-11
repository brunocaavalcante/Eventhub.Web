import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CancelarContribuicaoPresenteDto, StatusContribuicaoPresenteDto, UpdateContribuicaoPresenteDto } from '../../../../../core/models/contribuicao-presente.model';
import { CancelarContribuicaoPresenteComponent, CancelarContribuicaoResult } from '../cancelar-contribuicao-presente/cancelar-contribuicao-presente.component';
import { ContribuicaoDetalhesDto, PresenteDetalhesDto } from '../../../../../core/models/presente.model';
import { ModalSucessComponent } from '../../../../../core/components/modal/modal-sucess/modal-sucess.component';
import { ModalConfirmComponent } from '../../../../../core/components/modal/modal-confirm/modal-confirm.component';
import { BaseComponent } from '../../../../../core/components/base.component';
import { PresenteService } from '../../../../../core/services/presente/presente.service';
import { SpinnerService } from '../../../../../core/services/spinner.service';
import { DateUtils } from '../../../../../core/utils/date.utils';
import { ModalService } from '../../../../../core/services/modal.service';

@Component({
  selector: 'app-editar-contribuicao-presente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask(), provideNativeDateAdapter()],
  templateUrl: './editar-contribuicao-presente.component.html',
  styleUrl: './editar-contribuicao-presente.component.scss',
})
export class EditarContribuicaoPresenteComponent extends BaseComponent implements OnInit {
  form: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly presenteService = inject(PresenteService);
  private readonly modalService = inject(ModalService);
  private readonly spinner = inject(SpinnerService);
  private readonly destroyRef = inject(DestroyRef);

  idEvento: string = '';
  idPresente: number = 0;
  idContribuicao: number = 0;

  contribuicao: ContribuicaoDetalhesDto | null = null;
  presente: PresenteDetalhesDto | null = null;

  statusOptions = signal<StatusContribuicaoPresenteDto[]>([]);

  constructor() {
    super();

    this.form = this.fb.group({
      valor: ['', [Validators.required, Validators.min(0.01)]],
      dataContribuicao: ['', [Validators.required]],
      status: ['Pendente', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.idEvento = this.route.snapshot.paramMap.get('idEvento') || '';
    this.idPresente = Number(this.route.snapshot.paramMap.get('idPresente'));
    this.idContribuicao = Number(
      this.route.snapshot.paramMap.get('idContribuicao'),
    );

    this.carregarDados();
    this.carregarStatusContribuicaoPresente();
  }

  carregarDados(): void {
    this.spinner.show();

    this.presenteService
      .obterDetalhesPorId(this.idPresente)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide()),
      )
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso && response.data) {
            this.presente = response.data;
            this.contribuicao =
              this.presente!.contribuicoes.find(
                (c) => c.id === this.idContribuicao,
              ) || null;

            if (this.contribuicao) {
              this.preencherFormulario();
            } else {
              this.voltarParaDetalhes();
            }
          }
        },
        error: (err) => {
          console.error('Erro ao carregar dados:', err);
          this.voltarParaDetalhes();
        },
      });
  }

  carregarStatusContribuicaoPresente(): void {
    this.presenteService
      .obterStatusContribuicaoPresente()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Status de contribuição carregados:', response);
          if (response.executouComSucesso && response.data) {
            this.statusOptions.set(response.data);
          }
        },
        error: (err) => {
          console.error('Erro ao carregar status de contribuição:', err);
        },
      });
  }

  preencherFormulario(): void {
    if (!this.contribuicao) return;

    const data = DateUtils.toDate(this.contribuicao.dataCadastro);

    this.form.patchValue({
      valor: this.contribuicao.valor.toFixed(2),
      dataContribuicao: data,
      status: this.contribuicao.status.id,
    });
  }

  selecionarStatus(status: StatusContribuicaoPresenteDto): void {
    this.form.get('status')?.setValue(status.id);

    if (status.descricao.toLowerCase() === 'cancelado') {
      this.cancelarContribuicao(this.contribuicao!);
    }
  }

  cancelar(): void {
    if (this.form.dirty) {
      this.dialog
        .open(ModalConfirmComponent, {
          data: {
            title: 'Cancelar Edição',
            message: 'Você tem alterações não salvas. Deseja realmente sair?',
            confirmLabel: 'Sim, sair',
            cancelLabel: 'Continuar editando',
          },
        })
        .afterClosed()
        .subscribe((confirmado: boolean) => {
          if (confirmado) {
            this.voltarParaDetalhes();
          }
        });
    } else {
      this.voltarParaDetalhes();
    }
  }

  confirmarAtualizacao() {
    this.modalService.openConfirmationModal({
      title: 'Confirmar Atualização',
      message: 'Tem certeza que deseja atualizar a contribuição?',
      confirmLabel: 'Sim',
      cancelLabel: 'Não',
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmado) => {
        if (confirmado) {
          this.salvar();
        }
      });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.spinner.show();

    const valorString = this.form
      .get('valor')
      ?.value.toString()
      .replace(',', '.');
    const valor = parseFloat(valorString);

    const dto: UpdateContribuicaoPresenteDto = {
      id: this.idContribuicao,
      valor: valor,
      status:
        this.statusOptions().find(
          (option) => option.id === this.form.get('status')?.value,
        ) || undefined,
    };

    this.presenteService
      .atualizarContribuicao(dto)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide()),
      )
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso) {
            this.dialog
              .open(ModalSucessComponent, {
                data: {
                  title: 'Contribuição Atualizada!',
                  message: 'As alterações foram salvas com sucesso.',
                },
              })
              .afterClosed()
              .subscribe(() => {
                this.voltarParaDetalhes();
              });
          }
        },
        error: (err) => {
          console.error('Erro ao atualizar contribuição:', err);
        },
      });
  }

  voltarParaDetalhes(): void {
    this.router.navigate([
      '/presentes/detalhes',
      this.idEvento,
      this.idPresente,
    ]);
  }

  cancelarContribuicao(contribuicao: ContribuicaoDetalhesDto): void {
    const dialogRef = this.dialog.open(CancelarContribuicaoPresenteComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true,
      data: { contribuicao },
    });

    dialogRef.afterClosed().subscribe((result: CancelarContribuicaoResult) => {
      if (result?.confirmado) {
        this.spinner.show();
        const model: CancelarContribuicaoPresenteDto = {
          idContribuicao: contribuicao.id,
          justificativa: result.justificativa!,
        };
        this.presenteService
          .cancelarContribuicao(model)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              this.spinner.hide();
              console.log(response);
              if (response.executouComSucesso) {
                this.dialog.open(ModalSucessComponent, {
                  data: {
                    title: 'Contribuição Cancelada',
                    message: 'A contribuição foi cancelada com sucesso.',
                  },
                });
              }
            },
            error: (err) => {
              console.error('Erro ao cancelar contribuição:', err);
              this.spinner.hide();
            },
          });
      }else{
        this.form.get('status')?.setValue(contribuicao.status.id);
      }
    });
  }

  get nomeConvidado(): string {
    return this.contribuicao?.participante?.nome || '';
  }

  get nomePresente(): string {
    return this.presente?.nome || '';
  }
}
