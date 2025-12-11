import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChildren } from '@angular/core';
import { ModalConfirmComponent } from '../../../../core/components/modal/modal-confirm/modal-confirm.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective } from 'ngx-mask';
import { MatCardModule } from '@angular/material/card';
import { BaseComponent } from '../../../../core/components/base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ParticipanteService } from '../../../../core/services/participante.service';
import { CadastroConvidadoDto } from '../../../../core/models/participante.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { ModalSucessComponent } from '../../../../core/components/modal/modal-sucess/modal-sucess.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-cadastro-convidado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, NgxMaskDirective, MatCheckboxModule],
  templateUrl: './cadastro-convidado.component.html',
  styleUrls: ['./cadastro-convidado.component.scss']
})
export class CadastroConvidadoComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  form: FormGroup;
  idEvento: string | null = null;
  erros = signal('');

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly acRouter = inject(ActivatedRoute);
  private readonly service = inject(ParticipanteService);
  private readonly spinner = inject(SpinnerService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    super();

    this.validationMessages = {
      nome: {
        required: '',
        minlength: 'O Nome deve ter pelo menos 3 caracteres'
      },
      email: {
        email: 'E-mail inválido'
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);

    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      telefone: ['', []]
    });
  }

  ngOnInit(): void {
    this.idEvento = this.acRouter.snapshot.paramMap.get('idEvento');
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  validarForm() {
    this.erros.set('');

    if (!this.form.value.email && !this.form.value.telefone) {
      this.erros.set('O e-mail ou o telefone deve ser informado.');
    }

    if (!this.form.value.nome) {
      this.erros.set('Por favor preencha o nome do convidado.');
    }
  }

  adicionarConvidado() {
    this.validarForm();
    if (this.form.invalid || this.erros()) {
      this.form.markAllAsTouched();
      return;
    }
    this.spinner.show();

    const model: CadastroConvidadoDto = {
      nome: this.form.value.nome,
      email: this.form.value.email,
      telefone: this.form.value.telefone,
      idEvento: Number(this.idEvento ?? 0)
    };

    this.service.cadastroConvidado(model).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (result.executouComSucesso && result.data) {
          this.dialog.open(ModalSucessComponent, {
            data: {
              title: 'Cadastro Realizado',
              message: 'O convidado foi adicionado com sucesso.',
              okLabel: 'Fechar'
            }
          }).afterClosed().subscribe(() => {
            this.router.navigate(['/convidados', this.idEvento]);
          });
        }
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Erro ao cadastrar convidado:', err);
        this.spinner.hide();
      }
    });
  }

  abrirModalCancelar() {
    this.dialog.open(ModalConfirmComponent, {
      data: {
        title: 'Cancelar Cadastro',
        message: 'Deseja cancelar o cadastro do convidado? Todas as informações serão perdidas.',
        okLabel: 'Sim, cancelar',
        cancelLabel: 'Voltar'
      }
    }).afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        this.router.navigate(['/convidados', this.idEvento]);
      }
    });
  }
}
