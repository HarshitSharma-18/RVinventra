import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';

export const exportBillsToExcel = async (bills) => {
  try {
    const excelData = [];
    
    bills.forEach(bill => {
      bill.items.forEach(item => {
        excelData.push({
          Date: bill.date,
          'Customer Name': bill.customerName,
          'Mode of Payment': bill.paymentMode,
          'Item Name': item.name,
          'Quantity': item.quantity,
          'Rate': item.rate,
          'Amount': item.amount
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bills');

    const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    
    const uri = FileSystem.documentDirectory + 'ShopBills.xlsx';
    await FileSystem.writeAsStringAsync(uri, wbout, {
       encoding: FileSystem.EncodingType.Base64
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Export Bills to Excel',
        UTI: 'com.microsoft.excel.xls'
      });
    } else {
      alert('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export to Excel');
  }
};
