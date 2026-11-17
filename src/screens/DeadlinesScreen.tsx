import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { moodleApi } from '../services/api';
import {
  registerForPushNotificationsAsync,
  syncAssignmentNotifications
} from '../services/notifications';
import { Clock, AlertCircle, Bell } from 'lucide-react-native';

export default function DeadlinesScreen() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1. Request permission
        await registerForPushNotificationsAsync();

        // 2. Fetch assignments from Moodle
        const res = await moodleApi.getAssignments(token!);
        const list: any[] = [];
        res.courses.forEach((c: any) => {
          c.assignments.forEach((a: any) => {
            list.push({ ...a, courseName: c.shortname });
          });
        });

        // Filter out past assignments and sort
        const pending = list
          .filter((a) => a.duedate * 1000 > Date.now())
          .sort((a, b) => a.duedate - b.duedate);

        setAssignments(pending);

        // 3. Schedule the OS alerts
        await syncAssignmentNotifications(pending);
      } catch (e: any) {
        console.error('Failed to sync assignments or schedule alerts', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <View className="flex-1 bg-[#090d16] px-4 pt-12">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-white">Deadlines & Tasks</Text>
        <View className="flex-row items-center bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-full">
          <Bell size={12} color="#60a5fa" />
          <Text className="text-blue-400 text-xs ml-1 font-semibold">Reminders Active</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" className="mt-20" />
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const dueDate = new Date(item.duedate * 1000);
            const isUrgent = item.duedate * 1000 - Date.now() < 3 * 24 * 60 * 60 * 1000;

            return (
              <View className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-3">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-blue-400 text-xs font-semibold">{item.courseName}</Text>
                  {isUrgent && (
                    <View className="flex-row items-center bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/30">
                      <AlertCircle size={12} color="#f87171" />
                      <Text className="text-red-400 text-[10px] font-bold ml-1">Due Soon</Text>
                    </View>
                  )}
                </View>
                <Text className="text-white font-bold text-base mb-2">{item.name}</Text>
                <View className="flex-row items-center">
                  <Clock size={14} color="#94a3b8" />
                  <Text className="text-slate-400 text-xs ml-1.5">
                    {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}