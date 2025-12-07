import { Participante } from '../../../../../core/models/organizador.model';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, EventEmitter, inject, Input, OnInit, Output, signal, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControlName } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { NgxMaskDirective } from 'ngx-mask';
import { MatMenuModule } from '@angular/material/menu';
import { BaseComponent } from '../../../../../core/components/base.component';
import { ModalConfirmComponent } from '../../../../../core/components/modal/modal-confirm/modal-confirm.component';
import { PerfilService } from '../../../../../core/services/perfil.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PerfilDto } from '../../../../../core/models/perfil.model';

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
  @Output() organizadoresChange = new EventEmitter<Participante[]>();
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  private readonly fb = inject(FormBuilder);
  private readonly perfilService = inject(PerfilService);
  private readonly destroyRef = inject(DestroyRef);

  perfis = signal<PerfilDto[]>([]);

  form!: FormGroup;
  @Input() organizadores: Participante[] = [];
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
      papel: ['Ajudante', Validators.required],
      tipo: ['Pessoa Física', Validators.required],
      nome: ['', Validators.required],
      mensagem: [''],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required]
    });

    this.obterPerfis();
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  obterPerfis() {
    this.perfilService.obterPerfis().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (result.executouComSucesso && Array.isArray(result.data)) {
          this.perfis.set([...result.data]);
        }
      },
      error: (err) => {
        console.error('Erro ao obter perfis:', err);
      }
    });
  }

  adicionarOrganizador() {
    if (this.form.valid) {
      
      const organizador: Participante = {
        idPerfil: this.form.value.papel,
        tipo: this.form.value.tipo,
        nome: this.form.value.nome,
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
      this.form.reset({ papel: 'Ajudante', tipo: 'Pessoa Física' });
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
      mensagem: org.mensagem,
      email: org.email,
      telefone: org.telefone
    });
    this.editandoIndex = index;
    this.exibirForm = true;
  }

  emitirOrganizadores() {
    this.organizadoresChange.emit(this.organizadores);
  }

  validarCampo() {
    this.displayMessage = this.genericValidator.processarMensagens(this.form);
  }
}
