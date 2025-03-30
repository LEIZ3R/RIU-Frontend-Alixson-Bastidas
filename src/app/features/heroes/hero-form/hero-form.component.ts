import { Component, Inject, effect, signal, untracked } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    UppercaseDirective,
  ],
  template: `
    <h2 mat-dialog-title>{{ data() ? 'Editar Héroe' : 'Crear Héroe' }}</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field>
          <input
            matInput
            placeholder="Nombre"
            formControlName="name"
            required
            appUppercase
          />
          @if (form.get('name')?.hasError('required')) {
          <mat-error>El nombre es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Poder" formControlName="power" />
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="!form.valid || !hasChanges()"
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
  data = signal<Hero | null>(null);
  originalValues = signal<Partial<Hero> | null>(null);
  form = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    power: [''],
  });

  constructor(
    private fb: FormBuilder,
    private heroService: HeroService,
    private dialogRef: MatDialogRef<HeroFormComponent>,
    @Inject(MAT_DIALOG_DATA) initialData: Hero | null
  ) {
    this.data.set(initialData);

    effect(
      () => {
        const currentData = this.data();
        untracked(() => {
          if (currentData) {
            this.form.patchValue(currentData);
            this.originalValues.set({ ...currentData });
            this.form.markAsPristine();
          } else {
            this.form.reset();
            this.originalValues.set(null);
          }
        });
      },
      { allowSignalWrites: true }
    );
  }

  hasChanges(): boolean {
    if (!this.data()) {
      return this.form.dirty;
    }

    const current = this.form.value;
    const original = this.originalValues();

    return current.name !== original?.name || current.power !== original?.power;
  }

  onSubmit() {
    if (this.form.valid && this.hasChanges()) {
      const hero = this.form.value as Hero;
      const operation = hero.id
        ? this.heroService.update(hero)
        : this.heroService.create(hero);

      operation.subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Error saving hero', err),
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
