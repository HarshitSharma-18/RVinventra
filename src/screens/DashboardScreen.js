import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { getSalesAnalytics } from '../services/storage';

export default function DashboardScreen() {
  const [analytics, setAnalytics] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setRefreshing(true);
    const data = await getSalesAnalytics();
    setAnalytics(data);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = analytics.reduce((sum, item) => sum + item.revenue, 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Qty Sold</Text>
          <Text style={styles.statValue}>{item.quantity}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Revenue</Text>
          <Text style={styles.statValueRevenue}>₹{item.revenue.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>Total Revenue</Text>
        <Text style={styles.summaryAmount}>₹{totalRevenue.toFixed(2)}</Text>
      </View>
      
      <Text style={styles.listTitle}>Item-wise Sales</Text>
      <FlatList
        data={analytics}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No sales data available yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  summaryHeader: {
    backgroundColor: '#4F46E5',
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    color: '#e0e7ff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryAmount: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  statValueRevenue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
    fontSize: 16,
  }
});
