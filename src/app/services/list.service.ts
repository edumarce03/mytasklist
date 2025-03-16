import { effect, inject, Injectable, signal } from '@angular/core';
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
import { AuthService } from './auth.service';
import { TaskList } from '../models/list.model';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  lists = signal<TaskList[]>([]);
  private _isCreating = signal<boolean>(false);

  isCreating = this._isCreating.asReadonly();

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadLists(user.uid);
      } else {
        this.lists.set([]);
      }
    });
  }

  private loadLists(userId: string): void {
    const listsRef = collection(this.firestore, 'lists');
    const userListsQuery = query(
      listsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    onSnapshot(userListsQuery, (snapshot) => {
      const lists = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data['name'],
          emoji: data['emoji'],
          userId: data['userId'],
          createdAt: data['createdAt'].toDate(),
        } as TaskList;
      });

      this.lists.set(lists);
    });
  }

  async createList(name: string, emoji?: string): Promise<void> {
    const userId = this.authService.currentUser()?.uid;
    if (!userId) return;

    this._isCreating.set(true);

    try {
      const listsRef = collection(this.firestore, 'lists');
      await addDoc(listsRef, {
        name,
        emoji,
        userId,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error creating list:', error);
    } finally {
      this._isCreating.set(false);
    }
  }

  async updateList(
    listId: string | undefined,
    name: string,
    emoji?: string
  ): Promise<void> {
    if (!listId) return;

    const listRef = doc(this.firestore, 'lists', listId);
    try {
      const updateData: { name: string; emoji?: string } = { name };
      if (emoji !== undefined) {
        updateData.emoji = emoji;
      }
      await updateDoc(listRef, updateData);
    } catch (error) {
      console.error('Error updating list:', error);
    }
  }

  async deleteList(listId: string | undefined): Promise<void> {
    if (!listId) return;

    const listRef = doc(this.firestore, 'lists', listId);
    try {
      await deleteDoc(listRef);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  }
}
