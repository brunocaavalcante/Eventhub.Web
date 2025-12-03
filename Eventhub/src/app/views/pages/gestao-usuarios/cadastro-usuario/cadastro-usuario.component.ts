import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormControlName, FormGroup, Validators, FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { BaseComponent } from '../../../../core/components/base.component';
import { ModalSucessComponent } from '../../../../core/components/modal/modal-sucess/modal-sucess.component';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { CreateUsuarioDTO } from '../../../../core/models/usuario.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cadastro-usuario',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    RouterModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.scss',
  providers: [provideNgxMask()]
})
export class CadastroUsuarioComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  form: FormGroup;
  loading = false;
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  get nome() { return this.form.get('nome'); }
  get email() { return this.form.get('email'); }
  get senha() { return this.form.get('senha'); }
  get confirmarSenha() { return this.form.get('confirmarSenha'); }
  get telefone() { return this.form.get('telefone'); }

  constructor() {
    super();

    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
        minlength: 'O Nome deve ter pelo menos 3 caracteres'
      },
      email: {
        required: 'Informe o E-mail',
        email: 'E-mail inválido'
      },
      senha: {
        required: 'Informe a Senha',
        minlength: 'A Senha deve ter pelo menos 6 caracteres'
      },
      confirmarSenha: {
        required: 'Confirme a Senha',
        senhasDiferentes: 'As senhas não coincidem'
      },
      telefone: {
        required: 'Informe o Telefone',
        pattern: 'Telefone inválido'
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);

    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
      telefone: ['', [Validators.required]]
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  validarSenhaSignal(): void {
    const s = this.form.value.senha;
    const c = this.form.value.confirmarSenha;

    if (s && c && s != c) {
      this.confirmarSenha?.setErrors({ senhasDiferentes: true });
    } else {
      this.confirmarSenha?.setErrors(null);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    try {
      const usuario = {
        nome: this.nome?.value,
        email: this.email?.value,
        password: this.senha?.value,
        telefone: this.telefone?.value
      } as CreateUsuarioDTO;

      this.usuarioService.cadastro(usuario).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {

          if (res.executouComSucesso) {
            this.openSuccessModal().afterClosed().subscribe(() => {
              this.router.navigate(['/usuarios/login']);
            });
          }
        },
        error: (err) => {
          console.error('Erro ao cadastrar usuário:', err);
        }
      });
    }
    finally {
      this.loading = false;
    }
  }

  openSuccessModal(): MatDialogRef<ModalSucessComponent, any> {
    return this.dialog.open(ModalSucessComponent, {
      data: {
        title: 'Cadastro Realizado',
        message: 'Seu cadastro foi realizado com sucesso!',
        okLabel: 'Fechar'
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
