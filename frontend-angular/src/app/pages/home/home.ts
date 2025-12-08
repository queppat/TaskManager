import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  features = [
    {
      icon: 'check_circle',
      title: 'Управление задачами',
      description: 'Создавайте, редактируйте и отслеживайте задачи в удобном интерфейсе',
      color: '#52c41a',
    },
    {
      icon: 'people',
      title: 'Простая коллаборация',
      description: 'Идеально для личного использования и небольших команд',
      color: '#1890ff',
    },
    {
      icon: 'rocket_launch',
      title: 'Высокая производительность',
      description: 'Современное, быстрое приложение с современным дизайном',
      color: '#faad14',
    },
    {
      icon: 'lock',
      title: 'Безопасность',
      description: 'Надежная аутентификация и защита данных',
      color: '#ff4d4f',
    }
  ];

  technologies = [
    { name: 'Angular', color: 'blue' },
    { name: 'Spring Boot', color: 'green' },
    { name: 'PostgreSQL', color: 'volcano' },
    { name: 'Docker', color: 'cyan' },
    { name: 'Angular Material', color: 'geekblue' },
  ];

  getTechColor(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      'blue': '#1890ff',
      'green': '#52c41a',
      'volcano': '#fa541c',
      'cyan': '#13c2c2',
      'geekblue': '#2f54eb',
      'default': '#d9d9d9'
    };

    return colorMap[colorName] || colorMap['default'];
  }
}