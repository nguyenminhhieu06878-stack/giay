const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shoe-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ==========================================
// SCHEMAS
// ==========================================

// Schema cho Category
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);

// Schema cho Shoe Product
const shoeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  discount: { type: Number, default: 0 },
  images: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  sizes: [{ size: String, stock: Number }],
  colors: [String],
  tags: [String],
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Shoe = mongoose.model('Shoe', shoeSchema);

// Schema cho User/Customer
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  phone: String,
  address: String,
  role: { type: String, default: 'customer' }, // customer, admin
  cart: [{
    shoe: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoe' },
    quantity: Number,
    size: String,
    color: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Schema cho Order
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    shoe: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoe' },
    quantity: Number,
    size: String,
    color: String,
    price: Number
  }],
  totalAmount: Number,
  status: { type: String, default: 'pending' }, // pending, processing, delivered, cancelled
  shippingAddress: {
    name: String,
    phone: String,
    address: String
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// ==========================================
// ROUTES
// ==========================================

// ========== CATEGORIES ==========
// GET: Lấy tất cả categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Tạo category mới
app.post('/api/categories', async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = new Category({ name, slug });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ========== SHOES PRODUCTS ==========
// GET: Lấy tất cả giày (có filter)
app.get('/api/shoes', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, search, featured, sortBy } = req.query;
    const query = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (featured === 'true') query.featured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sort = {};
    if (sortBy === 'price_asc') sort.price = 1;
    else if (sortBy === 'price_desc') sort.price = -1;
    else if (sortBy === 'name') sort.name = 1;
    else sort.createdAt = -1;

    const shoes = await Shoe.find(query).populate('category').sort(sort);
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Lấy một giày theo ID
app.get('/api/shoes/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id).populate('category');
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    res.json(shoe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Tạo giày mới
app.post('/api/shoes', async (req, res) => {
  try {
    const shoe = new Shoe(req.body);
    await shoe.save();
    res.status(201).json(shoe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Cập nhật giày
app.put('/api/shoes/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    res.json(shoe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Xóa giày
app.delete('/api/shoes/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findByIdAndDelete(req.params.id);
    if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
    res.json({ message: 'Shoe deleted successfully', shoe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== USERS ==========
// GET: Lấy tất cả users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Lấy một user theo ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== AUTHENTICATION ==========
// Middleware để verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// POST: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Get current user (protected)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Tạo user mới (Register) - Keep for compatibility
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ========== CART ==========
// GET: Lấy cart của user
app.get('/api/users/:userId/cart', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('cart.shoe');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Thêm sản phẩm vào cart
app.post('/api/users/:userId/cart', async (req, res) => {
  try {
    const { shoeId, quantity, size, color } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const existingItem = user.cart.find(item => 
      item.shoe.toString() === shoeId && item.size === size && item.color === color
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ shoe: shoeId, quantity, size, color });
    }
    
    await user.save();
    const updatedUser = await User.findById(req.params.userId).populate('cart.shoe');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Cập nhật cart item
app.put('/api/users/:userId/cart/:cartId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const item = user.cart.id(req.params.cartId);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    
    item.quantity = quantity;
    await user.save();
    
    const updatedUser = await User.findById(req.params.userId).populate('cart.shoe');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Xóa item khỏi cart
app.delete('/api/users/:userId/cart/:cartId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.cart.id(req.params.cartId).remove();
    await user.save();
    
    const updatedUser = await User.findById(req.params.userId).populate('cart.shoe');
    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== ORDERS ==========
// GET: Lấy tất cả orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.shoe').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Lấy orders của user
app.get('/api/users/:userId/orders', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('items.shoe').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Tạo order mới
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress } = req.body;
    
    const order = new Order({
      user: userId,
      items,
      totalAmount,
      shippingAddress
    });
    
    await order.save();
    
    // Clear cart sau khi đặt hàng
    const user = await User.findById(userId);
    user.cart = [];
    await user.save();
    
    const orderWithDetails = await Order.findById(order._id).populate('items.shoe');
    res.status(201).json(orderWithDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Cập nhật status order
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    const orderWithDetails = await Order.findById(order._id).populate('items.shoe');
    res.json(orderWithDetails);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Shoe Store Server is running on http://localhost:${PORT}`);
});
