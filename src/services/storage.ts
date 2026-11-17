import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'moodle_token';
const USER_KEY = 'moodle_user_profile';

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const saveUserProfile = async (data: any) => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data));
};

export const getUserProfile = async (): Promise<any | null> => {
  const profile = await SecureStore.getItemAsync(USER_KEY);
  return profile ? JSON.parse(profile) : null;
};

export const clearSession = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
};