import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { EquipoService } from '../../../service/equipo-service';
import { Equipo } from '../../../models/equipo';

function equiposDiferentes(control: AbstractControl): ValidationErrors | null {
  const local = control.get('idEquipoLocal')?.value;
  const visitante = control.get('idEquipoVisitante')?.value;
  if (local && visitante && local === visitante) {
    return { equiposIguales: true };
  }
  return null;
}

@Component({
  selector: 'app-create-partido',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    DatePickerModule,
  ],
  templateUrl: './create-partido.html',
  styleUrl: './create-partido.css',
})
export class CreatePartido implements OnInit {
  visible = false;
  loading = false;
  equipos: Equipo[] = [];
  minDate: Date = new Date();

  @Output() partidoCreado = new EventEmitter<any>();

  fases = [
    { label: 'Grupos', value: 'Grupos' },
    { label: 'Dieciseis', value: 'Dieciseis' },
    { label: 'Octavos', value: 'Octavos' },
    { label: 'Cuartos', value: 'Cuartos' },
    { label: 'Semifinal', value: 'Semifinal' },
    { label: 'Final', value: 'Final' },
  ];

  estados = [
    { label: 'Activo', value: 'A' },
    { label: 'Inactivo', value: 'I' },
  ];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private equipoService: EquipoService,
  ) {
    this.form = this.fb.group(
      {
        idEquipoLocal: [null, Validators.required],
        idEquipoVisitante: [null, Validators.required],
        fase: [null, Validators.required],
        golesLocal: [0, [Validators.required, Validators.min(0)]],
        golesVisitante: [0, [Validators.required, Validators.min(0)]],
        fechaHora: [null, Validators.required],
        estado: ['A', Validators.required],
      },
      { validators: equiposDiferentes },
    );
  }

  ngOnInit(): void {
    this.cargarEquipos();
  }

  cargarEquipos(): void {
    this.equipoService.getEquipoList().subscribe({
      next: (data) => {
        this.equipos = data;
      },
      error: (err) => {
        // error handled silently
      },
    });
  }

  isInvalid(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.invalid && control?.touched);
  }

  hasError(campo: string, error: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.hasError(error) && control?.touched);
  }

  abrir(): void {
    this.form.reset({
      golesLocal: 0,
      golesVisitante: 0,
      estado: 'A',
    });
    this.visible = true;
  }

  cancelar(): void {
    this.form.reset();
    this.visible = false;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;

    const fechaHora = this.form.value.fechaHora;
    const fechaFormateada =
      fechaHora instanceof Date
        ? `${fechaHora.getFullYear()}-${String(fechaHora.getMonth() + 1).padStart(2, '0')}-${String(fechaHora.getDate()).padStart(2, '0')}T${String(fechaHora.getHours()).padStart(2, '0')}:${String(fechaHora.getMinutes()).padStart(2, '0')}:${String(fechaHora.getSeconds()).padStart(2, '0')}`
        : fechaHora;

    const payload = {
      idEquipoLocal: this.form.value.idEquipoLocal,
      idEquipoVisitante: this.form.value.idEquipoVisitante,
      fase: this.form.value.fase,
      golesLocal: this.form.value.golesLocal,
      golesVisitante: this.form.value.golesVisitante,
      fechaHora: fechaFormateada,
      estado: this.form.value.estado,
    };

    this.partidoCreado.emit(payload);
  }

  cerrarConExito(): void {
    this.loading = false;
    this.visible = false;
    this.form.reset();
  }

  cerrarConError(): void {
    this.loading = false;
  }
}
