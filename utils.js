// ========================================
// 工具函式
// ========================================

const dayjs = require('dayjs');

/**
 * 計算產品折扣率
 * @param {Object} product - 產品物件
 * @returns {string} - 例如 '8折'
 */
function getDiscountRate(product) {
  // 請實作此函式
  const discount = Math.round([product.price/product.origin_price*10])
  return `${discount}折`
}

/**
 * 取得所有產品分類（不重複）
 * @param {Array} products - 產品陣列
 * @returns {Array} - 分類陣列
 */
function getAllCategories(products) {
  // 請實作此函式
  //使用reduce
  const categories = products.reduce((acc, item) => [...acc,item.category],[]);
  return [...new Set(categories)];
}

/**
 * 格式化日期
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - 格式 'YYYY/MM/DD HH:mm'，例如 '2024/01/01 08:00'
 */
function formatDate(timestamp) {
  // 請實作此函式
  // 提示：dayjs.unix...
  return dayjs.unix(timestamp).format('YYYY/MM/DD HH:mm')
}

/**
 * 計算距今天數
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - 例如 '3 天前'
 */
function getDaysAgo(timestamp) {
  // 請實作此函式
  // 提示：
  // 1. 用 dayjs() 取得今天
  // 2. 用 dayjs.unix(timestamp) 取得日期
  // 3. 用 .diff() 計算天數差異
  const today = dayjs();
  const pastDate = dayjs.unix(timestamp);
  const diffDays = today.diff(pastDate,'day');
  if(diffDays === 0){
    return '今天'
  }
  return `${diffDays}天前`
}

/**
 * 驗證訂單使用者資料
 * @param {Object} data - 使用者資料
 * @returns {Object} - { isValid: boolean, errors: string[] }
 * 
 * 驗證規則：
 * - name: 不可為空
 * - tel: 必須是 09 開頭的 10 位數字
 * - email: 必須包含 @ 符號
 * - address: 不可為空
 * - payment: 必須是 'ATM', 'Credit Card', 'Apple Pay' 其中之一
 */
function validateOrderUser(data) {
  // 請實作此函式
  let errors = [];
  if(!data.name || data.name.trim() === ''){
    errors.push('姓名不可為空');
  };
  if(!data.tel || !/^09\d{8}$/.test(data.tel)){
    errors.push('電話號碼必須是 09 開頭的 10 位數字')
  };
  if(!data.email || !data.email.includes('@')){
    errors.push('E-mail必須包含 @ 符號')
  }
  if(!data.address || data.address.trim() === ''){
    errors.push('地址不可為空');
  };
  if(data.payment !== 'ATM'  && data.payment !== 'Credit Card'  &&data.payment !== 'Apple Pay'){
    errors.push('支付方式必須是 ATM, Credit Card, Apple Pay其中之一')
  }
  if(errors.length > 0){
    return { isValid: false, errors }
  }
  return { isValid: true, errors }
}

/**
 * 驗證購物車數量
 * @param {number} quantity - 數量
 * @returns {Object} - { isValid: boolean, error?: string }
 * 
 * 驗證規則：
 * - 必須是正整數
 * - 不可小於 1
 * - 不可大於 99
 */
function validateCartQuantity(quantity) {
  // 請實作此函式
  let errors = [];
  if(!Number.isInteger(quantity)){
    errors.push('必須是正整數')
  }
  if(quantity < 1){
    errors.push('不可小於1');
  }
  if(quantity > 99){
    errors.push('不可大於 99');
  }
  if(errors.length > 0){
    return { isValid: false, errors }
  }
  return { isValid: true, errors }
}

/**
 * 格式化金額
 * @param {number} amount - 金額
 * @returns {string} - 格式化後的金額
 * 
 * 格式化規則：
 * - 加上 "NT$ " 前綴
 * - 數字需要千分位逗號分隔（例如：1000 → 1,000）
 * - 使用台灣格式（zh-TW）
 * 
 * 範例：
 * formatCurrency(1000) → "NT$ 1,000"
 * formatCurrency(1234567) → "NT$ 1,234,567"
 * 
 */
function formatCurrency(amount) {
  // 請實作此函式
  return `NT$ ${amount.toLocaleString('zh-TW')}`;
}


/**
 * 統一處理購物車操作
 * 
 * 這個函式會做三件事：
 * 1. 如果有傳入 validator，就先驗證 value
 * 2. 驗證失敗時，回傳失敗格式
 * 3. 驗證成功或不需要驗證時，執行 action 並回傳成功格式
 * 
 * @param {Object} options - 操作設定
 * @param {Function} options.action - 要執行的 API 動作
 * @param {Function} [options.validator] - 驗證函式，沒有就不驗證
 * @returns {Promise<Object>} 成功或失敗的結果
 * @param {string} [options.errorKey='error'] - validation error field name
 */
async function handleServiceAction(option){
    if(option.validator){
      const valFunction = option.validator;
      const valResult = valFunction();
      const errorKey = option.errorKey || 'error';
      if(valResult.isValid === false){
        return { success: false, [errorKey]: valResult.errors };
      }
    }
    const actionFunction = option.action
    const actionResult = await actionFunction();
    if(actionResult.status === false){
      return { success: false, error: actionResult.message};
    }
    return { success: true, data: actionResult}; 
}

module.exports = {
  getDiscountRate,
  getAllCategories,
  formatDate,
  getDaysAgo,
  validateOrderUser,
  validateCartQuantity,
  formatCurrency,
  handleServiceAction
};
