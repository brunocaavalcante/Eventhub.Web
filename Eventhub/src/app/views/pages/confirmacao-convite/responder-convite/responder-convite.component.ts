import { Component, AfterViewInit, DestroyRef, ElementRef, HostListener, inject, OnInit, signal, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { EventoService } from '../../../../core/services/evento.service';
import { ParticipanteService } from '../../../../core/services/participante.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { EventoDto, EventoUserDto } from '../../../../core/models/evento.model';
import { ConfirmarPresencaDTO, RecusarConviteDto } from '../../../../core/models/confirmar-presenca.model';
import { CreateUsuarioDTO } from '../../../../core/models/usuario.model';
import { EncryptPassword } from '../../../../core/utils/security/encrypt-password';
import { telefoneValidator } from '../../../../core/utils/validations/telefone.validator';

@Component({
  selector: 'app-responder-convite',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './responder-convite.component.html',
  styleUrl: './responder-convite.component.scss'
})
export class ResponderConviteComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly eventoService = inject(EventoService);
  private readonly participanteService = inject(ParticipanteService);
  private readonly authService = inject(AuthService);
  private readonly spinner = inject(SpinnerService);
  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  tokenEvento: string = '';
  evento = signal<EventoUserDto | null>(null);
  emailJaExiste = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  stepperOrientation = signal<'horizontal' | 'vertical'>('horizontal');
  usuarioExistente = signal<boolean>(false);

  formResposta!: FormGroup;
  formCadastro!: FormGroup;

  constructor() {
    super();

    // Validações etapa 1
    this.validationMessages = {
      vaiComparecer: {
        required: 'Por favor, informe se vai comparecer'
      },
      qtdAcompanhantes: {
        required: 'Informe a quantidade de acompanhantes',
        min: 'Quantidade não pode ser negativa'
      },
      mensagemOrganizador: {
        maxlength: 'Mensagem pode ter no máximo 500 caracteres'
      },
      motivoRecusa: {
        minlength: 'Motivo deve ter pelo menos 10 caracteres',
        maxlength: 'Motivo pode ter no máximo 300 caracteres'
      },
      // Validações etapa 2
      email: {
        required: 'Informe o E-mail',
        email: 'E-mail inválido'
      },
      nome: {
        required: 'Informe o Nome',
        minlength: 'Nome deve ter pelo menos 3 caracteres',
        maxlength: 'Nome pode ter no máximo 100 caracteres'
      },
      senha: {
        required: 'Informe a Senha',
        minlength: 'Senha deve ter pelo menos 6 caracteres',
        maxlength: 'Senha pode ter no máximo 50 caracteres'
      },
      confirmarSenha: {
        required: 'Confirme a Senha',
        senhasDiferentes: 'As senhas não coincidem'
      },
      telefone: {
        telefoneInvalido: 'Telefone deve estar no formato (XX) XXXXX-XXXX'
      }
    };

    this.configurarMensagensValidacaoBase(this.validationMessages);
  }

  ngOnInit(): void {
    this.tokenEvento = this.route.snapshot.paramMap.get('id') || '';

    if (!this.tokenEvento) {
      this.notification.showError('Link inválido');
      this.router.navigate(['/']);
      return;
    }

    this.criarFormularios();
    this.carregarEvento();
    this.configurarValidacaoQtdAcompanhantes();
    this.configurarDeteccaoEmail();
    this.updateStepperOrientation();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateStepperOrientation();
  }

  updateStepperOrientation(): void {
    const isMobile = window.innerWidth <= 600;
    this.stepperOrientation.set(isMobile ? 'vertical' : 'horizontal');
  }

  ngAfterViewInit(): void {
    this.configurarValidacaoFormularioBase(this.formInputElements, this.formResposta);
    this.configurarValidacaoFormularioBase(this.formInputElements, this.formCadastro);
  }

  criarFormularios(): void {
    this.formResposta = this.fb.group({
      vaiComparecer: ['', Validators.required],
      qtdAcompanhantes: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      mensagemOrganizador: ['', Validators.maxLength(500)],
      motivoRecusa: ['']
    });

    this.formCadastro = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      confirmarSenha: ['', Validators.required],
      telefone: ['', [telefoneValidator()]]
    });
  }

  carregarEvento(): void {
    this.spinner.show();

    this.eventoService.buscarEventoPorToken(this.tokenEvento)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso && response.data) {
            this.evento.set(response.data);
          } else {
            this.notification.showError('Evento não encontrado');
            this.router.navigate(['/']);
          }
        },
        error: () => {
          this.notification.showError('Não foi possível carregar o evento');
          this.router.navigate(['/']);
        }
      });
  }

  configurarValidacaoQtdAcompanhantes(): void {
    this.formResposta.get('vaiComparecer')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((valor) => {
        const qtdAcompanhantesControl = this.formResposta.get('qtdAcompanhantes');
        const mensagemControl = this.formResposta.get('mensagemOrganizador');
        const motivoControl = this.formResposta.get('motivoRecusa');

        if (valor === 'sim') {
          qtdAcompanhantesControl?.enable();
          mensagemControl?.enable();
          motivoControl?.disable();
          motivoControl?.clearValidators();

          qtdAcompanhantesControl?.setValidators([
            Validators.required,
            Validators.min(0)
          ]);
        } else if (valor === 'nao') {
          qtdAcompanhantesControl?.disable();
          mensagemControl?.disable();
          motivoControl?.enable();
          motivoControl?.setValidators([Validators.minLength(10), Validators.maxLength(300)]);
        }

        qtdAcompanhantesControl?.updateValueAndValidity();
        motivoControl?.updateValueAndValidity();
      });
  }

  configurarDeteccaoEmail(): void {
    this.formCadastro.get('email')?.valueChanges
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((email) => {
        if (email && this.formCadastro.get('email')?.valid) {
          this.verificarEmail(email);
        }
      });
  }

  verificarEmail(email: string): void {
    this.spinner.show();

    this.userService.verificarEmailExiste(email)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: (response) => {
          if (response.executouComSucesso && response.data) {
            const existe = true;
            this.emailJaExiste.set(existe);
            this.ajustarCamposCadastro(existe);
          }
        },
        error: () => {
          this.emailJaExiste.set(false);
          this.ajustarCamposCadastro(false);
        }
      });
  }

  ajustarCamposCadastro(emailExiste: boolean): void {
    const nomeControl = this.formCadastro.get('nome');
    const senhaControl = this.formCadastro.get('senha');
    const confirmarSenhaControl = this.formCadastro.get('confirmarSenha');
    const telefoneControl = this.formCadastro.get('telefone');

    if (emailExiste) {
      nomeControl?.disable();
      senhaControl?.disable();
      confirmarSenhaControl?.disable();
      telefoneControl?.disable();

      nomeControl?.clearValidators();
      senhaControl?.clearValidators();
      confirmarSenhaControl?.clearValidators();
    } else {
      nomeControl?.enable();
      senhaControl?.enable();
      confirmarSenhaControl?.enable();
      telefoneControl?.enable();

      // Restaura validações
      nomeControl?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
      senhaControl?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(50)]);
      confirmarSenhaControl?.setValidators([Validators.required]);
    }

    nomeControl?.updateValueAndValidity();
    senhaControl?.updateValueAndValidity();
    confirmarSenhaControl?.updateValueAndValidity();
    telefoneControl?.updateValueAndValidity();
  }

  validarSenhasIguais(): boolean {
    const senha = this.formCadastro.get('senha')?.value;
    const confirmarSenha = this.formCadastro.get('confirmarSenha')?.value;

    if (!this.emailJaExiste() && senha !== confirmarSenha) {
      this.formCadastro.get('confirmarSenha')?.setErrors({ senhasDiferentes: true });
      return false;
    }

    return true;
  }

  async proximaEtapa(): Promise<void> {
    if (this.formResposta.invalid) {
      this.validarFormulario(this.formResposta);
      this.notification.showWarning('Preencha todos os campos obrigatórios');
      return;
    }

    // Se o usuário recusou o convite, salvar a recusa e avançar para a confirmação
    if (this.formResposta.get('vaiComparecer')?.value === 'nao') {
      this.spinner.show();
      try {
        await this.salvarRecusa();
        this.notification.showSuccess('Resposta enviada com sucesso!');
        this.stepper.next();
      } catch (error) {
        console.error('Erro ao enviar resposta:', error);
      } finally {
        this.spinner.hide();
      }
    }
  }

  async finalizarConfirmacao(): Promise<void> {
    if (this.formCadastro.invalid || (!this.emailJaExiste() && !this.validarSenhasIguais())) {
      this.validarFormulario(this.formCadastro);
      this.notification.showWarning('Preencha todos os campos corretamente');
      return;
    }

    this.spinner.show();

    try {
      if (this.emailJaExiste()) {
        
        this.usuarioExistente.set(true);
        await this.salvarConfirmacao();
        this.notification.showSuccess('Presença confirmada! Faça login para acessar o evento.');
      } else {
        // Cadastrar novo usuário e fazer login automático
        this.usuarioExistente.set(false);
        await this.realizarCadastro();
        await this.salvarConfirmacao();
        this.notification.showSuccess('Presença confirmada com sucesso!');
      }

      // Avançar para o step de confirmação
      this.stepper.next();
      this.spinner.hide();

    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      this.spinner.hide();
    }
  }

  async realizarCadastro(): Promise<void> {
    return new Promise((resolve, reject) => {
      const senha = this.formCadastro.get('senha')?.value;
      const senhaEncriptada = EncryptPassword.encryptPassword(senha);

      const novoUsuario: CreateUsuarioDTO = {
        nome: this.formCadastro.get('nome')?.value,
        email: this.formCadastro.get('email')?.value,
        password: senhaEncriptada,
        telefone: this.formCadastro.get('telefone')?.value || null
      };

      this.userService.cadastro(novoUsuario)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            // Após cadastro, fazer login automaticamente
            this.authService.login({
              email: novoUsuario.email, password: senhaEncriptada
            }).pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                next: () => resolve(),
                error: (err) => reject(err)
              });
          },
          error: (err) => {
            this.notification.showError('Erro ao cadastrar usuário');
            reject(err);
          }
        });
    });
  }

  async salvarConfirmacao(): Promise<void> {
    return new Promise((resolve, reject) => {
      const vaiComparecer = this.formResposta.get('vaiComparecer')?.value === 'sim';

      const dto: ConfirmarPresencaDTO = {
        tokenEvento: this.tokenEvento,
        nome: this.formCadastro.get('nome')?.value || '',
        email: this.formCadastro.get('email')?.value || '',
        qtdAcompanhantes: vaiComparecer ? this.formResposta.get('qtdAcompanhantes')?.value : 0,
        mensagemOrganizador: this.formResposta.get('mensagemOrganizador')?.value || '',
      };

      const serviceMethod = vaiComparecer
        ? this.participanteService.confirmarPresenca(dto)
        : this.participanteService.recusarConvite(dto);

      serviceMethod
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.spinner.hide())
        )
        .subscribe({
          next: () => resolve(),
          error: (err) => {
            this.notification.showError('Erro ao confirmar presença');
            reject(err);
          }
        });
    });
  }

  async salvarRecusa(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dto: RecusarConviteDto = {
        tokenEvento: this.tokenEvento,
        email: this.formCadastro.get('email')?.value || '',
        motivoRecusa: this.formResposta.get('motivoRecusa')?.value || ''
      };

      this.participanteService.recusarConvite(dto)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.spinner.hide())
        )
        .subscribe({
          next: () => resolve(),
          error: (err) => {
            this.notification.showError('Erro ao enviar resposta');
            reject(err);
          }
        });
    });
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }

  irParaEvento(): void {
    this.router.navigate(['/eventos/home', this.evento()?.id]);
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  get vaiComparecer(): FormControl {
    return this.formResposta.get('vaiComparecer') as FormControl;
  }

}
