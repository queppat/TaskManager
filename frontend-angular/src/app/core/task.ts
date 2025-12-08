import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  deadline?: string;
  createdAt?: string;
}

export interface TaskPage {
  content: TaskItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface TaskFilters {
  title?: string;
  status?: string;
  deadline?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  deadline?: string | null;
}

export type UpdateTaskData = CreateTaskData;

@Injectable({
  providedIn: 'root',
})
export class Task {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/tasks';

  getAllTasks(
    page: number = 0,
    size: number = 10,
    filters: TaskFilters = {},
    sort: string = 'createdAt,desc',
  ): Observable<TaskPage> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    if (filters.title) {
      params = params.set('title', filters.title);
    }

    if (filters.status) {
      params = params.set('status', filters.status);
    }

    if (filters.deadline) {
      params = params.set('deadline', filters.deadline);
    }

    return this.http.get<TaskPage>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  createTask(taskData: CreateTaskData): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, taskData).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  updateTask(taskId: number, updateData: UpdateTaskData): Observable<TaskItem> {
    return this.http.patch<TaskItem>(`${this.apiUrl}/${taskId}`, updateData).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}