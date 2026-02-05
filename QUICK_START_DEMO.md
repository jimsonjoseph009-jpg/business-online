# 📚 Quick Start - View & Edit Sample Data

## 🎬 Getting Started (30 seconds)

1. **View Demo Data**: Go to http://localhost:3000/demo
2. **See Products, Customers & Orders** in a beautiful dashboard
3. **Manage Everything**: Go to http://localhost:3000/admin for full CRUD

---

## 🎯 What You Have

| Item | Quantity | Status |
|------|----------|--------|
| Products | 6 | ✅ Ready with images |
| Customers | 5 | ✅ Ready with contact info |
| Orders | 5 | ✅ Ready with items & totals |

---

## 🖱️ Quick Actions

### In Demo Viewer (`/demo`)
- 📸 See all products with images
- 👥 View customer details
- 📋 Check order information
- 📊 View statistics

### In Admin Panel (`/admin`)
- ✏️ **Edit**: Click edit icon on any item
- 🗑️ **Delete**: Select items, click delete
- ➕ **Add**: Click "Add Product/Customer/Order"
- 🔍 **Search**: Real-time search across all fields
- 📌 **Filter**: By category, status, etc.
- 📑 **Sort**: Click column headers to sort

### In Individual Pages
- `/products` - Browse all products
- `/customers` - Manage customers
- `/orders` - Track orders

---

## 📸 View Sample Products

All 6 products are displayed with:
- ✅ Professional images from placeholder service
- ✅ Detailed descriptions
- ✅ Prices and stock levels
- ✅ Categories and SKUs

---

## 👥 View Sample Customers  

All 5 customers include:
- ✅ Full names
- ✅ Email addresses
- ✅ Phone numbers
- ✅ Complete addresses
- ✅ City and country info

---

## 📦 View Sample Orders

All 5 orders contain:
- ✅ Order IDs
- ✅ Customer references
- ✅ Multiple line items
- ✅ Order totals
- ✅ Status (pending/completed/cancelled)

---

## 🔄 Edit/Modify Data

### To Edit an Item:
1. Go to `/admin`
2. Click the **Edit** button on any row
3. Update fields in the modal
4. Click **Save**

### To Delete an Item:
1. Select checkbox on the item
2. Click **Bulk Delete** or **Delete** button
3. Confirm in the dialog
4. Item is removed

### To Add New Data:
1. Go to `/admin` or individual page
2. Click **Add Product/Customer/Order**
3. Fill in the form
4. Upload images if needed
5. Click **Save**

---

## 🖼️ Product Images

All sample products have placeholder images:
```
https://via.placeholder.com/400?text=Product+Name
```

You can:
- 📸 Use these for testing
- 🔗 Replace with your own images
- 💾 Upload custom images when adding new products

---

## 💻 Browser Access

**Demo Page**
```
http://localhost:3000/demo
```

**Admin Panel**
```
http://localhost:3000/admin
```

**Individual Sections**
```
http://localhost:3000/products
http://localhost:3000/customers
http://localhost:3000/orders
```

---

## ✅ Everything Works!

Both servers are running:
- ✅ React Dev Server (port 3000)
- ✅ Backend API (port 5000)
- ✅ Demo Data Endpoint
- ✅ Admin CRUD Operations

---

## 🎨 What You Can Edit

### Products
- Name, Description, Price
- Category, SKU, Stock
- Image URL

### Customers
- Name, Email, Phone
- Address, City, Country
- Zip Code

### Orders  
- Status (pending/completed/cancelled)
- Items in the order
- Totals and pricing

---

## 🚀 Next: Real Database

When you're ready to use real data:
1. Configure Firebase credentials
2. Admin panel will save to Firestore
3. All CRUD operations will persist
4. Mobile sync enabled automatically

---

## 📞 Need Help?

**Issue** | **Solution**
----------|----------
Can't see data | Refresh page or check `/demo`
Edit not saving | Check if Firebase is configured
Images not loading | Use custom image URLs
Mobile won't connect | Scan QR code at `/mobile-qr`

---

## 🎉 You're All Set!

Visit http://localhost:3000/demo now to see your sample data!

