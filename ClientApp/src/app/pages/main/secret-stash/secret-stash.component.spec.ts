import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretStashComponent } from './secret-stash.component';

describe('SecretStashComponent', () => {
  let component: SecretStashComponent;
  let fixture: ComponentFixture<SecretStashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretStashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretStashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
