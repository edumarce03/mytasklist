import { inject, Injectable, signal } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Task, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private firestore = inject(Firestore);

  tasks = signal<Task[]>([]);
  private _isLoading = signal<boolean>(false);
  isLoading = this._isLoading.asReadonly();

  loadTasksByList(listId: string): void {
    this._isLoading.set(true);

    const tasksRef = collection(this.firestore, 'tasks');
    const listTasksQuery = query(
      tasksRef,
      where('listId', '==', listId),
      orderBy('createdAt', 'asc')
    );

    onSnapshot(listTasksQuery, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          listId: data['listId'],
          title: data['title'],
          description: data['description'],
          imageUrl: data['imageUrl'],
          startDate: data['startDate']?.toDate(),
          endDate: data['endDate']?.toDate(),
          difficulty: data['difficulty'],
          status: data['status'],
          createdAt: data['createdAt'].toDate(),
          updatedAt: data['updatedAt'].toDate(),
        } as Task;
      });

      this.tasks.set(tasks);
      this._isLoading.set(false);
    });
  }

  async createTask(
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    this._isLoading.set(true);

    try {
      const tasksRef = collection(this.firestore, 'tasks');
      const now = new Date();

      await addDoc(tasksRef, {
        ...task,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    if (!taskId) return;

    const taskRef = doc(this.firestore, 'tasks', taskId);
    try {
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    return this.updateTask(taskId, { status });
  }

  async deleteTask(taskId: string): Promise<void> {
    if (!taskId) return;

    const taskRef = doc(this.firestore, 'tasks', taskId);
    try {
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
}
