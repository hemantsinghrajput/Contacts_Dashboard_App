import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { getLast6HoursStats } from '../utils/timestampTracker';
import Graph from '../components/Graph';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext'; // <- Your custom theme context hook

const StatsScreen: React.FC = () => {
  const [stats, setStats] = useState<{ hour: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const insets = useSafeAreaInsets();

  const { theme, colors, toggleTheme } = useTheme();

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getLast6HoursStats();
      setStats(data);
      setLoading(false);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      loadStats();
    }, [])
  );

  const getTotalFavorites = () =>
    stats.reduce((total, item) => total + item.count, 0);

  const getMostActiveHour = () => {
    if (stats.length === 0) return null;
    return stats.reduce((max, item) => (item.count > max.count ? item : max));
  };

  const getAverageActivity = () => {
    if (stats.length === 0) return 0;
    return Math.round((getTotalFavorites() / stats.length) * 10) / 10;
  };

  const hasData = stats.some(item => item.count > 0);

  const themedStyles = createStyles(colors);

  if (loading) {
    return (
      <SafeAreaView style={themedStyles.container}>
        <View style={themedStyles.backgroundGradient} />
        <View style={themedStyles.loaderContainer}>
          <View style={themedStyles.loaderCard}>
            <ActivityIndicator size="large" color="#9e9e9e" />
            <Text style={themedStyles.loaderText}>Loading statistics...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[themedStyles.container, { paddingTop: insets.top }]}>
      <View style={themedStyles.backgroundGradient} />
      <ScrollView contentContainerStyle={themedStyles.scrollContainer}>
        {/* Header with toggle */}
        <View style={themedStyles.header}>
          <Text style={themedStyles.title}>📊 Activity Dashboard</Text>
          <TouchableOpacity onPress={toggleTheme} style={themedStyles.themeToggle}>
            <Text style={themedStyles.toggleText}>
              {theme === 'light' ? '🌙 ' : '☀️'}
            </Text>
          </TouchableOpacity>
          <Text style={themedStyles.subtitle}>Last 6 hours statistics</Text>
        </View>

        {/* Stats Cards */}
        <Animated.View
          style={[
            themedStyles.statsCardsContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={themedStyles.statsCard}>
            <Text style={themedStyles.statIcon}>❤️</Text>
            <Text style={themedStyles.statNumber}>{getTotalFavorites()}</Text>
            <Text style={themedStyles.statLabel}>Total Favorites</Text>
          </View>

          <View style={themedStyles.statsCard}>
            <Text style={themedStyles.statIcon}>⚡</Text>
            <Text style={themedStyles.statNumber}>
              {getMostActiveHour()?.count ?? '0'}
            </Text>
            <Text style={themedStyles.statLabel}>
              Peak at {getMostActiveHour()?.hour ?? '-'}
            </Text>
          </View>

          <View style={themedStyles.statsCard}>
            <Text style={themedStyles.statIcon}>📈</Text>
            <Text style={themedStyles.statNumber}>{getAverageActivity()}</Text>
            <Text style={themedStyles.statLabel}>Avg/Hour</Text>
          </View>
        </Animated.View>

        {/* Graph */}
        <Animated.View
          style={[
            themedStyles.graphWrapper,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Graph data={stats} />
        </Animated.View>

        {/* Hourly Breakdown or Empty State */}
        {hasData ? (
          <View style={themedStyles.breakdown}>
            <Text style={themedStyles.breakdownTitle}>Hourly Breakdown</Text>
            {stats.map((item, index) => (
              <View key={index} style={themedStyles.statRow}>
                <Text style={themedStyles.statTime}>{item.hour}</Text>
                <View style={themedStyles.statBarContainer}>
                  <View
                    style={[
                      themedStyles.statBar,
                      {
                        width: `${(item.count /
                          Math.max(...stats.map(s => s.count))) *
                          100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={themedStyles.statValue}>{item.count}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={themedStyles.emptyContainer}>
            <Text style={themedStyles.emptyIcon}>📊</Text>
            <Text style={themedStyles.emptyText}>
              Start adding favorites to see activity.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsScreen;

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      paddingBottom: 40,
    },
    backgroundGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 250,
      backgroundColor: colors.primary,
      opacity: 0.05,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loaderCard: {
      backgroundColor: colors.card,
      padding: 48,
      borderRadius: 24,
      alignItems: 'center',
      elevation: 6,
    },
    loaderText: {
      marginTop: 20,
      fontSize: 18,
      color: colors.text,
      fontWeight: '600',
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '900',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: colors.subtext,
      fontWeight: '500',
    },
    themeToggle: {
      position: 'absolute',
      top: 30,
      right: 20,
    },
    toggleText: {
      fontSize: 16,
      color: colors.link,
    },
    statsCardsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 20,
      marginBottom: 24,
      gap: 12,
    },
    statsCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      elevation: 4,
    },
    statIcon: {
      fontSize: 24,
      marginBottom: 12,
    },
    statNumber: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
    },
    statLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.subtext,
    },
    graphWrapper: {
      marginHorizontal: 20,
      marginBottom: 24,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
    },
    breakdown: {
      marginHorizontal: 20,
      marginBottom: 40,
    },
    breakdownTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 12,
    },
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    statTime: {
      width: 60,
      color: colors.text,
      fontWeight: '600',
    },
    statBarContainer: {
      flex: 1,
      height: 8,
      backgroundColor: colors.muted,
      borderRadius: 4,
      marginHorizontal: 10,
      overflow: 'hidden',
    },
    statBar: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    statValue: {
      width: 30,
      textAlign: 'right',
      fontWeight: '600',
      color: colors.text,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 12,
    },
    emptyText: {
      fontSize: 16,
      color: colors.subtext,
      textAlign: 'center',
    },
  });
