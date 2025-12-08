import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { TaskItem } from '../../core/task';
import dayjs from 'dayjs';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatDividerModule
  ],
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() loading = false;
  @Input() viewMode = false;
  @Input() task: TaskItem | null = null;

  @Output() cancelled = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  taskForm: FormGroup;
  minDate = new Date();

  constructor(private readonly fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      description: ['', [Validators.maxLength(255)]],
      status: ['TODO', [Validators.required]],
      deadline: [null, [Validators.required, this.futureDateValidator.bind(this)]],
      time: ['23:59']
    });
  }

  ngOnInit(): void {
    if (this.task) {
      this.populateForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      if (changes['task'].currentValue) {
        this.populateForm();
      } else {
        this.resetForm();
      }
    }

    if (changes['visible'] && this.visible) {
      this.taskForm.get('time')?.valueChanges.subscribe(() => {
        this.taskForm.get('deadline')?.updateValueAndValidity();
      });
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.handleCancel();
    }
  }

  private futureDateValidator(control: any) {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const selectedTime = this.taskForm?.get('time')?.value || '23:59';

    if (selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      selectedDate.setHours(hours, minutes, 0, 0);
    }

    const now = new Date();
    const nowWithBuffer = new Date(now.getTime() - 60000);

    if (selectedDate < nowWithBuffer) {
      return { futureDate: true };
    }

    return null;
  }

  private populateForm(): void {
    if (this.task) {
      const deadline = this.task.deadline ? new Date(this.task.deadline) : null;
      const time = deadline ?
        `${deadline.getHours().toString().padStart(2, '0')}:${deadline.getMinutes().toString().padStart(2, '0')}` :
        '23:59';

      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        status: this.task.status,
        deadline: deadline,
        time: time
      });
    }
  }

  resetForm(): void {
    this.taskForm.reset({
      title: '',
      description: '',
      status: 'TODO',
      deadline: null,
      time: '23:59'
    });
  }

  getStatusClass(status: string): string {
    const colors: { [key: string]: string } = {
      'TODO': 'status-orange',
      'IN_PROGRESS': 'status-blue',
      'DONE': 'status-green'
    };
    return colors[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'TODO': 'Сделать',
      'IN_PROGRESS': 'В процессе',
      'DONE': 'Выполнено'
    };
    return labels[status] || status;
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '—';

    try {
      return dayjs(dateString).format('DD.MM.YYYY HH:mm');
    } catch {
      return '—';
    }
  }

  handleCancel(): void {
    this.cancelled.emit();
  }

  handleSubmit(): void {
    if (this.viewMode || this.taskForm.invalid || this.loading) {
      return;
    }

    const formValue = this.taskForm.value;
    let deadline: string | null = null;

    if (formValue.deadline) {
      const deadlineDate = new Date(formValue.deadline);

      if (formValue.time) {
        const [hours, minutes] = formValue.time.split(':').map(Number);
        deadlineDate.setHours(hours, minutes, 0, 0);
      }

      deadline = dayjs(deadlineDate).format('YYYY-MM-DDTHH:mm:ss');
    }

    const taskData = {
      title: formValue.title.trim(),
      description: formValue.description?.trim() || '',
      status: formValue.status,
      deadline: deadline
    };

    this.save.emit(taskData);
  }

  get deadlineControl() {
    return this.taskForm.get('deadline');
  }

  get titleControl() {
    return this.taskForm.get('title');
  }
}