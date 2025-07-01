import React, { useCallback, useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView, 
  Text, 
  ScrollView,
  Dimensions,
  Animated 
} from 'react-native';
import { getLast6HoursStats } from '../utils/timestampTracker';
import Graph from '../components/Graph';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const StatsScreen: React.FC = () => {
  const [stats, setStats] = useState<{ hour: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const insets = useSafeAreaInsets();

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getLast6HoursStats();
      setStats(data);
      setLoading(false);
      
      // Start animations when data is loaded
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
        })
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


  const getTotalFavorites = () => {
    return stats.reduce((total, item) => total + item.count, 0);
  };

  const getMostActiveHour = () => {
    if (stats.length === 0) return null;
    return stats.reduce((max, item) => item.count > max.count ? item : max);
  };

  const getAverageActivity = () => {
    if (stats.length === 0) return 0;
    return Math.round(getTotalFavorites() / stats.length * 10) / 10;
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerGradient}>
        <Text style={styles.title}>📊 Activity Dashboard</Text>
        <Text style={styles.subtitle}>Last 6 hours statistics</Text>
      </View>
    </View>
  );

  const renderStatsCards = () => {
    const totalFavorites = getTotalFavorites();
    const mostActiveHour = getMostActiveHour();
    const averageActivity = getAverageActivity();

    return (
      <Animated.View 
        style={[
          styles.statsCardsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.statsCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#fee2e2' }]}>
            <Text style={styles.statIcon}>❤️</Text>
          </View>
          <Text style={styles.statNumber}>{totalFavorites}</Text>
          <Text style={styles.statLabel}>Total Favorites</Text>
          <Text style={styles.statSubtext}>Last 6 hours</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#dbeafe' }]}>
            <Text style={styles.statIcon}>⚡</Text>
          </View>
          <Text style={styles.statNumber}>
            {mostActiveHour ? mostActiveHour.count : '0'}
          </Text>
          <Text style={styles.statLabel}>Peak Activity</Text>
          <Text style={styles.statSubtext}>
            {mostActiveHour ? `at ${mostActiveHour.hour}` : 'No activity'}
          </Text>
        </View>

        <View style={styles.statsCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#dcfce7' }]}>
            <Text style={styles.statIcon}>📈</Text>
          </View>
          <Text style={styles.statNumber}>{averageActivity}</Text>
          <Text style={styles.statLabel}>Average/Hour</Text>
          <Text style={styles.statSubtext}>Activity rate</Text>
        </View>
      </Animated.View>
    );
  };

  const renderGraph = () => (
    <Animated.View 
      style={[
        styles.graphContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>📊 Activity Timeline</Text>
        <Text style={styles.graphSubtitle}>Favorites added per hour</Text>
        <View style={styles.graphWrapper}>
          <Graph data={stats} />
        </View>
      </View>
    </Animated.View>
  );

  const renderDetailedStats = () => (
    <Animated.View 
      style={[
        styles.detailedStatsContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.detailedStatsTitle}>Hourly Breakdown</Text>
      {stats.map((item, index) => (
        <View key={index} style={styles.statRow}>
          <View style={styles.statTimeContainer}>
            <Text style={styles.statTime}>{item.hour}</Text>
          </View>
          <View style={styles.statBarContainer}>
            <View 
              style={[
                styles.statBar, 
                { 
                  width: `${Math.max((item.count / Math.max(...stats.map(s => s.count))) * 100, 5)}%`,
                  backgroundColor: item.count > 0 ? '#667eea' : '#e5e7eb'
                }
              ]} 
            />
          </View>
          <Text style={styles.statValue}>{item.count}</Text>
        </View>
      ))}
    </Animated.View>
  );

  const renderEmptyState = () => (
    <Animated.View 
      style={[
        styles.emptyStateContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.emptyStateCard}>
        <Text style={styles.emptyStateIcon}>📊</Text>
        <Text style={styles.emptyStateTitle}>No Activity Data</Text>
        <Text style={styles.emptyStateText}>
          Start adding contacts to favorites to see your activity statistics here.
        </Text>
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.backgroundGradient} />
        <View style={styles.loaderContainer}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loaderText}>Loading statistics...</Text>
            <View style={styles.loaderDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const hasData = stats.some(item => item.count > 0);

  return (
    <SafeAreaView style={[styles.container,{paddingTop: insets.top,}]}>
      <View style={styles.backgroundGradient} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        
        {hasData ? (
          <>
            {renderStatsCards()}
            {renderGraph()}
            {renderDetailedStats()}
          </>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    backgroundColor: '#667eea',
    opacity: 0.08,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCard: {
    backgroundColor: '#ffffff',
    padding: 48,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  loaderText: {
    marginTop: 20,
    fontSize: 18,
    color: '#4a5568',
    fontWeight: '600',
  },
  loaderDots: {
    flexDirection: 'row',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#667eea',
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.3,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 1,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerGradient: {
    backgroundColor: '#667eea',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 32,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    fontWeight: '500',
  },
  statsCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIcon: {
    fontSize: 24,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1a202c',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4a5568',
    marginBottom: 2,
    textAlign: 'center',
  },
  statSubtext: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
  },
  graphContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  graphCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  graphTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 4,
  },
  graphSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    fontWeight: '500',
  },
  graphWrapper: {
    minHeight: 200,
  },
  detailedStatsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  detailedStatsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 20,
    paddingLeft: 4,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statTimeContainer: {
    width: 80,
  },
  statTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4a5568',
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
    minWidth: 30,
    textAlign: 'right',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  emptyStateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 12,
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  emptyStateIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
});