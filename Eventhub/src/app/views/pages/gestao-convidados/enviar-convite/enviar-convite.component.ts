import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '../../../../core/components/base.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ConvitePreviewComponent, ConvitePreviewData } from '../convite-preview/convite-preview.component';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { EventoService } from '../../../../core/services/evento.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventoDto, TipoEvento } from '../../../../core/models/evento.model';
import { TipoEventoService } from '../../../../core/services/tipo-evento.service';
import { EnvioConviteService } from '../../../../core/services/envio-convite.service';
import { CadastroConviteDTO, ConviteDTO, UpdateConviteDTO } from '../../../../core/models/envio.convite.model';
import { TipoImagemEvento } from '../../../../core/models/imagem.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateUtils } from '../../../../core/utils/date.utils';
import { Base64ImageUtil } from '../../../../core/utils/base64-image.util';
import { ModalSucessComponent } from '../../../../core/components/modal/modal-sucess/modal-sucess.component';

@Component({
  selector: 'app-enviar-convite',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule,
    MatCardModule, MatIconModule, MatCheckboxModule, MatSelectModule, ReactiveFormsModule, CommonModule, FormsModule, MatButtonModule, MatBottomSheetModule, ConvitePreviewComponent, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './enviar-convite.component.html',
  styleUrls: ['./enviar-convite.component.scss']
})
export class EnviarConviteComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  form: FormGroup;
  guests = [
    { id: 7, name: 'Pedro Silva', status: 'pending_invite', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop', selected: false },
    { id: 8, name: 'Ana Carolina', status: 'pending_invite', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', selected: false },
    { id: 3, name: 'Isabela Costa', status: 'pending', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', selected: false },
    { id: 4, name: 'Rafael Souza', status: 'pending', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', selected: false },
  ];
  backgrounds = [
    'https://images.unsplash.com/photo-1752857015591-c1b85c01c461?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1515923019249-6b544314450f?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1680882310680-a8e33beaaf9d?w=800&h=1200&fit=crop',
    'https://images.unsplash.com/photo-1552536273-91084b4b10b4?w=800&h=1200&fit=crop',
  ];
  inviteLink = 'https://meuevent.app/convite/casamento-joao-maria';
  showSendDialog = false;
  showName2 = true;
  name1Label = 'Nome do Noivo';
  name2Label = 'Nome da Noiva';

  private readonly eventoService = inject(EventoService);
  private readonly tipoEventoService = inject(TipoEventoService);
  private readonly conviteService = inject(EnvioConviteService);
  private readonly destroyRef = inject(DestroyRef);

  evento = signal<EventoDto | null>(null);
  convite = signal<ConviteDTO | null>(null);
  tipoEventos = signal<TipoEvento[] | null>(null);

  constructor(private fb: FormBuilder, private bottomSheet: MatBottomSheet) {
    super();
    this.validationMessages = {
      name1: {
        required: 'Informe o nome',
      },
      eventDate: {
        required: 'Informe a data do evento',
      },
      eventTime: {
        required: 'Informe o horário do evento',
      },
      eventEndDate: {
        required: 'Informe a data de término',
      },
      eventEndTime: {
        required: 'Informe o horário de término',
      },
      venueName: {
        required: 'Informe o local do evento',
      },
      venueAddress: {
        required: 'Informe o endereço do local',
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);

    this.form = this.fb.group({
      eventType: [{ value: '', disabled: true }],
      name1: ['', Validators.required],
      name2: [''],
      eventDate: [null, Validators.required],
      eventTime: ['', Validators.required],
      eventEndDate: [null, Validators.required],
      eventEndTime: ['', Validators.required],
      venueName: ['', Validators.required],
      venueAddress: ['', Validators.required],
      message: ['Com imenso prazer, convidamos você e família para celebrar conosco este momento especial. Sua presença é fundamental para tornar este dia ainda mais memorável.'],
      themeColor: ['rose'],
      fontStyle: ['elegant'],
      backgroundImage: [this.backgrounds[0]],
    });
  }

  ngOnInit(): void {
    this.obterTipoEventos();
    this.obterEventoPorId(1);
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  obterEventoPorId(id: number) {
    this.eventoService.buscarEventoPorId(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (result.executouComSucesso && result.data) {
          this.evento.set(result.data);
          this.obterConvitePorEvento(id);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar evento:', error);
      }
    });
  }

  obterConvitePorEvento(idEvento: number) {
    this.conviteService.buscarConvitePorEvento(idEvento).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (result.executouComSucesso && result.data) {
          this.convite.set(result.data);
          this.setForm();
        }
      },
      error: (error) => {
        console.error('Erro ao carregar convite:', error);
      }
    });
  }

  obterTipoEventos() {
    this.tipoEventoService.obterTiposEvento().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (result.executouComSucesso && Array.isArray(result.data)) {
          this.tipoEventos.set(result.data);
          const evento = this.evento();
          if (evento) {
            const tipoEvento = result.data.find(t => t.id === evento.idTipoEvento);
            if (tipoEvento) {
              this.form.patchValue({ eventType: tipoEvento.id });
            }
          }
        }
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de evento:', error);
      }
    });
  }

  setForm() {
    const evento = this.evento();
    const convite = this.convite();

    if (!evento) return;

    const conviteBackground = convite?.foto ? Base64ImageUtil.resolveImageSource(convite.foto.base64) : null;
    if (conviteBackground) {
      this.addBackgroundOption(conviteBackground);
    }

    const backgroundImage = conviteBackground || this.backgrounds[0];

    this.form.patchValue({
      name1: convite?.nome || '',
      name2: convite?.nome2 || '',
      message: convite?.mensagem || '',
      themeColor: convite?.temaConvite || 'rose',
      backgroundImage,
      eventType: evento.idTipoEvento,
      eventDate: evento.dataInicio ? new Date(evento.dataInicio) : null,
      eventTime: DateUtils.formatarHora(evento.dataInicio),
      eventEndDate: evento.dataFim ? new Date(evento.dataFim) : null,
      eventEndTime: DateUtils.formatarHora(evento.dataFim),
      venueAddress: evento.endereco ? `${evento.endereco.logradouro}, ${evento.endereco.numero} ${evento.endereco?.pontoReferencia} - ${evento.endereco.cidade}` : '',
      venueName: evento.endereco?.nomeLocal || ''
    });
  }

  onEventTypeChange(type: string) {
    switch (type) {
      case 'wedding':
        this.name1Label = 'Nome do Noivo';
        this.name2Label = 'Nome da Noiva';
        this.showName2 = true;
        this.form.patchValue({
          message: 'Com imenso prazer, convidamos você e família para celebrar conosco este momento especial. Sua presença é fundamental para tornar este dia ainda mais memorável.',
          backgroundImage: this.backgrounds[0],
        });
        break;
      case 'baby_shower':
        this.name1Label = 'Nome da Mãe';
        this.name2Label = 'Nome do Pai';
        this.showName2 = true;
        this.form.patchValue({
          message: 'Estamos muito felizes e queremos compartilhar essa alegria com você! Venha celebrar a chegada do nosso pequeno(a).',
          backgroundImage: this.backgrounds[1],
        });
        break;
      case 'birthday':
        this.name1Label = 'Nome do Aniversariante';
        this.name2Label = '';
        this.showName2 = false;
        this.form.patchValue({
          message: 'Será uma grande alegria contar com sua presença neste dia tão especial. Vamos comemorar juntos!',
          backgroundImage: this.backgrounds[2],
        });
        break;
      case 'housewarming':
        this.name1Label = 'Primeiro Nome';
        this.name2Label = 'Segundo Nome';
        this.showName2 = true;
        this.form.patchValue({
          message: 'Estamos de casa nova e queremos celebrar com você! Venha nos visitar e conhecer nosso novo lar.',
          backgroundImage: this.backgrounds[3],
        });
        break;
      case 'other':
        this.name1Label = 'Nome do Anfitrião';
        this.name2Label = 'Segundo Anfitrião';
        this.showName2 = true;
        this.form.patchValue({
          message: 'Teremos o prazer de recebê-lo(a) neste evento especial. Sua presença será muito importante para nós!',
          backgroundImage: this.backgrounds[0],
        });
        break;
    }
  }

  setBackground(image: string) {
    this.form.patchValue({ backgroundImage: image });
  }

  private addBackgroundOption(imageSrc: string) {
    if (!imageSrc) {
      return;
    }
    if (this.backgrounds.includes(imageSrc)) {
      return;
    }
    this.backgrounds = [...this.backgrounds, imageSrc];
  }

  uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      this.addBackgroundOption(dataUrl);
      this.form.patchValue({ backgroundImage: dataUrl });
      if (input) {
        input.value = '';
      }
    };
    reader.readAsDataURL(file);
  }

  copyLink() {
    navigator.clipboard.writeText(this.inviteLink);
  }

  selectedGuestsCount(): number {
    return this.guests.filter(g => g.selected).length;
  }

  get previewData(): ConvitePreviewData {
    if (!this.form) {
      return {} as ConvitePreviewData;
    }

    const raw = this.form.getRawValue();
    return {
      eventType: raw.eventType,
      name1: raw.name1,
      name2: raw.name2,
      eventDate: this.formatDateDisplay(raw.eventDate),
      eventTime: raw.eventTime || '',
      eventEndDate: this.formatDateDisplay(raw.eventEndDate),
      eventEndTime: raw.eventEndTime || '',
      venueName: raw.venueName,
      venueAddress: raw.venueAddress,
      message: raw.message,
      themeColor: raw.themeColor,
      fontStyle: raw.fontStyle,
      backgroundImage: raw.backgroundImage,
      inviteText: raw.inviteText,
    };
  }

  async saveTemplate(): Promise<void> {
    if (this.form.invalid) return;

    const evento = this.evento();
    if (!evento) {
      return;
    }

    const raw = this.form.getRawValue();
    const dataInicio = DateUtils.combineDateAndTime(raw.eventDate, raw.eventTime);
    const dataFim = DateUtils.combineDateAndTime(raw.eventEndDate, raw.eventEndTime);

    if (!dataInicio || !dataFim) {
      this.form.markAllAsTouched();
      return;
    }

    const backgroundBase64 = await Base64ImageUtil.getBackgroundBase64(raw.backgroundImage);

    const conviteData: CadastroConviteDTO = {
      idEvento: evento.id,
      nome: raw.name1,
      nome2: raw.name2,
      mensagem: raw.message,
      temaConvite: `${raw.themeColor ?? ''}`,
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString(),
      foto: {
        id: this.convite()?.foto?.id ?? 0,
        nomeArquivo: 'convite-evento.png',
        base64: backgroundBase64,
        tipoImagem: TipoImagemEvento.Convite
      }
    };

    const conviteExistente = this.convite();
    const isAtualizacao = !!conviteExistente && conviteExistente.id > 0;

    const request$ = isAtualizacao
      ? this.conviteService.atualizarConvite(this.mapToUpdateDto(conviteExistente!.id, conviteData))
      : this.conviteService.criarConvite(conviteData);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (result.executouComSucesso) {
          if (result.data) {
            this.convite.set(result.data);
          }
          this.dialog.open(ModalSucessComponent, {
            data: {
              title: isAtualizacao ? 'Atualização Realizada' : 'Cadastro Realizado',
              message: isAtualizacao
                ? 'O template do convite foi atualizado com sucesso.'
                : 'O template do convite foi criado com sucesso.',
              okLabel: 'Fechar'
            }
          });
        }
      },
      error: (error) => {
        console.error('Erro ao salvar/atualizar convite:', error);
      }
    });
  }

  openSendDialog() {
    this.showSendDialog = true;
  }

  closeSendDialog() {
    this.showSendDialog = false;
  }

  confirmSend() {
    // Lógica de envio real
    this.showSendDialog = false;
  }

  openPreviewSheet() {
    if (!this.form) return;
    this.bottomSheet.open(ConvitePreviewComponent, {
      data: this.previewData,
      panelClass: 'convite-preview-sheet'
    });
  }

  private mapToUpdateDto(conviteId: number, data: CadastroConviteDTO): UpdateConviteDTO {
    return {
      id: conviteId,
      nome: data.nome,
      nome2: data.nome2,
      mensagem: data.mensagem,
      temaConvite: data.temaConvite,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
      foto: data.foto
    };
  }

  private formatDateDisplay(value: Date | string | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}
