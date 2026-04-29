const fs = require('fs');
const path = require('path');

const ownershipPath = path.join(__dirname, '../../data/ownership.json');

const initOwnership = () => {
  const dir = path.dirname(ownershipPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(ownershipPath)) {
    fs.writeFileSync(ownershipPath, JSON.stringify({ items: {}, transactions: {} }));
  }
};

const getOwnership = () => {
  initOwnership();
  try {
    return JSON.parse(fs.readFileSync(ownershipPath, 'utf8'));
  } catch(e) {
    return { items: {}, transactions: {} };
  }
};

const saveOwnership = (data) => {
  initOwnership();
  fs.writeFileSync(ownershipPath, JSON.stringify(data, null, 2));
};

exports.assignOwnership = (userId, type, entityId) => {
  if (!userId) return;
  const data = getOwnership();
  if (!data[type]) data[type] = {};
  if (!data[type][userId]) data[type][userId] = [];
  if (!data[type][userId].includes(entityId)) {
    data[type][userId].push(entityId);
    saveOwnership(data);
  }
};

exports.getOwnedIds = (userId, type) => {
  if (!userId) return [];
  const data = getOwnership();
  if (!data[type]) return [];
  return data[type][userId] || [];
};

exports.removeOwnership = (userId, type, entityId) => {
  if (!userId) return;
  const data = getOwnership();
  if (data[type] && data[type][userId]) {
    data[type][userId] = data[type][userId].filter(id => id !== entityId);
    saveOwnership(data);
  }
};
