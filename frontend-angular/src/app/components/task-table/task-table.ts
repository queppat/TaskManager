import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { TaskItem } from '../../core/task';
import dayjs from 'dayjs';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatChipsModule
  ],
  templateUrl: './task-table.html',
  styleUrls: ['./task-table.scss']
})
export class TaskTableComponent {
  @Input() tasks: TaskItem[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<TaskItem>();
  @Output() remove = new EventEmitter<number>();
  @Output() view = new EventEmitter<TaskItem>();

  displayedColumns: string[] = ['title', 'description', 'status', 'createdAt', 'deadline', 'actions'];

  statusColors: { [key: string]: string } = {
    'TODO': '#d1b721ff',
    'IN_PROGRESS': '#73b2ecff',
    'DONE': '#9cee73ff'
  };

  statusLabels: { [key: string]: string } = {
    'TODO': 'Сделать',
    'IN_PROGRESS': 'В процессе',
    'DONE': 'Выполнено'
  };

  constructor(private readonly dialog: MatDialog) { }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'DONE': return 'check_circle';
      case 'IN_PROGRESS':
      case 'TODO': return 'schedule';
      default: return 'help';
    }
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '—';
    return dayjs(dateString).format('DD.MM.YYYY HH:mm');
  }

  onEdit(task: TaskItem): void {
    this.edit.emit(task);
  }

  onView(task: TaskItem): void {
    this.view.emit(task);
  }

  openDeleteDialog(task: TaskItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '400px',
      data: { taskTitle: task.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.remove.emit(task.id);
      }
    });
  }
}

export interface DeleteDialogData {
  taskTitle: string;
}

@Component({
  selector: 'delete-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Удалить задачу?</h2>
    <mat-dialog-content>
      Вы уверены, что хотите удалить задачу "{{ data.taskTitle }}"?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Нет</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Да</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule]
})
export class DeleteConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) { }
}