import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-task-stats-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './task-stats-panel.html',
  styleUrl: './task-stats-panel.scss',
})
export class TaskStatsPanel {
  @Input() totalTasks = 0;
  @Input() completedTasks = 0;
  @Input() pendingTasks = 0;
  @Input() inProgressTasks = 0;
}