import { Organizador } from '../../../../../core/models/organizador.model';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule, FormsModule, FormControlName } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { NgxMaskDirective } from 'ngx-mask';
import { MatMenuModule } from '@angular/material/menu';
import { ModalConfirmComponent } from '../../../../../core/components/modal/modal-confirm/modal-confirm.component';
import { BaseComponent } from '../../../../../core/components/base.component';

@Component({
  selector: 'app-cadastro-organizadores',
  templateUrl: './cadastro-organizadores.component.html',
  styleUrls: ['./cadastro-organizadores.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatListModule,
    NgxMaskDirective,
    MatMenuModule
  ]
})
export class CadastroOrganizadoresComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Output() organizadoresChange = new EventEmitter<Organizador[]>();
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  private readonly fb = inject(FormBuilder);

  form!: FormGroup;
  @Input() organizadores: Organizador[] = [];
  editandoIndex: number | null = null;
  exibirForm = false;

  constructor() {
    super();
    this.validationMessages = {
      tipo: {
        required: 'O tipo é obrigatório.'
      },
      nome: {
        required: 'O campo nome é obrigatório.'
      },
      razaoSocial: {
        required: 'O campo razão social é obrigatório.'
      },
      email: {
        required: 'O campo e-mail é obrigatório.',
        email: 'O e-mail deve ser válido.'
      },
      telefone: {
        required: 'O campo telefone é obrigatório.'
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      tipo: ['Pessoa Física', Validators.required],
      nome: ['', Validators.required],
      foto: [null],
      mensagem: [''],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  adicionarOrganizador() {
    if (this.form.valid) {
      const organizador = {
        tipo: this.form.value.tipo,
        nome: this.form.value.nome,
        foto: this.form.value.foto,
        mensagem: this.form.value.mensagem,
        email: this.form.value.email,
        telefone: this.form.value.telefone
      };
      if (this.editandoIndex !== null) {
        this.organizadores[this.editandoIndex] = organizador;
        this.editandoIndex = null;
      } else {
        this.organizadores.push(organizador);
      }
      this.form.reset({ tipo: 'Pessoa Física' });
      this.exibirForm = false;
      this.emitirOrganizadores();
    }
  }

  async removerOrganizador(index: number) {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      data: {
        title: 'Remover Organizador',
        message: 'Tem certeza que deseja remover este organizador?',
        cancelLabel: 'CANCELAR',
        confirmLabel: 'CONFIRMAR'
      }
    });
    const confirmed = await dialogRef.afterClosed().toPromise();
    if (confirmed) {
      this.organizadores.splice(index, 1);
      this.emitirOrganizadores();
    }
  }

  editarOrganizador(index: number) {
    const org = this.organizadores[index];
    this.form.patchValue({
      tipo: org.tipo,
      nome: org.nome,
      foto: org.foto,
      mensagem: org.mensagem,
      email: org.email,
      telefone: org.telefone
    });
    this.editandoIndex = index;
    this.exibirForm = true;
  }

  onFotoSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  removerFoto() {
    this.form.patchValue({ foto: null });
  }

  emitirOrganizadores() {
    this.organizadoresChange.emit(this.organizadores);
  }

  validarCampo() {
    this.displayMessage = this.genericValidator.processarMensagens(this.form);
  }
}
