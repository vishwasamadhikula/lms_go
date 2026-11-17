import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { moodleApi } from '../services/api';
import { BookOpen, ChevronRight } from 'lucide-react-native';

export default function CoursesScreen({ navigation }: any) {
  const { token, user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async () => {
    if (!token || !user) return;
    try {
      const data = await moodleApi.getCourses(token, user.userid);
      setCourses(data);
    } catch (e: any) {
      console.error('Failed to load courses', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token, user]);

  return (
    <View className="flex-1 bg-[#090d16] px-4 pt-12">
      <View className="mb-4">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Welcome back,</Text>
        <Text className="text-2xl font-bold text-white">{user?.fullname || 'Student'}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" className="mt-20" />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchCourses();
              }}
              tintColor="#3b82f6"
            />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('CourseDetail', { course: item })}
              className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 mb-3 active:border-blue-500/50"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center space-x-2">
                  <View className="w-8 h-8 rounded-lg bg-blue-500/10 items-center justify-center mr-2">
                    <BookOpen size={16} color="#60a5fa" />
                  </View>
                  <Text className="text-blue-400 text-xs font-semibold tracking-wider">
                    {item.shortname}
                  </Text>
                </View>
                <ChevronRight size={18} color="#64748b" />
              </View>

              <Text className="text-white font-bold text-base leading-snug mb-3">
                {item.fullname}
              </Text>

              {/* Progress bar */}
              <View className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <View
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${item.progress ?? 0}%` }}
                />
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-slate-500 text-[10px]">Progress</Text>
                <Text className="text-slate-400 text-[10px] font-semibold">{item.progress ?? 0}%</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}