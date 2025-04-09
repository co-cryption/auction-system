import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {const storedNotifications = JSON.parse(localStorage.getItem('buyerNotifications') || '[]');
  this.notificationsSubject.next(storedNotifications); 
  }
  addNotification(notification: any) {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [...currentNotifications, notification];

    localStorage.setItem('buyerNotifications', JSON.stringify(updatedNotifications));
    this.notificationsSubject.next(updatedNotifications);
  }
}
