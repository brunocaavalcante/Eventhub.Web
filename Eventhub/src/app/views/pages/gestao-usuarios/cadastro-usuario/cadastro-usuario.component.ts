import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChildren } from '@angular/core';
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

  get nome() { return this.form.get('nome'); }
  get email() { return this.form.get('email'); }
  get senha() { return this.form.get('senha'); }
  get confirmarSenha() { return this.form.get('confirmarSenha'); }
  get telefone() { return this.form.get('telefone'); }

  constructor() {
    super();

    this.validationMessages = {
      nome: {
        required: 'Informe o Nome'
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
        required: 'Confirme a Senha'
      },
      telefone: {
        required: 'Informe o Telefone',
        pattern: 'Telefone inválido'
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);

    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
      telefone: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  passwordsMatch(group: FormGroup) {
    const s = group.get('senha')?.value;
    const c = group.get('confirmarSenha')?.value;
    return s && c && s === c ? null : { passwordMismatch: true };
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
        senha: this.senha?.value,
        telefone: this.telefone?.value
      } as any;

      var result = await this.usuarioService.cadastro(usuario);
      if (result) {
        this.openSuccessModal().afterClosed().subscribe(() => {
          this.router.navigate(['/usuarios/login']);
        });
      }
    }
    catch (err) { }
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
}
