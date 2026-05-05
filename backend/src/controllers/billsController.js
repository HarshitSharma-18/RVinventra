// Removed global supabase import in favor of req.supabase for verified user isolation
// Removed ownership module in favor of database user_id column

exports.getBills = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { data: txs, error } = await req.supabase
      .from('transactions')
      .select('*, transaction_items(quantity, price, items(id, name, category))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const mappedTxs = txs.map(tx => ({
      id: tx.id,
      customerName: tx.customer_name,
      customerPhone: tx.contact_number,
      timestamp: new Date(tx.created_at).getTime(),
      paymentMode: tx.payment_method,
      totalAmount: Number(tx.total_amount),
      items: tx.transaction_items.map(ti => ({
         inventoryId: ti.items?.id,
         name: ti.items?.name || 'Unknown Item',
         category: ti.items?.category || 'Other',
         quantity: ti.quantity,
         rate: Number(ti.price),
         amount: ti.quantity * Number(ti.price)
      }))
    }));

    return res.status(200).json(mappedTxs);
  } catch (err) { 
    console.error('Supabase fetch Bills error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.saveBill = async (req, res) => {
  try {
    const billData = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    // 1. Insert transaction
    const { data: txData, error: txError } = await req.supabase
      .from('transactions')
      .insert({
         customer_name: billData.customerName,
         contact_number: billData.customerPhone,
         total_amount: billData.totalAmount,
         payment_method: billData.paymentMode,
         user_id: userId
      })
      .select('id')
      .single();

    if (txError) throw txError;
    const transactionId = txData.id;

    // 2. Insert transaction items
    const lineItems = billData.items.map(item => ({
       transaction_id: transactionId,
       item_id: item.inventoryId,
       quantity: item.quantity,
       price: item.rate
    }));

    const { error: lineError } = await req.supabase.from('transaction_items').insert(lineItems);
    if (lineError) throw lineError;

    // 3. Atomically Deduct stock bounds using our isolated RPC function call
    for (const item of billData.items) {
       await req.supabase.rpc('deduct_stock', { p_item_id: item.inventoryId, p_quantity: item.quantity });
    }

    return res.status(200).json({ success: true, transactionId });
  } catch (err) {
    console.error('Save bill error:', err);
    return res.status(500).json({ error: err.message });
  }
};
