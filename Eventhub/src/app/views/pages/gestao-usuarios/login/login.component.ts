import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../core/components/base.component';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  form: FormGroup;
  loading = false;
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  get email() { return this.form.get('email'); }
  get senha() { return this.form.get('senha'); }

  constructor() {
    super();
    this.validationMessages = {
      email: {
        required: 'Informe o E-mail',
        email: 'E-mail inválido',
      },
      senha: {
        required: 'Informe a Senha',
        minlength: 'A Senha deve ter pelo menos 6 caracteres',
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.form);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    try {
      const email = this.email?.value;
      const senha = this.senha?.value;
      const result = await this.usuarioService.login(email, senha);
      await this.router.navigate(['/']);
      return result as any;
    }
    catch (err) {
      return;
    } finally {
      this.loading = false;
    }
  }
}
