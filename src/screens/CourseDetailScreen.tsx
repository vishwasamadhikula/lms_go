import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { moodleApi } from '../services/api';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { FileText, Download, CheckCircle, ArrowLeft } from 'lucide-react-native';

export default function CourseDetailScreen({ route, navigation }: any) {
  const { course } = route.params;
  const { token } = useAuth();
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const contents = await moodleApi.getCourseContents(token!, course.id);
        const formatted = contents.map((sec: any) => ({
          title: sec.name,
          data: sec.modules.filter((m: any) => m.modname === 'resource' || m.modname === 'assign'),
        }));
        setSections(formatted);
      } catch (err: any) {
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [course.id]);

  const handleDownloadFile = async (module: any) => {
    if (!module.contents || module.contents.length === 0) return;
    const file = module.contents[0];
    const authenticatedUrl = moodleApi.getFileDownloadUrl(file.fileurl, token!);
    const localUri = `${FileSystem.documentDirectory}${file.filename}`;

    try {
      setDownloadingId(module.id);
      const downloadRes = await FileSystem.downloadAsync(authenticatedUrl, localUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadRes.uri);
      } else {
        Alert.alert('Saved', `File saved to ${downloadRes.uri}`);
      }
    } catch (e: any) {
      Alert.alert('Download Error', e.message);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <View className="flex-1 bg-[#090d16] px-4 pt-12">
      <Pressable onPress={() => navigation.goBack()} className="flex-row items-center mb-4">
        <ArrowLeft size={18} color="#94a3b8" />
        <Text className="text-slate-400 text-sm ml-2">Back</Text>
      </Pressable>

      <Text className="text-blue-400 font-semibold text-xs tracking-wider">{course.shortname}</Text>
      <Text className="text-xl font-bold text-white mb-4">{course.fullname}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" className="mt-20" />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-slate-300 font-semibold text-sm bg-[#090d16] py-2 mt-3">{title}</Text>
          )}
          renderItem={({ item }) => (
            <View className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 mr-2">
                <FileText size={18} color="#60a5fa" />
                <Text className="text-slate-200 text-sm font-medium ml-2.5 flex-1" numberOfLines={1}>
                  {item.name}
                </Text>
              </View>

              {item.modname === 'resource' && (
                <Pressable
                  onPress={() => handleDownloadFile(item)}
                  className="bg-slate-800 p-2 rounded-lg items-center justify-center"
                >
                  {downloadingId === item.id ? (
                    <ActivityIndicator size="small" color="#60a5fa" />
                  ) : (
                    <Download size={16} color="#94a3b8" />
                  )}
                </Pressable>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}