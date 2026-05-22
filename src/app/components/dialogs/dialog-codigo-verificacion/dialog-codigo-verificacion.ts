import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-dialog-codigo-verificacion',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './dialog-codigo-verificacion.html',
  styleUrl: './dialog-codigo-verificacion.css',
})
export class DialogCodigoVerificacion {
  @Input() correo: string = '';
  @Output() codigoVerificado = new EventEmitter<string>();

  @ViewChildren('digitoInput') inputs!: QueryList<ElementRef>;

  visible = false;
  loading = false;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      d0: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      d1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      d2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      d3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      d4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      d5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    });
  }

  abrir(): void {
    this.form.reset();
    this.visible = true;
    setTimeout(() => {
      const first = this.inputs?.first;
      first?.nativeElement?.focus();
    });
  }

  cerrar(): void {
    this.visible = false;
    this.form.reset();
  }

  onDigitoInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && index < 5) {
      const next = this.inputs.get(index + 1);
      next?.nativeElement?.focus();
    }
  }

  onDigitoKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.form.get('d' + index)?.value && index > 0) {
      const prev = this.inputs.get(index - 1);
      prev?.nativeElement?.focus();
    }
    if (event.key === 'Enter' && !this.form.invalid) {
      this.verificar();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const digits = text.replace(/\D/g, '').slice(0, 6).split('');
    digits.forEach((d, i) => {
      this.form.get('d' + i)?.setValue(d);
    });
    const focusIndex = Math.min(digits.length, 5);
    const target = this.inputs.get(focusIndex);
    target?.nativeElement?.focus();
  }

  verificar(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const codigo = Object.values(this.form.value).join('');
    this.codigoVerificado.emit(codigo);
  }

  mostrarError(): void {
    this.loading = false;
    this.form.reset();
    setTimeout(() => {
      const first = this.inputs?.first;
      first?.nativeElement?.focus();
    });
  }
}
