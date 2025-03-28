import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { HeroService } from '../../../core/services/hero.service';
import { Hero } from '../../../shared/interfaces/heron.interface';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    UppercaseDirective,
  ],
  template: `
    <h2 mat-dialog-title>@if (data) { Editar Héroe } @else { Crear Héroe }</h2>

    <form [formGroup]="heroForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field>
          <input
            matInput
            placeholder="Nombre"
            formControlName="name"
            required
            appUppercase
          />
          @if (heroForm.get('name')?.hasError('required')) {
          <mat-error>El nombre es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Poder" formControlName="power" />
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="heroForm.invalid"
        >
          Guardar
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
        margin-bottom: 10px;
      }
    `,
  ],
})
export class HeroFormComponent {
  heroForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    power: [''],
  });

  constructor(
    private fb: FormBuilder,
    private heroService: HeroService,
    private dialogRef: MatDialogRef<HeroFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Hero | null
  ) {
    if (data) this.heroForm.patchValue(data);
  }

  onSubmit() {
    const hero = this.heroForm.value as Hero;
    const operation = hero.id
      ? this.heroService.update(hero)
      : this.heroService.create(hero);

    operation.subscribe(() => this.dialogRef.close(true));
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
