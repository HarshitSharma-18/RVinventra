import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function BillItemRow({ item, index, onRemove }) {
  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <Text style={styles.name}>{index + 1}. {item.name}</Text>
        <Text style={styles.subtext}>
          Qty: {item.quantity}  ×  ₹{item.rate}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <MaterialIcons name="delete-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  subtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981', 
    marginRight: 12,
  },
  removeBtn: {
    padding: 4,
  }
});
