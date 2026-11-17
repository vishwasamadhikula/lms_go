import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions from the user
 */
export async function registerForPushNotificationsAsync(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Notification permissions not granted');
    return false;
  }

  // Set default notification channel for Android 8.0+
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('assignment-reminders', {
      name: 'Assignment Deadlines',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3b82f6',
    });
  }

  return true;
}

/**
 * Schedule 24-hour and 2-hour reminder alerts for a single assignment
 */
export async function scheduleAssignmentReminder(assignment: {
  id: number;
  name: string;
  courseName: string;
  duedate: number; // Unix timestamp in seconds
}) {
  const dueMs = assignment.duedate * 1000;
  const now = Date.now();

  // Intervals to alert: 24h before and 2h before
  const reminders = [
    { hoursBefore: 24, label: '24 hours remaining' },
    { hoursBefore: 2, label: '2 hours remaining! Submit soon' },
  ];

  for (const reminder of reminders) {
    const triggerTime = dueMs - reminder.hoursBefore * 60 * 60 * 1000;

    // Only schedule if the trigger time is still in the future
    if (triggerTime > now) {
      await Notifications.scheduleNotificationAsync({
        identifier: `assign-${assignment.id}-${reminder.hoursBefore}h`,
        content: {
          title: `Deadline: ${assignment.courseName}`,
          body: `"${assignment.name}" is due in ${reminder.label}.`,
          sound: true,
          data: { assignmentId: assignment.id },
          priority: Notifications.AndroidNotificationPriority.HIGH,
          channelId: 'assignment-reminders',
        },
        trigger: new Date(triggerTime),
      });
    }
  }
}

/**
 * Sync all fetched assignments: clears existing triggers and reschedules current deadlines
 */
export async function syncAssignmentNotifications(assignments: any[]) {
  // Cancel previous scheduled notifications to avoid duplicate stacking
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const item of assignments) {
    if (item.duedate) {
      await scheduleAssignmentReminder(item);
    }
  }
}