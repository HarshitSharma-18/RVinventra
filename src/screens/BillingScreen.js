import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import BillItemRow from '../components/BillItemRow';
import { saveBill, getBills } from '../services/storage';
import { exportBillsToExcel } from '../services/export';

export default function BillingScreen({ navigation }) {
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [paymentMode, setPaymentMode] = useState('Cash'); // Cash, UPI, Card
  
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('');
  const [itemRate, setItemRate] = useState('');

  const handleAddItem = () => {
    if (!itemName || !itemQty || !itemRate) {
      Alert.alert('Validation Error', 'Please fill all item fields');
      return;
    }
    const qty = parseFloat(itemQty);
    const rate = parseFloat(itemRate);
    if (isNaN(qty) || isNaN(rate)) {
      Alert.alert('Validation Error', 'Quantity and Rate must be numbers');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: itemName,
      quantity: qty,
      rate: rate,
      amount: qty * rate
    };

    setItems([...items, newItem]);
    setItemName('');
    setItemQty('');
    setItemRate('');
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const handleConfirmPayment = async () => {
    if (!customerName) {
      Alert.alert('Validation Error', 'Please enter customer name');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one item');
      return;
    }

    const billData = {
      id: Date.now().toString(),
      customerName,
      date,
      paymentMode,
      items,
      totalAmount
    };

    const success = await saveBill(billData);
    if (success) {
      Alert.alert(
        'Success', 
        'Payment Confirmed and Bill Saved!',
        [
          { text: 'OK', onPress: () => exportAndClear() }
        ]
      );
    }
  };

  const exportAndClear = async () => {
    const allBills = await getBills();
    await exportBillsToExcel(allBills);
    
    // Clear Form
    setCustomerName('');
    setItems([]);
    setPaymentMode('Cash');
    setDate(new Date().toLocaleDateString());
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <CustomInput label="Customer Name" value={customerName} onChangeText={setCustomerName} placeholder="Enter name" />
          <View style={styles.row}>
            <CustomInput label="Date" value={date} onChangeText={setDate} style={styles.halfInput} />
            <CustomInput label="Mode" value={paymentMode} onChangeText={setPaymentMode} placeholder="Cash/UPI/Card" style={styles.halfInput} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Item</Text>
          <CustomInput label="Item Name" value={itemName} onChangeText={setItemName} placeholder="E.g. Books" />
          <View style={styles.row}>
            <CustomInput label="Qty" value={itemQty} onChangeText={setItemQty} keyboardType="numeric" style={styles.halfInput} />
            <CustomInput label="Rate (₹)" value={itemRate} onChangeText={setItemRate} keyboardType="numeric" style={styles.halfInput} />
          </View>
          <CustomButton title="Add to Cart" onPress={handleAddItem} type="secondary" />
        </View>

        <View style={styles.section}>
          <View style={styles.cartHeader}>
             <Text style={styles.sectionTitle}>Cart Items</Text>
             <Text style={styles.itemCount}>{items.length} items</Text>
          </View>
          {items.map((item, index) => (
            <BillItemRow key={item.id} item={item} index={index} onRemove={() => removeItem(item.id)} />
          ))}
          {items.length === 0 && (
             <Text style={styles.emptyText}>No items added yet.</Text>
          )}
        </View>

      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
        </View>
        <CustomButton title="Confirm Payment" onPress={handleConfirmPayment} />
        <CustomButton 
          title="View Analytics" 
          onPress={() => navigation.navigate('Dashboard')} 
          type="secondary" 
          style={{marginTop: 10}}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemCount: {
    color: '#6b7280',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
  }
});
