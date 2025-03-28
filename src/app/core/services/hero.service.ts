import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { Hero } from '../../shared/interfaces/heron.interface';
import { MOCK_HEROES } from '../../mocks/heroes.mock';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesSubject = new BehaviorSubject<Hero[]>(MOCK_HEROES);
  heroes$ = this.heroesSubject.asObservable();

  constructor() {}

  /**
   * Create hero
   * @param hero Hero
   * @returns Observable<Hero>
   */
  create(hero: Hero): Observable<Hero> {
    const heroes = this.heroesSubject.value;
    hero.id = (heroes.length + 1).toString();
    heroes.push(hero);
    this.heroesSubject.next(heroes);
    return of(hero).pipe(delay(500));
  }

  /**
   * Get all heroes
   * @returns Observable<Hero[]>
   */
  getAll(): Observable<Hero[]> {
    return this.heroesSubject.asObservable().pipe(delay(500));
  }

  /**
   * Get hero by id
   * @param id string
   * @returns Observable<Hero>
   */
  getById(id: string): Observable<Hero> {
    const hero = this.heroesSubject.value.find((hero) => hero.id === id);
    if (!hero) {
      throw new Error(`Hero with id ${id} not found`);
    }
    return of(hero).pipe(delay(500));
  }

  /**
   * Search heroes by term
   * @param term string
   * @returns Observable<Hero[]>
   */
  searchHeroes(term: string): Observable<Hero[]> {
    return of(
      this.heroesSubject.value.filter((hero) =>
        hero.name.toLowerCase().includes(term.toLowerCase())
      )
    ).pipe(delay(500));
  }

  /**
   * Update hero
   * @param hero Hero
   * @returns Observable<Hero>
   */
  update(hero: Hero): Observable<Hero> {
    const heroes = this.heroesSubject.value;
    const index = heroes.findIndex((h) => h.id === hero.id);
    if (index === -1) {
      throw new Error(`Hero with id ${hero.id} not found`);
    }
    heroes[index] = hero;
    this.heroesSubject.next(heroes);
    return of(hero).pipe(delay(500));
  }

  /**
   * Delete hero by id
   * @param id string
   * @returns Observable<string>
   */
  delete(id: string): Observable<string> {
    const heroes = this.heroesSubject.value;
    const index = heroes.findIndex((hero) => hero.id === id);
    if (index === -1) {
      throw new Error(`Hero with id ${id} not found`);
    }
    heroes.splice(index, 1);
    this.heroesSubject.next(heroes);
    return of(id).pipe(delay(500));
  }
}
