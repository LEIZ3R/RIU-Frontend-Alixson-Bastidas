import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { Hero } from '../../shared/interfaces/heron.interface';
import { MOCK_HEROES } from '../../mocks/heroes.mock';

describe('HeroService', () => {
  let service: HeroService;
  const initialHeroCount = MOCK_HEROES.length;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroService);
    service['heroesSubject'].next([...MOCK_HEROES]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should return all heroes with delay', fakeAsync(() => {
      let result: Hero[] = [];
      service.getAll().subscribe((heroes) => (result = heroes));
      tick(500);
      expect(result.length).toBe(initialHeroCount);
    }));
  });

  describe('getById()', () => {
    it('should return hero by id', fakeAsync(() => {
      let result: Hero | undefined;
      service.getById('1').subscribe((hero) => (result = hero));
      tick(500);
      expect(result?.name).toBe('SPIDERMAN');
    }));
  });

  describe('searchHeroes()', () => {
    it('should filter heroes by term (case insensitive)', fakeAsync(() => {
      let result: Hero[] = [];
      service.searchHeroes('man').subscribe((heroes) => (result = heroes));
      tick(500);
      expect(result.length).toBe(2);
      expect(result.some((h) => h.name === 'SPIDERMAN')).toBeTrue();
    }));

    it('should return empty array if no matches', fakeAsync(() => {
      let result: Hero[] = [];
      service.searchHeroes('xyz').subscribe((heroes) => (result = heroes));
      tick(500);
      expect(result.length).toBe(0);
    }));
  });

  describe('create()', () => {
    it('should add new hero with generated ID', fakeAsync(() => {
      const newHero: Hero = { id: '1', name: 'FLASH', power: 'Speed' };
      let createdId = '';

      service.create(newHero).subscribe((hero) => {
        createdId = hero.id;
      });
      tick(500);

      expect(createdId).toBe((initialHeroCount + 1).toString());
      expect(service['heroesSubject'].value.length).toBe(initialHeroCount + 1);
    }));
  });

  describe('update()', () => {
    it('should update existing hero', fakeAsync(() => {
      const updatedHero = { ...MOCK_HEROES[0], name: 'SPIDER-MAN' };
      let result: Hero | undefined;

      service.update(updatedHero).subscribe((hero) => (result = hero));
      tick(500);

      expect(result?.name).toBe('SPIDER-MAN');
      expect(service['heroesSubject'].value[0].name).toBe('SPIDER-MAN');
    }));
  });

  describe('delete()', () => {
    it('should remove hero by id', fakeAsync(() => {
      let deletedId = '';
      service.delete('1').subscribe((id) => (deletedId = id));
      tick(500);

      expect(deletedId).toBe('1');
      expect(service['heroesSubject'].value.length).toBe(initialHeroCount - 1);
    }));
  });

  it('should notify subscribers on data changes', () => {
    const testHero: Hero = { id: '1', name: 'TEST', power: 'TEST' };
    let notifications = 0;

    const sub = service.heroes$.subscribe(() => notifications++);

    service.create(testHero).subscribe();
    expect(notifications).toBe(2);

    sub.unsubscribe();
  });
});
