import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldCheck, Server } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, token, logout } = useAuth();

  return (
    <View className="flex-1 bg-[#090d16] px-6 pt-16">
      <View className="items-center mb-8">
        {user?.userpictureurl ? (
          <Image
            source={{ uri: `${user.userpictureurl}?token=${token}` }}
            className="w-20 h-20 rounded-full border-2 border-blue-500 mb-3"
          />
        ) : (
          <View className="w-20 h-20 rounded-full bg-slate-800 items-center justify-center mb-3">
            <Text className="text-2xl text-blue-400 font-bold">
              {user?.fullname?.charAt(0) || 'U'}
            </Text>
          </View>
        )}
        <Text className="text-xl font-bold text-white">{user?.fullname}</Text>
        <Text className="text-slate-400 text-xs mt-1">Student ID: {user?.userid}</Text>
      </View>

      <View className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <Server size={16} color="#60a5fa" />
          <Text className="text-slate-300 text-xs ml-2 font-mono">lms.tech.sjp.ac.lk</Text>
        </View>
        <View className="flex-row items-center">
          <ShieldCheck size={16} color="#4ade80" />
          <Text className="text-slate-300 text-xs ml-2">REST Token Active</Text>
        </View>
      </View>

      <Pressable
        onPress={logout}
        className="bg-red-500/10 border border-red-500/30 py-3.5 rounded-xl items-center flex-row justify-center mt-auto mb-10"
      >
        <LogOut size={18} color="#f87171" />
        <Text className="text-red-400 font-semibold text-sm ml-2">Sign Out of LMS</Text>
      </Pressable>
    </View>
  );
}