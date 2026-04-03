import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseComponent } from '../../../../core/components/base.component';
import { ParticipanteService } from '../../../../core/services/participante.service';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { CadastroConvidadoDto } from '../../../../core/models/participante.model';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-cadastrar-convidado',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './cadastrar-convidado.component.html',
  styleUrl: './cadastrar-convidado.component.scss'
})
export class CadastrarConvidadoComponent extends BaseComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly participanteService = inject(ParticipanteService);
  private readonly spinner = inject(SpinnerService);
  private readonly modalService = inject(ModalService);

  formulario!: FormGroup;
  eventoId = 0;

  ngOnInit(): void {
    this.eventoId = Number(this.route.snapshot.paramMap.get('idEvento'));
    this.criarFormulario();
  }

  private criarFormulario(): void {
    this.formulario = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/)]],
      email: ['', [Validators.email, Validators.maxLength(100)]]
    });
  }

  salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const convidado: CadastroConvidadoDto = {
      idEvento: this.eventoId,
      nome: this.formulario.value.nome,
      telefone: this.formulario.value.telefone,
      email: this.formulario.value.email || undefined
    };

    this.spinner.show();
    this.participanteService.cadastrarConvidado(convidado)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.spinner.hide())
      )
      .subscribe({
        next: () => {
          this.modalService.openSuccessModal({ title: 'Convidado cadastrado com sucesso!' }).subscribe(() => {
            this.router.navigate(['/convidados/consultar', this.eventoId]);
          });
        },
        error: (error) => {
          console.error('Erro ao cadastrar convidado:', error);
          this.modalService.openErrorModal({ title: 'Ocorreu um erro ao cadastrar o convidado. Tente novamente.' }).subscribe();
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['/convidados/consultar', this.eventoId]);
  }

  getErrorMessage(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'Campo obrigatório';
    if (control.errors['minlength']) return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['maxlength']) return `Máximo de ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.errors['email']) return 'E-mail inválido';
    if (control.errors['pattern'] && campo === 'telefone') return 'Telefone inválido (Ex: (11) 99999-9999)';

    return '';
  }
}
