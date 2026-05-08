# JavaScript 筆記：Spread、Reduce 與 Set 去重

## 0. `...` 的專有名詞

`...` 的專有名詞要看使用情境。

在下面這兩種情境中：

```js
[...accm, item.category]
[...new Set(categories)]
```

`...` 叫做 spread operator，中文常叫展開運算子。

意思是把陣列、`Set` 這類可迭代的資料一個一個展開。

例如：

```js
const arr = ['飲料', '甜點']
const result = [...arr, '主餐']
```

等於：

```js
const result = ['飲料', '甜點', '主餐']
```

但 `...` 也可能叫 rest operator，中文常叫其餘運算子。

例如：

```js
function sum(...nums) {
  console.log(nums)
}
```

這裡的 `...nums` 是把傳進來的參數收集成陣列，所以是 rest operator。

簡單記：

```js
[...arr]
```

把東西展開，叫 spread operator。

```js
function fn(...args) {}
```

把東西收集起來，叫 rest operator。

## 1. `[...accm, item.category]` 是什麼意思？

這段常出現在 `reduce()` 裡：

```js
products.reduce((accm, item) => [...accm, item.category], [])
```

可以拆成：

```js
[
  ...accm,
  item.category
]
```

其中 `...accm` 是 spread operator，意思是把 `accm` 陣列裡的元素一個一個展開。

假設：

```js
const accm = ['飲料', '甜點']
const item = { category: '主餐' }
```

那：

```js
[...accm, item.category]
```

等於：

```js
['飲料', '甜點', '主餐']
```

意思是：建立一個新陣列，內容包含原本 `accm` 裡的所有值，再加上 `item.category`。

所以它跟下面這種寫法目的類似：

```js
accm.push(item.category)
return accm
```

差別是：

- `push()` 會修改原本的陣列
- `[...accm, item.category]` 會建立一個新的陣列

## 2. 為什麼 `reduce()` 裡要回傳？

`reduce()` 每一輪都需要知道「下一輪的累加值是什麼」。

所以 callback 的回傳值會變成下一輪的 `accm`。

例如：

```js
products.reduce((accm, item) => {
  accm.push(item.category)
  return accm
}, [])
```

如果沒有 `return accm`，下一輪的 `accm` 就會變成 `undefined`。

另外要注意：

```js
accm.push(item.category)
```

`push()` 回傳的不是陣列，而是新增後的陣列長度。

所以不能直接寫成：

```js
products.reduce((accm, item) => accm.push(item.category), [])
```

因為這樣下一輪拿到的 `accm` 會變成數字，不是陣列。

## 3. `[...new Set(categories)]` 是什麼意思？

這段常用來移除陣列裡重複的值：

```js
const result = [...new Set(categories)]
```

可以拆成兩步：

```js
const set = new Set(categories)
const result = [...set]
```

假設：

```js
const categories = ['飲料', '甜點', '飲料', '主餐']
```

先執行：

```js
new Set(categories)
```

會得到：

```js
Set { '飲料', '甜點', '主餐' }
```

`Set` 的特色是：不允許重複的值。

所以重複的 `'飲料'` 會被自動拿掉。

## 4. 為什麼要用 `...` 展開 `Set`？

因為 `new Set(categories)` 得到的是 `Set`，不是陣列。

例如：

```js
const result = new Set(categories)
```

這時候 `result` 會是：

```js
Set { '飲料', '甜點', '主餐' }
```

如果最後想要陣列，就要把 `Set` 轉回陣列：

```js
const result = [...new Set(categories)]
```

`...` 會把 `Set` 裡的值一個一個展開，再放進 `[]` 裡。

最後結果會是：

```js
['飲料', '甜點', '主餐']
```

簡單記法：

```js
new Set(categories)
```

負責去除重複值。

```js
[...set]
```

負責轉回陣列。

## 5. Day.js Cheat Sheet

這個專案目前會用到 Day.js 處理兩件事：

- 把 Unix timestamp 格式化成日期字串
- 計算某個 timestamp 距離今天幾天

先在檔案最上方引入：

```js
const dayjs = require('dayjs')
```

### 取得現在時間

```js
const now = dayjs()
```

`dayjs()` 不放參數時，代表現在的時間。

### 把 Unix timestamp 轉成 Day.js 日期物件

```js
const date = dayjs.unix(timestamp)
```

重點：

```js
dayjs.unix()
```

裡面要放 Unix timestamp 數字，不是格式字串。

正確：

```js
dayjs.unix(timestamp)
```

錯誤：

```js
dayjs.unix('YYYY/MM/DD HH:mm')
```

### 格式化日期

```js
dayjs.unix(timestamp).format('YYYY/MM/DD HH:mm')
```

這會把 timestamp 轉成像這樣的字串：

```js
'2024/01/01 08:00'
```

常用格式：

```js
YYYY // 西元年，例如 2024
MM   // 月份，兩位數，例如 01
DD   // 日期，兩位數，例如 09
HH   // 小時，24 小時制，兩位數
mm   // 分鐘，兩位數
```

所以：

```js
'YYYY/MM/DD HH:mm'
```

代表：

```js
年/月/日 小時:分鐘
```

### 計算兩個日期差幾天

```js
const today = dayjs()
const date = dayjs.unix(timestamp)
const diffDays = today.diff(date, 'day')
```

`.diff()` 的意思是計算兩個 Day.js 日期物件的差距。

```js
today.diff(date, 'day')
```

意思是：

> 今天距離 `date` 差幾天

如果 `date` 是 3 天前，結果會是：

```js
3
```

### 這個專案可能會用到的寫法

`formatDate(timestamp)`：

```js
function formatDate(timestamp) {
  return dayjs.unix(timestamp).format('YYYY/MM/DD HH:mm')
}
```

`getDaysAgo(timestamp)` 的核心概念：

```js
const today = dayjs()
const date = dayjs.unix(timestamp)
const diffDays = today.diff(date, 'day')
```

然後根據 `diffDays` 決定要回傳：

```js
'今天'
```

或：

```js
`${diffDays} 天前`
```

### 簡單記法

```js
dayjs()
```

取得現在時間。

```js
dayjs.unix(timestamp)
```

把 Unix timestamp 轉成 Day.js 日期物件。

```js
.format('YYYY/MM/DD HH:mm')
```

把日期轉成指定格式的字串。

```js
.diff(另一個日期, 'day')
```

計算兩個日期差幾天。

## 三元運算子

三元運算子可以用來在一行裡根據條件回傳兩種不同結果。

基本格式：

```js
條件 ? 條件成立時的值 : 條件不成立時的值
```

例如訂單付款狀態：

```js
paidText: order.paid ? '已付款' : '未付款'
```

意思是：

- 如果 `order.paid` 是 `true`，`paidText` 就是 `'已付款'`
- 如果 `order.paid` 是 `false`，`paidText` 就是 `'未付款'`

## 邏輯 OR 運算子當預設值

`||` 是邏輯 OR 運算子，也常用來設定預設值。

基本格式：

```js
可能沒有值的資料 || 預設值
```

例如：

```js
const user = formattedOrder.user || {};
```

意思是：

- 如果 `formattedOrder.user` 有值，就使用 `formattedOrder.user`
- 如果 `formattedOrder.user` 沒有值，就使用空物件 `{}`

這樣後面讀取：

```js
user.name
```

就比較不容易因為 `user` 是 `undefined` 而出錯。

另一個例子：

```js
const products = Object.values(formattedOrder.products || {});
```

意思是：

- 如果 `formattedOrder.products` 有值，就把它丟進 `Object.values()`
- 如果沒有值，就用空物件 `{}`，讓 `Object.values({})` 回傳空陣列

注意：`||` 會把以下值都當成沒有值：

```js
undefined
null
''
0
false
NaN
```

所以如果 `0` 或空字串是合法資料，要小心不要直接用 `||` 當預設值。
