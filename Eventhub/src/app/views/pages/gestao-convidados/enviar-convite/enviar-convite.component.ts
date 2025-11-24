import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
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
import { ConvitePreviewComponent } from '../convite-preview/convite-preview.component';


@Component({
  selector: 'app-enviar-convite',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatCardModule, MatIconModule, MatCheckboxModule, MatSelectModule, ReactiveFormsModule, CommonModule, FormsModule, MatButtonModule, ConvitePreviewComponent],
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

  constructor(private fb: FormBuilder) {
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
      venueName: {
        required: 'Informe o local do evento',
      },
      venueAddress: {
        required: 'Informe o endereço do local',
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);

    this.form = this.fb.group({
      eventType: ['wedding'],
      name1: ['João', Validators.required],
      name2: ['Maria'],
      eventDate: ['15 de Junho de 2025', Validators.required],
      eventTime: ['16:00', Validators.required],
      venueName: ['Jardim dos Sonhos', Validators.required],
      venueAddress: ['Rua das Flores, 123 - São Paulo, SP', Validators.required],
      message: ['Com imenso prazer, convidamos você e família para celebrar conosco este momento especial. Sua presença é fundamental para tornar este dia ainda mais memorável.'],
      themeColor: ['rose'],
      fontStyle: ['elegant'],
      backgroundImage: [this.backgrounds[0]],
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
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

  uploadImage(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.form.patchValue({ backgroundImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  copyLink() {
    navigator.clipboard.writeText(this.inviteLink);
  }

  selectedGuestsCount(): number {
    return this.guests.filter(g => g.selected).length;
  }

  saveTemplate() {
    // Lógica de salvar template
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
}
