import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { HeroService } from '../../../core/services/hero.service';
import { Hero } from '../../../shared/interfaces/heron.interface';
import { FormsModule } from '@angular/forms';
import { HeroFormComponent } from '../hero-form/hero-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
})
export class HeroListComponent {
  private heroService = inject(HeroService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'name', 'power', 'actions'];
  dataSource: Hero[] = [];
  totalHeroes = 0;
  pageSize = 5;
  currentPage = 0;
  searchTerm = '';

  ngOnInit() {
    this.loadHeroes();
  }

  loadHeroes() {
    this.heroService.searchHeroes(this.searchTerm).subscribe((heroes) => {
      this.totalHeroes = heroes.length;
      this.dataSource = heroes.slice(
        this.currentPage * this.pageSize,
        (this.currentPage + 1) * this.pageSize
      );
    });
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.currentPage = 0;
    this.loadHeroes();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadHeroes();
  }

  openForm(hero?: Hero) {
    const dialogRef = this.dialog.open(HeroFormComponent, {
      width: '500px',
      data: hero || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadHeroes();
    });
  }

  deleteHero(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: '¿Estás seguro de eliminar este héroe?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.heroService.delete(id).subscribe(() => this.loadHeroes());
      }
    });
  }
}
