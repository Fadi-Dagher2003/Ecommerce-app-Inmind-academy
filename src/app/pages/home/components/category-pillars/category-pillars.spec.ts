import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPillars } from './category-pillars';

describe('CategoryPillars', () => {
  let component: CategoryPillars;
  let fixture: ComponentFixture<CategoryPillars>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPillars],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPillars);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
