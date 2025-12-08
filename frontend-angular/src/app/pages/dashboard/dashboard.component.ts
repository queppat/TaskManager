import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { TaskHeader } from '../../components/task-header/task-header';
import { TaskStatsPanel } from '../../components/task-stats-panel/task-stats-panel';
import { TaskTableComponent } from '../../components/task-table/task-table';
import { TaskPaginationComponent } from '../../components/task-pagination/task-pagination';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';
import { Task, TaskItem, CreateTaskData, TaskPage } from '../../core/task';
import { Auth } from '../../core/auth';
import dayjs from 'dayjs';
import { TaskFilters, TaskFilterState } from '../../components/task-filters/task-filters.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    TaskHeader,
    TaskStatsPanel,
    TaskFilters,
    TaskTableComponent,
    TaskPaginationComponent,
    TaskModalComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  private readonly taskService = inject(Task);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  tasks: TaskItem[] = [];
  totalTasks = 0;
  loading = false;
  modalLoading = false;

  modalVisible = false;
  viewMode = false;
  editingTask: TaskItem | null = null;

  filters: TaskFilterState = {
    title: '',
    status: '',
    deadline: null,
    sort: 'createdAt,desc'
  };

  currentPage = 0;
  pageSize = 10;

  completedTasks = 0;
  pendingTasks = 0;
  inProgressTasks = 0;

  private readonly filtersChangedSubject = new Subject<TaskFilterState>();
  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.filtersChangedSubject
        .pipe(
          debounceTime(300),
          distinctUntilChanged((prev, curr) =>
            JSON.stringify(prev) === JSON.stringify(curr)
          )
        )
        .subscribe(filters => {
          this.onFiltersChange(filters);
        })
    );

    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.filtersChangedSubject.complete();
  }

  private loadTasks(): void {
    this.loading = true;
    const deadlineParam = this.filters.deadline
      ? this.formatToLocalDate(this.filters.deadline)
      : undefined;

    this.taskService.getAllTasks(
      this.currentPage,
      this.pageSize,
      {
        title: this.filters.title || undefined,
        status: this.filters.status || undefined,
        deadline: deadlineParam
      },
      this.filters.sort
    ).subscribe({
      next: (response: TaskPage) => {
        this.tasks = response.content;
        this.totalTasks = response.totalElements;
        this.currentPage = response.page;
        this.pageSize = response.size;
        this.updateTaskStats(response.content);
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Ошибка загрузки задач', 'OK', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      }
    });
  }

  private formatToLocalDate(date: Date): string {
    return dayjs(date).format('YYYY-MM-DD');
  }

  private formatToLocalDateTime(date: Date): string {
    return dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
  }

  private formatForApi(date: Date | null): string | null {
    if (!date) return null;
    return this.formatToLocalDateTime(date);
  }

  private updateTaskStats(tasksList: TaskItem[]): void {
    this.completedTasks = tasksList.filter(task => task.status === 'DONE').length;
    this.pendingTasks = tasksList.filter(task => task.status === 'TODO').length;
    this.inProgressTasks = tasksList.filter(task => task.status === 'IN_PROGRESS').length;
  }

  async handleLogout(): Promise<void> {
    try {
      await this.auth.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      this.snackBar.open('Ошибка при выходе из системы', 'OK', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/login']);
    }
  }

  handleNewTask(): void {
    this.editingTask = null;
    this.viewMode = false;
    this.modalVisible = true;
  }

  handleEdit(task: TaskItem): void {
    this.editingTask = task;
    this.viewMode = false;
    this.modalVisible = true;
  }

  handleView(task: TaskItem): void {
    this.editingTask = task;
    this.viewMode = true;
    this.modalVisible = true;
  }

  handleDelete(taskId: number): void {
    if (this.editingTask?.id === taskId) {
      this.editingTask = null;
    }
    this.deleteTask(taskId);
  }

  private deleteTask(taskId: number): void {
    this.loading = true;

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.snackBar.open('Задача удалена', 'OK', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        const isLastTaskOnPage = this.tasks.length === 1;
        const isNotFirstPage = this.currentPage > 0;

        if (isLastTaskOnPage && isNotFirstPage) {
          this.currentPage--;
        }

        this.loadTasks();
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Ошибка удаления задачи', 'OK', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      }
    });
  }

  handleSubmit(taskData: any): void {
    this.modalLoading = true;

    const dataToSend: CreateTaskData = {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      deadline: this.formatForApi(taskData.deadline)
    };

    const observable = this.editingTask
      ? this.taskService.updateTask(this.editingTask.id, dataToSend)
      : this.taskService.createTask(dataToSend);

    observable.subscribe({
      next: () => {
        const message = this.editingTask ? 'Задача обновлена' : 'Задача создана';
        this.snackBar.open(message, 'OK', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        this.modalVisible = false;
        this.editingTask = null;
        this.modalLoading = false;
        this.loadTasks();
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Ошибка сохранения задачи', 'OK', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.modalLoading = false;
      }
    });
  }

  handleModalCancel(): void {
    this.modalVisible = false;
    this.editingTask = null;
    this.viewMode = false;
  }

  onFiltersChange(filters: TaskFilterState): void {
    this.filters = filters;
    this.currentPage = 0;
    this.loadTasks();
  }

  handleFiltersChange(filters: TaskFilterState): void {
    this.filtersChangedSubject.next(filters);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTasks();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadTasks();
  }
}