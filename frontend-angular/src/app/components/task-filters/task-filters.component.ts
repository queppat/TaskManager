import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

export interface TaskFilterState {
  title: string;
  status: '' | 'TODO' | 'IN_PROGRESS' | 'DONE';
  sort: string;
  deadline?: Date | null;
}

@Component({
  selector: 'app-task-filters',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule
  ],
  templateUrl: './task-filters.component.html',
  styleUrl: './task-filters.component.scss',
})
export class TaskFilters implements OnInit, OnDestroy {
  @Output() filtersChange = new EventEmitter<TaskFilterState>();

  filterForm = new FormGroup({
    title: new FormControl(''),
    status: new FormControl(''),
    sort: new FormControl('createdAt,desc'),
    deadline: new FormControl<Date | null>(null)
  });

  private formChangesSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.formChangesSubscription = this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) =>
          JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe(value => {
        const filters: TaskFilterState = {
          title: value.title?.trim() || '',
          status: (value.status as any) || '',
          sort: value.sort || 'createdAt,desc',
          deadline: value.deadline || null
        };

        this.filtersChange.emit(filters);
      });
  }

  ngOnDestroy(): void {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
  }

  onReset(): void {
    this.filterForm.reset({
      title: '',
      status: '',
      sort: 'createdAt,desc',
      deadline: null
    });
  }
}