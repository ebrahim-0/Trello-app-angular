import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../Models/task';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit {
  todo: Task = {} as Task;

  allTasks: Task[] = this.getStored('tasks');
  inProgressTasks: Task[] = this.getStored('inProgress');
  doneTasks: Task[] = this.getStored('done');

  isEditing: boolean = false;

  todoForm!: FormGroup;

  constructor(private _FormBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this._FormBuilder.group({
      title: ['', [Validators.required, Validators.pattern('.{3,}')]],
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.updateStorage('tasks', this.allTasks);
    this.updateStorage('inProgress', this.inProgressTasks);
    this.updateStorage('done', this.doneTasks);
  }

  addTask() {
    const task = {
      id: this.allTasks.length + 1,
      title: this.todoForm.value.title,
      completed: false,
    };

    this.allTasks.push(task);

    this.todoForm.reset();

    this.updateStorage('tasks', this.allTasks);

    this.getStored('tasks');
  }

  updateTask() {
    const index = this.allTasks.findIndex((t) => t.id === this.todo.id);
    if (index !== -1) {
      this.allTasks[index].title = this.todoForm.value.title;
      this.updateStorage('tasks', this.allTasks);

      this.isEditing = false;
    }

    this.todoForm.reset();

    this.getStored('tasks');
  }

  editTask(task: Task) {
    this.todo = task;
    this.todoForm.setValue({
      title: task.title,
    });

    this.isEditing = true;
  }

  deleteTask(tasks: Task[], taskId: number, status: string) {
    tasks.splice(taskId, 1);

    if (status === 'done') {
      this.updateStorage('done', tasks);
      this.doneTasks = this.getStored('done');
    } else if (status === 'inProgress') {
      this.updateStorage('inProgress', tasks);
      this.inProgressTasks = this.getStored('inProgress');
    } else {
      this.updateStorage('tasks', tasks);
      this.allTasks = this.getStored('tasks');
    }
  }

  private getStored(task: string): Task[] {
    const storedTasks = localStorage.getItem(task);
    return storedTasks ? JSON.parse(storedTasks) : [];
  }

  private updateStorage(task: string, tasks: Task[]): void {
    localStorage.setItem(task, JSON.stringify(tasks));
  }
}
