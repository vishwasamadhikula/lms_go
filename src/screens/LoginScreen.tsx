import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Key, Lock, User } from 'lucide-react-native';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [isTokenMode, setIsTokenMode] = useState(false);

  const handleLogin = async () => {
    try {
      if (isTokenMode) {
        if (!tokenInput.trim()) return Alert.alert('Required', 'Please enter your wstoken');
        await login({ directToken: tokenInput.trim() });
      } else {
        if (!username || !password) return Alert.alert('Required', 'Enter Student ID and Password');
        await login({ username: username.trim(), password });
      }
    } catch (err: any) {
      Alert.alert('Authentication Failed', err.message || 'Check credentials or token');
    }
  };

  return (
    <View className="flex-1 bg-[#090d16] justify-center px-6">
      <View className="items-center mb-8">
        <View className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 items-center justify-center mb-3">
          <GraduationCap size={34} color="#60a5fa" />
        </View>
        <Text className="text-2xl font-bold text-white tracking-wide">FOT LMS Mobile</Text>
        <Text className="text-slate-400 text-sm mt-1">University of Sri Jayewardenepura</Text>
      </View>

      <View className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl">
        {!isTokenMode ? (
          <>
            <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 mb-3">
              <User size={18} color="#94a3b8" />
              <TextInput
                placeholder="Student Registration No (e.g. TE...)"
                placeholderTextColor="#64748b"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                className="flex-1 ml-3 text-white text-sm"
              />
            </View>

            <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 mb-5">
              <Lock size={18} color="#94a3b8" />
              <TextInput
                placeholder="LMS Password"
                placeholderTextColor="#64748b"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="flex-1 ml-3 text-white text-sm"
              />
            </View>
          </>
        ) : (
          <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 mb-5">
            <Key size={18} color="#3b82f6" />
            <TextInput
              placeholder="Paste 32-character Moodle wstoken"
              placeholderTextColor="#64748b"
              value={tokenInput}
              onChangeText={setTokenInput}
              autoCapitalize="none"
              className="flex-1 ml-3 text-white text-sm font-mono"
            />
          </View>
        )}

        <Pressable
          onPress={handleLogin}
          disabled={isLoading}
          className="bg-blue-600 active:bg-blue-700 py-3.5 rounded-xl items-center flex-row justify-center"
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              {isTokenMode ? 'Connect with Token' : 'Sign In'}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => setIsTokenMode(!isTokenMode)}
          className="mt-4 py-2 items-center"
        >
          <Text className="text-blue-400 text-xs font-medium">
            {isTokenMode ? 'Use Student ID & Password instead' : 'Have a generated wstoken? Enter token'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}