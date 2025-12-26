// متغیرهای سراسری
let productRowCount = 0;

// هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function() {
    // افزودن اولین ردیف محصول
    addProductRow();
    
    // اتصال رویدادها
    attachEventListeners();
});

// اتصال رویدادهای محاسبه
function attachEventListeners() {
    // محاسبه خودکار هنگام تغییر تخفیف یا هزینه ارسال
    document.getElementById('discountPercent').addEventListener('input', calculateTotals);
    document.getElementById('shippingCost').addEventListener('input', calculateTotals);
}

// افزودن ردیف محصول جدید
function addProductRow() {
    productRowCount++;
    const container = document.getElementById('productsContainer');
    
    const row = document.createElement('div');
    row.className = 'product-row';
    row.id = `product-row-${productRowCount}`;
    
    row.innerHTML = `
        <div class="form-group">
            <label>نام محصول</label>
            <input type="text" class="product-name" placeholder="نام محصول را وارد کنید" onchange="updateRowTotal(${productRowCount})">
        </div>
        <div class="form-group">
            <label>تعداد</label>
            <input type="number" class="product-quantity" min="1" value="1" onchange="updateRowTotal(${productRowCount})">
        </div>
        <div class="form-group">
            <label>قیمت واحد (تومان)</label>
            <input type="number" class="product-price" min="0" placeholder="قیمت به تومان" onchange="updateRowTotal(${productRowCount})">
        </div>
        <div class="form-group">
            <label>جمع</label>
            <div class="row-total">0 تومان</div>
        </div>
        <div class="form-group">
            <label>&nbsp;</label>
            <button type="button" class="btn-remove" onclick="removeProductRow(${productRowCount})" title="حذف">×</button>
        </div>
    `;
    
    container.appendChild(row);
}

// حذف ردیف محصول
function removeProductRow(rowId) {
    const row = document.getElementById(`product-row-${rowId}`);
    if (row) {
        row.remove();
        calculateTotals();
    }
}

// بروزرسانی مجموع هر ردیف
function updateRowTotal(rowId) {
    const row = document.getElementById(`product-row-${rowId}`);
    if (!row) return;
    
    const priceInput = row.querySelector('.product-price');
    const quantityInput = row.querySelector('.product-quantity');
    const totalDiv = row.querySelector('.row-total');
    
    const price = parseFloat(priceInput.value) || 0;
    const quantity = parseFloat(quantityInput.value) || 0;
    
    // محاسبه مجموع
    const rowTotal = price * quantity;
    totalDiv.textContent = formatPrice(rowTotal);
    
    // محاسبه مجموع کل
    calculateTotals();
}

// محاسبه مجموع کل
function calculateTotals() {
    let subtotal = 0;
    
    // جمع همه ردیف‌ها
    const rows = document.querySelectorAll('.product-row');
    rows.forEach(row => {
        const priceInput = row.querySelector('.product-price');
        const quantityInput = row.querySelector('.product-quantity');
        
        const price = parseFloat(priceInput.value) || 0;
        const quantity = parseFloat(quantityInput.value) || 0;
        
        subtotal += price * quantity;
    });
    
    // محاسبه تخفیف
    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    
    // هزینه ارسال
    const shippingCost = parseFloat(document.getElementById('shippingCost').value) || 0;
    
    // مجموع نهایی
    const total = subtotal - discountAmount + shippingCost;
    
    // نمایش مقادیر
    document.getElementById('subtotalAmount').textContent = formatPrice(subtotal);
    document.getElementById('discountAmount').textContent = formatPrice(discountAmount);
    document.getElementById('shippingAmount').textContent = formatPrice(shippingCost);
    document.getElementById('totalAmount').textContent = formatPrice(total);
}

// فرمت قیمت به تومان
function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
}

// ایجاد فاکتور
function generateInvoice() {
    // اعتبارسنجی فرم
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerAddress = document.getElementById('customerAddress').value.trim();
    
    if (!customerName || !customerPhone || !customerAddress) {
        alert('لطفاً اطلاعات مشتری را کامل وارد نمایید.');
        return;
    }
    
    // بررسی محصولات
    const selectedProducts = [];
    const rows = document.querySelectorAll('.product-row');
    
    rows.forEach((row, index) => {
        const nameInput = row.querySelector('.product-name');
        const quantityInput = row.querySelector('.product-quantity');
        const priceInput = row.querySelector('.product-price');
        
        const name = nameInput.value.trim();
        const quantity = parseFloat(quantityInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        
        if (name && quantity > 0 && price > 0) {
            selectedProducts.push({
                name: name,
                quantity: quantity,
                price: price,
                total: price * quantity
            });
        }
    });
    
    if (selectedProducts.length === 0) {
        alert('لطفاً حداقل یک محصول با اطلاعات کامل وارد نمایید.');
        return;
    }
    
    // تولید شماره فاکتور
    const invoiceNumber = generateInvoiceNumber();
    
    // تاریخ فعلی
    const today = new Date();
    const persianDate = new Intl.DateTimeFormat('fa-IR').format(today);
    
    // پر کردن اطلاعات فاکتور
    document.getElementById('invoiceNumber').textContent = invoiceNumber;
    document.getElementById('invoiceDate').textContent = persianDate;
    
    // اطلاعات مشتری
    document.getElementById('invCustomerName').textContent = customerName;
    document.getElementById('invCustomerPhone').textContent = customerPhone;
    document.getElementById('invCustomerAddress').textContent = customerAddress;
    
    const customerCity = document.getElementById('customerCity').value.trim();
    const customerPostalCode = document.getElementById('customerPostalCode').value.trim();
    
    if (customerCity) {
        document.getElementById('invCustomerCity').textContent = customerCity;
        document.getElementById('invCityRow').style.display = 'block';
    } else {
        document.getElementById('invCityRow').style.display = 'none';
    }
    
    if (customerPostalCode) {
        document.getElementById('invCustomerPostalCode').textContent = customerPostalCode;
        document.getElementById('invPostalRow').style.display = 'block';
    } else {
        document.getElementById('invPostalRow').style.display = 'none';
    }
    
    // محصولات
    const productsBody = document.getElementById('invProductsBody');
    productsBody.innerHTML = '';
    
    selectedProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${formatPrice(product.price)}</td>
            <td>${formatPrice(product.total)}</td>
        `;
        productsBody.appendChild(row);
    });
    
    // محاسبات مالی
    const subtotal = selectedProducts.reduce((sum, p) => sum + p.total, 0);
    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    const shippingCost = parseFloat(document.getElementById('shippingCost').value) || 0;
    const total = subtotal - discountAmount + shippingCost;
    
    document.getElementById('invSubtotal').textContent = formatPrice(subtotal);
    
    if (discountPercent > 0) {
        document.getElementById('invDiscountPercent').textContent = discountPercent;
        document.getElementById('invDiscount').textContent = formatPrice(discountAmount);
        document.getElementById('invDiscountRow').style.display = 'table-row';
    } else {
        document.getElementById('invDiscountRow').style.display = 'none';
    }
    
    if (shippingCost > 0) {
        document.getElementById('invShipping').textContent = formatPrice(shippingCost);
        document.getElementById('invShippingRow').style.display = 'table-row';
    } else {
        document.getElementById('invShippingRow').style.display = 'none';
    }
    
    document.getElementById('invTotal').textContent = formatPrice(total);
    
    // یادداشت
    const notes = document.getElementById('notes').value.trim();
    if (notes) {
        document.getElementById('invNotes').textContent = notes;
        document.getElementById('invNotesSection').style.display = 'block';
    } else {
        document.getElementById('invNotesSection').style.display = 'none';
    }
    
    // نمایش صفحه فاکتور
    document.getElementById('formPage').style.display = 'none';
    document.getElementById('invoicePage').style.display = 'block';
    
    // اسکرول به بالای صفحه
    window.scrollTo(0, 0);
}

// تولید شماره فاکتور
function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `INV${year}${month}${day}-${random}`;
}

// چاپ فاکتور
function printInvoice() {
    window.print();
}

// بازگشت به فرم
function backToForm() {
    document.getElementById('invoicePage').style.display = 'none';
    document.getElementById('formPage').style.display = 'block';
    window.scrollTo(0, 0);
}

// ایجاد فاکتور جدید
function createNewInvoice() {
    if (confirm('آیا مطمئن هستید؟ اطلاعات فعلی پاک خواهد شد.')) {
        clearForm();
        document.getElementById('invoicePage').style.display = 'none';
        document.getElementById('formPage').style.display = 'block';
        window.scrollTo(0, 0);
    }
}

// پاک کردن فرم
function clearForm() {
    // پاک کردن اطلاعات مشتری
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('customerCity').value = '';
    document.getElementById('customerPostalCode').value = '';
    
    // پاک کردن محصولات
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    productRowCount = 0;
    addProductRow();
    
    // پاک کردن جزئیات اضافی
    document.getElementById('discountPercent').value = '0';
    document.getElementById('shippingCost').value = '0';
    document.getElementById('notes').value = '';
    
    // ریست محاسبات
    calculateTotals();
}