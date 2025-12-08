import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-task-pagination',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './task-pagination.html',
  styleUrls: ['./task-pagination.scss']
})
export class TaskPaginationComponent {
  @Input() currentPage = 0;
  @Input() pageSize = 10;
  @Input() totalTasks = 0;
  @Input() showQuickJumper = true;
  @Input() showTotal = true;
  @Input() align: 'left' | 'center' | 'right' = 'right';
  @Input() pageSizeOptions = [5, 10, 20, 50, 100];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  quickJumpPage: number | null = null;

  get totalPages(): number {
    return Math.ceil(this.totalTasks / this.pageSize);
  }

  get alignmentClass(): string {
    return `align-${this.align}`;
  }

  get displayCurrentPage(): number {
    return this.currentPage + 1;
  }

  get startItem(): number {
    if (this.totalTasks === 0) return 0;
    return (this.currentPage * this.pageSize) + 1;
  }

  get endItem(): number {
    const end = (this.currentPage + 1) * this.pageSize;
    return Math.min(end, this.totalTasks);
  }

  get rangeText(): string {
    return `Задачи ${this.startItem}-${this.endItem} из ${this.totalTasks}`;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  handleQuickJump(): void {
    if (this.quickJumpPage !== null) {
      const page = this.quickJumpPage - 1;
      if (page >= 0 && page < this.totalPages) {
        this.pageChange.emit(page);
      }
      this.quickJumpPage = null;
    }
  }

  onPageSizeChangeHandler(newSize: number): void {
    this.pageSizeChange.emit(newSize);
  }

  isFirstPage(): boolean {
    return this.currentPage === 0;
  }

  isLastPage(): boolean {
    return this.currentPage >= this.totalPages - 1;
  }

  getPageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total === 0) return [];

    if (total <= 3) {
      return Array.from({ length: total }, (_, i) => i);
    }

    const pages = new Set<number>([0, total - 1]);

    pages.add(current);

    if (pages.size === 2) {
      if (current === 0) {
        pages.add(1);
      } else if (current === total - 1) {
        pages.add(total - 2);
      } else {
        pages.add(current - 1);
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  }
}