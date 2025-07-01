import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMESTAMP_KEY = 'FAVORITE_TIMESTAMPS';

export const logFavoriteTimestamp = async () => {
  const hour = new Date().getHours().toString();
  const data = await AsyncStorage.getItem(TIMESTAMP_KEY);
  const parsed = data ? JSON.parse(data) : {};
  parsed[hour] = parsed[hour] ? parsed[hour] + 1 : 1;
  await AsyncStorage.setItem(TIMESTAMP_KEY, JSON.stringify(parsed));
};

export const getLast6HoursStats = async (): Promise<{ hour: string; count: number }[]> => {
  const now = new Date();
  const data = await AsyncStorage.getItem(TIMESTAMP_KEY);
  const parsed = data ? JSON.parse(data) : {};

  const result = [];
  for (let i = 5; i >= 0; i--) {
    const h = new Date(now.getTime() - i * 60 * 60 * 1000).getHours().toString();
    result.push({ hour: h, count: parsed[h] || 0 });
  }

  return result;
};
