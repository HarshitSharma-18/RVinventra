import AsyncStorage from '@react-native-async-storage/async-storage';

const BILLS_KEY = '@shop_bills';

export const saveBill = async (billData) => {
  try {
    const existingBills = await getBills();
    const newBills = [...existingBills, billData];
    await AsyncStorage.setItem(BILLS_KEY, JSON.stringify(newBills));
    return true;
  } catch (error) {
    console.error('Error saving bill:', error);
    return false;
  }
};

export const getBills = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(BILLS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error fetching bills:', error);
    return [];
  }
};

export const getSalesAnalytics = async () => {
  const bills = await getBills();
  const analytics = {}; 

  bills.forEach(bill => {
    bill.items.forEach(item => {
      if (!analytics[item.name]) {
        analytics[item.name] = { quantity: 0, revenue: 0 };
      }
      analytics[item.name].quantity += parseFloat(item.quantity);
      analytics[item.name].revenue += parseFloat(item.amount);
    });
  });

  return Object.keys(analytics).map(key => ({
    name: key,
    quantity: analytics[key].quantity,
    revenue: analytics[key].revenue
  })).sort((a, b) => b.revenue - a.revenue);
};
