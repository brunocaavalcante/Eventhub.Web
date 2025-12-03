import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, ViewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../core/components/base.component';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

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
    const email = this.email?.value;
    const password = this.senha?.value;
    
    this.authService.login({ email, password }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: async (result) => {
        if (result.executouComSucesso) {
          await this.router.navigate(['/']);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }
}
