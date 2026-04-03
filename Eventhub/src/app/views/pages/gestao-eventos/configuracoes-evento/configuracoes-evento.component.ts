import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { NgxMaskDirective } from 'ngx-mask';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { EventoDto, StatusEvento, UpdateEventoDto, CancelarEventoDto } from '../../../../core/models/evento.model';
import { getStatusEventoInfo } from '../../../../core/utils/evento-status.util';
import { EventoService } from '../../../../core/services/evento.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ModalService } from '../../../../core/services/modal.service';
import { TipoEventoService } from '../../../../core/services/tipo-evento.service';
import { DropZoneImageComponent } from '../../../../core/components/drop-zone-image/drop-zone-image.component';

@Component({
    selector: 'app-configuracoes-evento',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatChipsModule,
        NgxMaskDirective,
        DropZoneImageComponent
    ],
    templateUrl: './configuracoes-evento.component.html',
    styleUrl: './configuracoes-evento.component.scss'
})
export class ConfiguracoesEventoComponent extends BaseComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    protected override readonly router = inject(Router);
    private readonly eventoService = inject(EventoService);
    private readonly tipoEventoService = inject(TipoEventoService);
    private readonly spinner = inject(SpinnerService);
    private readonly notification = inject(NotificationService);
    private readonly modalService = inject(ModalService);
    private readonly destroyRef = inject(DestroyRef);

    evento = signal<EventoDto | null>(null);
    tiposEvento = signal<any[]>([]);

    form!: FormGroup;
    private formValorInicial: any = null;

    eventoNome = computed(() => this.evento()?.nome || 'Carregando...');
    eventoStatus = computed(() => {
        console.log('Computando eventoStatus para evento:', this.evento());
        const status = this.evento()?.status?.id;
        return getStatusEventoInfo(status);
    });

    eventoCancelado = computed(() => this.evento()?.status?.id === StatusEvento.Cancelado);

    eventoExpirado = computed(() => {
        const evento = this.evento();
        if (!evento) return false;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        // Se for período, verifica a dataFim, senão usa dataInicio
        const dataReferencia = evento.tipoData === 'periodo' && evento.dataFim
            ? new Date(evento.dataFim)
            : evento.dataInicio ? new Date(evento.dataInicio) : null;

        if (!dataReferencia) return false;

        dataReferencia.setHours(0, 0, 0, 0);
        return dataReferencia < hoje;
    });

    podeReativar = computed(() => this.eventoCancelado() && !this.eventoExpirado());

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.inicializarFormulario();
            this.carregarDados(Number(id));
        }
    }

    private inicializarFormulario(): void {
        this.form = this.fb.group({
            nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            descricao: ['', [Validators.maxLength(500)]],
            idTipoEvento: ['', Validators.required],
            maxConvidado: ['', [Validators.min(1)]],
            fotoCapaBase64: [''],
            tipoData: ['unica', Validators.required],
            dataInicio: ['', Validators.required],
            dataFim: [''],
            cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
            logradouro: ['', Validators.required],
            cidade: ['', Validators.required],
            numero: ['', Validators.required],
            pontoReferencia: [''],
            nomeLocal: ['']
        });
    }

    private carregarDados(idEvento: number): void {
        this.spinner.show();

        this.eventoService.buscarEventoPorId(idEvento)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.spinner.hide())
            )
            .subscribe({
                next: (result) => {
                    if (result.executouComSucesso && result.data) {
                        this.evento.set(result.data);
                        this.preencherFormulario(result.data);
                    }
                },
                error: () => {
                    this.notification.showError('Erro ao carregar evento');
                    this.router.navigate(['/eventos/meus-eventos']);
                }
            });

        this.tipoEventoService.obterTiposEvento()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (result: any) => {
                    if (result.executouComSucesso && result.data) {
                        this.tiposEvento.set(result.data);
                    }
                }
            });
    }

    private preencherFormulario(evento: EventoDto): void {
        this.form.patchValue({
            nome: evento.nome,
            descricao: evento.descricao,
            idTipoEvento: evento.idTipoEvento,
            maxConvidado: evento.maxConvidado,
            fotoCapaBase64: evento.fotoCapaBase64,
            tipoData: evento.tipoData,
            dataInicio: evento.dataInicio,
            dataFim: evento.dataFim,
            cep: evento.endereco?.cep,
            logradouro: evento.endereco?.logradouro,
            cidade: evento.endereco?.cidade,
            numero: evento.endereco?.numero,
            pontoReferencia: evento.endereco?.pontoReferencia,
            nomeLocal: evento.endereco?.nomeLocal
        });

        // Armazenar valores iniciais para detectar mudanças
        this.formValorInicial = this.form.getRawValue();
    }

    private hasChanges(): boolean {
        if (!this.formValorInicial) return false;

        const valoresAtuais = this.form.getRawValue();
        return JSON.stringify(this.formValorInicial) !== JSON.stringify(valoresAtuais);
    }

    salvar(): void {
        if (this.form.invalid || !this.evento()) return;

        // Verificar se houve alterações no formulário
        if (this.hasChanges()) {
            this.modalService.openConfirmationModal({
                title: 'Comunicar Alterações aos Convidados?',
                message: 'Deseja comunicar aos convidados as alterações realizadas no evento?',
                confirmLabel: 'Sim',
                cancelLabel: 'Não'
            }).pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(desejaNotificar => {
                    if (desejaNotificar) {
                        // Usuário escolheu notificar - mostrar modal com textarea
                        this.modalService.openInputModal({
                            title: 'Informar Convidados',
                            message: 'Informe os convidados sobre as mudanças do evento:',
                            inputLabel: 'Mensagem para os Convidados',
                            inputPlaceholder: 'Descreva as alterações realizadas no evento...',
                            inputType: 'textarea',
                            confirmLabel: 'Enviar e Salvar',
                            cancelLabel: 'Cancelar',
                            inputRequired: false,
                            inputMinLength: 0
                        }, { width: "700px" }).pipe(takeUntilDestroyed(this.destroyRef))
                            .subscribe(mensagem => {
                                if (mensagem) {
                                    this.salvarENotificar(mensagem || '');
                                }
                            });
                    } else if (desejaNotificar === false) {
                        this.executarSalvar();
                    }
                });
        } else {
            this.executarSalvar();
        }
    }

    private executarSalvar(): void {
        this.spinner.show();
        const dto: UpdateEventoDto = this.montaEventoDto();

        this.eventoService.atualizar(dto)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.spinner.hide())
            )
            .subscribe({
                next: (result) => {
                    if (result.executouComSucesso && result.data) {
                        this.modalService.openSuccessModal({
                            title: 'Configurações Salvas',
                            message: 'As configurações do evento foram atualizadas com sucesso.'
                        }).pipe(takeUntilDestroyed(this.destroyRef))
                            .subscribe(x => {
                                if (x) this.router.navigate(['/eventos/home', this.evento()?.id]);
                            });
                    }
                },
                error: (ex) => {
                    console.error('Erro ao salvar evento:', ex);
                    this.notification.showError('Erro ao salvar configurações');
                }
            });
    }

    montaEventoDto(): UpdateEventoDto {
        return <UpdateEventoDto>{
            id: this.evento()!.id,
            nome: this.form.get('nome')?.value,
            descricao: this.form.get('descricao')?.value,
            idTipoEvento: this.form.get('idTipoEvento')?.value,
            maxConvidado: this.form.get('maxConvidado')?.value,
            fotoCapaBase64: this.form.get('fotoCapaBase64')?.value,
            tipoData: this.form.get('tipoData')?.value,
            dataInicio: this.form.get('dataInicio')?.value,
            dataFim: this.form.get('dataFim')?.value,
            endereco: {
                cep: this.form.get('cep')?.value,
                logradouro: this.form.get('logradouro')?.value,
                cidade: this.form.get('cidade')?.value,
                numero: this.form.get('numero')?.value,
                pontoReferencia: this.form.get('pontoReferencia')?.value,
                nomeLocal: this.form.get('nomeLocal')?.value
            }
        };
    }

    private salvarENotificar(mensagem: string): void {
        this.spinner.show();
        const dto: UpdateEventoDto = this.montaEventoDto();

        // Primeiro salvar, depois notificar
        this.eventoService.atualizar(dto)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (result) => {
                    if (result.executouComSucesso && result.data) {
                        const notificacaoDto = {
                            idEvento: this.evento()!.id,
                            mensagem
                        };

                        this.eventoService.comunicarAlteracoesAosConvidados(notificacaoDto)
                            .pipe(
                                takeUntilDestroyed(this.destroyRef),
                                finalize(() => this.spinner.hide())
                            )
                            .subscribe({
                                next: (notifResult) => {
                                    if (notifResult.executouComSucesso) {
                                        this.modalService.openSuccessModal({
                                            title: 'Sucesso!',
                                            message: 'Configurações salvas e convidados notificados com sucesso.'
                                        }).pipe(takeUntilDestroyed(this.destroyRef))
                                            .subscribe(x => {
                                                if (x) this.router.navigate(['/eventos/home', this.evento()?.id]);
                                            });
                                    }
                                },
                                error: (err) => {
                                    console.error('Erro ao notificar convidados:', err);
                                    this.notification.showError('Evento atualizado, mas houve erro ao notificar convidados');
                                    this.router.navigate(['/eventos/home', this.evento()?.id]);
                                }
                            });
                    }
                },
                error: (ex) => {
                    this.spinner.hide();
                    console.error('Erro ao salvar evento:', ex);
                    this.notification.showError('Erro ao salvar configurações');
                }
            });
    }

    arquivar(): void {
        this.modalService.openConfirmationModal({
            title: 'Arquivar Evento',
            message: 'O evento será ocultado mas os dados permanecerão salvos.',
            confirmLabel: 'Arquivar',
            cancelLabel: 'Cancelar'
        }).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(confirmed => {
                if (confirmed) this.alterarStatus(StatusEvento.Finalizado);
            });
    }

    cancelar(): void {
        if (!this.evento()) return;

        this.modalService.openInputModal({
            title: 'Cancelar Evento',
            message: 'Participantes serão notificados. Ação irreversível.',
            inputLabel: 'Motivo do Cancelamento',
            inputPlaceholder: 'Descreva o motivo...',
            inputType: 'textarea',
            confirmLabel: 'Confirmar',
            cancelLabel: 'Voltar',
            inputRequired: true,
            inputMinLength: 20
        }).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(motivo => {
                if (motivo) {
                    const dto: CancelarEventoDto = { id: this.evento()!.id, justificativa: motivo };
                    this.spinner.show();
                    this.eventoService.cancelarEvento(dto)
                        .pipe(
                            takeUntilDestroyed(this.destroyRef),
                            finalize(() => this.spinner.hide())
                        )
                        .subscribe({
                            next: (result) => {
                                if (result.executouComSucesso) {
                                    this.modalService.openSuccessModal({
                                        title: 'Evento Cancelado',
                                        message: 'O evento foi cancelado e os convidados notificados.'
                                    }).pipe(takeUntilDestroyed(this.destroyRef))
                                        .subscribe(x => {
                                            if (x) this.router.navigate(['/eventos/meus-eventos']);
                                        });
                                }
                            },
                            error: () => this.notification.showError('Erro ao cancelar evento')
                        });
                }
            });
    }

    reativarEvento(): void {
        if (!this.evento()) return;

        this.modalService.openConfirmationModal({
            title: 'Reativar Evento',
            message: 'O evento voltará ao status Ativo e os convidados poderão confirmar presença novamente.',
            confirmLabel: 'Reativar',
            cancelLabel: 'Cancelar'
        }).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(confirmed => {
                if (confirmed) {
                    this.spinner.show();
                    this.eventoService.reativarEvento(this.evento()!.id)
                        .pipe(
                            takeUntilDestroyed(this.destroyRef),
                            finalize(() => this.spinner.hide())
                        )
                        .subscribe({
                            next: (result) => {
                                if (result.executouComSucesso) {
                                    this.modalService.openSuccessModal({
                                        title: 'Evento Reativado',
                                        message: 'O evento foi reativado com sucesso.'
                                    }).pipe(takeUntilDestroyed(this.destroyRef))
                                        .subscribe(x => {
                                            if (x) this.router.navigate(['/eventos/home', this.evento()?.id]);
                                        });
                                }
                            },
                            error: () => this.notification.showError('Erro ao reativar evento')
                        });
                }
            });
    }

    excluir(): void {
        if (!this.evento()) return;

        const evento = this.evento()!;

        // Primeira confirmação com aviso sobre ação destrutiva
        this.modalService.openConfirmationModal({
            title: 'EXCLUIR EVENTO?',
            message: `
                <span class="warning-text">Esta ação NÃO pode ser desfeita!</span>
                
                <div class="event-details">
                    <p><span class="label">Evento:</span> "${evento.nome}"</p>
                    <p><span class="label">Data:</span> ${new Date(evento.dataInicio!).toLocaleDateString('pt-BR')}</p>
                </div>
                
                <span class="section-title">Serão excluídos permanentemente:</span>
                
                <ul class="impact-list">
                    <li>Todas as contribuições (presentes)</li>
                    <li>Lista de participantes</li>
                    <li>Fotos da galeria</li>
                    <li>Programação do evento</li>
                    <li>Notificações relacionadas</li>
                </ul>
                
                <div class="final-notice">
                    <p>Todos os participantes serão notificados por e-mail.</p>
                    <p>Tem certeza absoluta?</p>
                </div>
            `,
            confirmLabel: 'Sim, Excluir',
            cancelLabel: 'Cancelar'
        },{width:"600px"}).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(primeiraConfirmacao => {
                if (primeiraConfirmacao) {
                    // Segunda confirmação digitando o nome do evento
                    this.modalService.openInputModal({
                        title: 'Confirme a Exclusão',
                        message: `Digite o nome do evento para confirmar: "${evento.nome}"`,
                        inputLabel: 'Nome do Evento',
                        inputPlaceholder: 'Digite exatamente o nome do evento',
                        inputType: 'text',
                        confirmLabel: 'Confirmar Exclusão',
                        cancelLabel: 'Cancelar',
                        inputRequired: true,
                        inputMinLength: 1
                    }).pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe(nomeDigitado => {
                            if (nomeDigitado && nomeDigitado.trim() === evento.nome.trim()) {
                                this.executarExclusao();
                            } else if (nomeDigitado) {
                                this.notification.showError('Nome do evento não corresponde. Exclusão cancelada.');
                            }
                        });
                }
            });
    }

    private executarExclusao(): void {
        if (!this.evento()) return;

        this.spinner.show();
        this.eventoService.excluir(this.evento()!.id)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.spinner.hide())
            )
            .subscribe({
                next: (result) => {
                    if (result.executouComSucesso) {
                        this.modalService.openSuccessModal({
                            title: 'Evento Excluído',
                            message: 'O evento foi excluído permanentemente e todos os participantes foram notificados por e-mail.'
                        }).pipe(takeUntilDestroyed(this.destroyRef))
                            .subscribe(() => {
                                this.router.navigate(['/eventos/meus-eventos']);
                            });
                    }
                }
            });
    }

    private alterarStatus(novoStatus: StatusEvento): void {
        if (!this.evento()) return;

        this.spinner.show();
        this.eventoService.atualizarStatus(this.evento()!.id, novoStatus)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.spinner.hide())
            )
            .subscribe({
                next: (result) => {
                    if (result.executouComSucesso && result.data) {
                        this.evento.set(result.data);
                        this.notification.showSuccess('Status atualizado com sucesso!');
                    }
                },
                error: (err) => {
                    this.notification.showError('Erro ao alterar status do evento');
                }
            });
    }

    voltar(): void {
        if (this.form?.dirty && this.form?.touched) {
            this.modalService.openConfirmationModal({
                title: 'Sair sem salvar?',
                message: 'Alterações não salvas serão perdidas.',
                confirmLabel: 'Sair',
                cancelLabel: 'Continuar'
            }).pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(confirmed => {
                    if (confirmed) this.router.navigate(['/eventos/home', this.evento()?.id]);
                });
        } else {
            this.router.navigate(['/eventos/home', this.evento()?.id]);
        }
    }



    getTipoEventoNome(idTipo: number): string {
        const tipo = this.tiposEvento().find(t => t.id === idTipo);
        return tipo?.nome || 'Evento';
    }

    onImagensSelecionadas(imagens: string[]): void {
        if (imagens?.length > 0) {
            this.form.patchValue({ fotoCapaBase64: imagens[0] });
            this.form.markAsDirty();
        }
    }

    buscarCep(): void {
        const cep = this.form.get('cep')?.value?.replace(/\D/g, '');
        if (!cep || cep.length !== 8) return;

        this.spinner.show();
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(data => {
                if (!data.erro) {
                    this.form.patchValue({
                        logradouro: data.logradouro,
                        cidade: data.localidade
                    });
                } else {
                    this.notification.showError('CEP não encontrado');
                }
            })
            .catch(() => this.notification.showError('Erro ao buscar CEP'))
            .finally(() => this.spinner.hide());
    }
}
