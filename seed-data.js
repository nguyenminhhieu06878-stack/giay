const mongoose = require('mongoose');
require('dotenv').config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shoe-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas
const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  createdAt: Date
});

const shoeSchema = new mongoose.Schema({
  name: String,
  brand: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  images: [String],
  category: mongoose.Schema.Types.ObjectId,
  sizes: [{ size: String, stock: Number }],
  colors: [String],
  tags: [String],
  featured: Boolean,
  rating: Number,
  reviewCount: Number,
  createdAt: Date
});

const Category = mongoose.model('Category', categorySchema);
const Shoe = mongoose.model('Shoe', shoeSchema);

// Seed data
async function seedData() {
  try {
    console.log('🌱 Starting to seed data...');

    // Clear existing data
    await Category.deleteMany({});
    await Shoe.deleteMany({});
    console.log('✅ Cleared existing data');

    // Chỉ tạo Categories về giày
    const categories = await Category.insertMany([
      { name: 'Giày da nam', slug: 'giay-da-nam' },
      { name: 'Giày lười nam', slug: 'giay-luoi-nam' },
      { name: 'Giày tăng chiều cao', slug: 'giay-tang-chieu-cao' },
      { name: 'Giày tây nam', slug: 'giay-tay-nam' },
      { name: 'Giày boot', slug: 'giay-boot' },
      { name: 'Giày sneaker', slug: 'giay-sneaker' }
    ]);
    
    // Map categories by name for easy reference
    const catMap = {};
    categories.forEach(cat => {
      catMap[cat.name] = cat._id;
    });
    console.log('✅ Created categories');

    // Tạo nhiều mẫu giày đa dạng
    const shoes = [
      // Giày lười nam
      {
        name: 'Giày lười da nam Horsebit Loafer mũi tròn GNTA6202-D',
        brand: 'SHOE STORE',
        description: 'Giày lười da nam cao cấp với thiết kế Horsebit Loafer mũi tròn, phong cách cổ điển nhưng hiện đại.',
        price: 770000,
        originalPrice: 0,
        discount: 0,
        images: [
          '/product-GNTA6202.jpg',
          'https://tamanh.net/wp-content/uploads/2024/01/giay-luoi-nam-dep-mui-tron-gnta6202-d-2.jpg',
          'https://tamanh.net/wp-content/uploads/2024/01/giay-luoi-nam-dep-mui-tron-gnta6202-d-3.jpg'
        ],
        category: catMap['Giày lười nam'],
        sizes: [
          { size: '38', stock: 15 },
          { size: '39', stock: 20 },
          { size: '40', stock: 25 },
          { size: '41', stock: 18 },
          { size: '42', stock: 12 },
          { size: '43', stock: 10 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['loafer', 'classic', 'premium'],
        featured: true,
        rating: 4.7,
        reviewCount: 156
      },
      {
        name: 'Giày Moccasin nam quai ngang viền chỉ nổi GNTA2302-D',
        brand: 'SHOE STORE',
        description: 'Giày Moccasin nam với quai ngang và viền chỉ nổi độc đáo, thiết kế tinh tế và sang trọng.',
        price: 720000,
        originalPrice: 990000,
        discount: 27,
        images: [
          '/product-GNTA2302.jpg',
          'https://tamanh.net/wp-content/uploads/2024/01/giay-luoi-nam-quai-ngang-vien-chi-noi-gnta2302-d-2.jpg'
        ],
        category: catMap['Giày lười nam'],
        sizes: [
          { size: '39', stock: 18 },
          { size: '40', stock: 22 },
          { size: '41', stock: 20 },
          { size: '42', stock: 15 },
          { size: '43', stock: 12 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['moccasin', 'quai-ngang', 'sale'],
        featured: true,
        rating: 4.6,
        reviewCount: 203
      },
      {
        name: 'Giày lười da bò nam quai ngang GNTA612-CF',
        brand: 'SHOE STORE',
        description: 'Giày lười da bò nam với quai ngang thời trang, chất liệu da bò thật mềm mại và bền đẹp.',
        price: 920000,
        originalPrice: 0,
        discount: 0,
        images: [
          '/product-GNTA612.jpg',
          'https://tamanh.net/wp-content/uploads/2024/01/giay-luoi-da-bo-nam-quai-ngang-gnta612-cf-2.jpg'
        ],
        category: catMap['Giày lười nam'],
        sizes: [
          { size: '39', stock: 20 },
          { size: '40', stock: 25 },
          { size: '41', stock: 22 },
          { size: '42', stock: 18 },
          { size: '43', stock: 15 }
        ],
        colors: ['Brown', 'Black'],
        tags: ['loafer', 'genuine-leather', 'premium'],
        featured: true,
        rating: 4.4,
        reviewCount: 167
      },
      {
        name: 'Giày lười nam kiểu dáng basic GNTA13-3636-D',
        brand: 'SHOE STORE',
        description: 'Giày lười nam thiết kế basic nhưng không kém phần thanh lịch, phù hợp nhiều phong cách từ công sở đến casual.',
        price: 750000,
        originalPrice: 960000,
        discount: 22,
        images: ['https://tamanh.net/wp-content/uploads/2024/01/giay-luoi-nam-kieu-dang-basic-gnta13-3636-d-1.jpg'],
        category: catMap['Giày lười nam'],
        sizes: [
          { size: '38', stock: 12 },
          { size: '39', stock: 18 },
          { size: '40', stock: 22 },
          { size: '41', stock: 20 },
          { size: '42', stock: 15 },
          { size: '43', stock: 12 }
        ],
        colors: ['Black'],
        tags: ['loafer', 'basic', 'versatile', 'sale'],
        featured: false,
        rating: 4.3,
        reviewCount: 134
      },
      {
        name: 'Giày lười đế Chunky GNTA21-20246-D',
        brand: 'SHOE STORE',
        description: 'Giày lười đế Chunky thời trang, đón đầu xu hướng trẻ trung và phá cách, phù hợp mọi dịp.',
        price: 790000,
        originalPrice: 1200000,
        discount: 34,
        images: [
          '/product-GNTA21-20246.jpg',
          'https://tamanh.net/wp-content/uploads/2024/01/giay-luoi-de-chunky-gnta21-20246-d-1.jpg'
        ],
        category: catMap['Giày lười nam'],
        sizes: [
          { size: '39', stock: 15 },
          { size: '40', stock: 20 },
          { size: '41', stock: 18 },
          { size: '42', stock: 12 },
          { size: '43', stock: 10 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['loafer', 'chunky', 'trendy', 'sale'],
        featured: true,
        rating: 4.8,
        reviewCount: 289
      },
      
      // Giày tây nam
      {
        name: 'Giày da Oxford đế Chunky GNTA51-5104-D',
        brand: 'SHOE STORE',
        description: 'Giày da Oxford với đế Chunky độc đáo, phong cách hiện đại kết hợp cổ điển, phù hợp công sở và đi chơi.',
        price: 800000,
        originalPrice: 1250000,
        discount: 36,
        images: [
          '/product-featured-1.jpg',
          'https://tamanh.net/wp-content/uploads/2024/01/giay-da-oxford-de-chunky-gnta51-5104-d-1.jpg',
          'https://tamanh.net/wp-content/uploads/2024/01/giay-tay-de-chunky-gnta51-5104-d-3.jpg'
        ],
        category: catMap['Giày tây nam'],
        sizes: [
          { size: '39', stock: 15 },
          { size: '40', stock: 20 },
          { size: '41', stock: 18 },
          { size: '42', stock: 12 },
          { size: '43', stock: 10 }
        ],
        colors: ['Black'],
        tags: ['oxford', 'chunky', 'formal', 'sale'],
        featured: true,
        rating: 4.8,
        reviewCount: 342
      },
      {
        name: 'Giày tây nam họa tiết Wingtip đế Chunky GNTA20232-D',
        brand: 'SHOE STORE',
        description: 'Giày tây nam với họa tiết Wingtip cổ điển và đế Chunky hiện đại, sự kết hợp hoàn hảo giữa truyền thống và hiện đại.',
        price: 660000,
        originalPrice: 900000,
        discount: 27,
        images: [
          'https://tamanh.net/wp-content/uploads/2024/01/giay-tay-nam-hoa-tiet-wingtip-de-chunky-gnta20232-d-1.jpg',
          'https://tamanh.net/wp-content/uploads/2024/01/giay-tay-nam-hoa-tiet-wingtip-de-chunky-gnta20232-d-2.jpg'
        ],
        category: catMap['Giày tây nam'],
        sizes: [
          { size: '39', stock: 10 },
          { size: '40', stock: 15 },
          { size: '41', stock: 12 },
          { size: '42', stock: 8 },
          { size: '43', stock: 6 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['wingtip', 'chunky', 'classic', 'sale'],
        featured: false,
        rating: 4.5,
        reviewCount: 198
      },
      {
        name: 'Giày tây nam da trơn phối họa tiết dập lỗ GNTA20231-D',
        brand: 'SHOE STORE',
        description: 'Giày tây nam da trơn với họa tiết dập lỗ tinh tế, thiết kế thanh lịch cho phong cách công sở.',
        price: 690000,
        originalPrice: 920000,
        discount: 25,
        images: [
          'https://tamanh.net/wp-content/uploads/2024/01/giay-tay-nam-da-tron-phoi-hoa-tiet-dap-lo-gnta20231-d-1.jpg',
          'https://tamanh.net/wp-content/uploads/2024/01/giay-tay-nam-da-tron-phoi-hoa-tiet-dap-lo-gnta2023-1-d-1.jpg'
        ],
        category: catMap['Giày tây nam'],
        sizes: [
          { size: '39', stock: 12 },
          { size: '40', stock: 18 },
          { size: '41', stock: 15 },
          { size: '42', stock: 10 },
          { size: '43', stock: 8 }
        ],
        colors: ['Black'],
        tags: ['formal', 'brogue', 'office', 'sale'],
        featured: false,
        rating: 4.4,
        reviewCount: 167
      },
      {
        name: 'Giày da Loafer đế Chunky GNTA21-20247-D',
        brand: 'SHOE STORE',
        description: 'Giày da Loafer đế Chunky thời trang, kết hợp giữa cổ điển và hiện đại, phù hợp mọi dịp.',
        price: 790000,
        originalPrice: 1200000,
        discount: 34,
        images: ['https://tamanh.net/wp-content/uploads/2024/01/giay-da-loafer-de-chunky-gnta21-20247-d-1.jpg'],
        category: catMap['Giày tây nam'],
        sizes: [
          { size: '39', stock: 15 },
          { size: '40', stock: 20 },
          { size: '41', stock: 18 },
          { size: '42', stock: 12 },
          { size: '43', stock: 10 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['loafer', 'chunky', 'versatile', 'sale'],
        featured: true,
        rating: 4.7,
        reviewCount: 234
      },
      
      // Giày da nam
      {
        name: 'Giày da nam buộc dây da bóng GNTA5502-D',
        brand: 'SHOE STORE',
        description: 'Giày da nam buộc dây với chất liệu da bóng cao cấp, thiết kế lịch lãm và sang trọng.',
        price: 660000,
        originalPrice: 790000,
        discount: 16,
        images: [
          'https://tamanh.net/wp-content/uploads/2024/01/giay-da-nam-buoc-day-da-bong-gnta5502-d-1.jpg',
          'https://tamanh.net/wp-content/uploads/2024/01/giay-buoc-day-cong-so-gnta5502-d-1.jpg'
        ],
        category: catMap['Giày da nam'],
        sizes: [
          { size: '38', stock: 10 },
          { size: '39', stock: 15 },
          { size: '40', stock: 20 },
          { size: '41', stock: 18 },
          { size: '42', stock: 12 },
          { size: '43', stock: 10 }
        ],
        colors: ['Black'],
        tags: ['leather', 'polished', 'formal', 'sale'],
        featured: true,
        rating: 4.5,
        reviewCount: 189
      },
      {
        name: 'Giày da dáng Apron Toe GNTA5501-D',
        brand: 'SHOE STORE',
        description: 'Giày da dáng Apron Toe với chi tiết may viền nổi bật, mũi nhọn ôm chân tạo kiểu dáng thon gọn.',
        price: 750000,
        originalPrice: 980000,
        discount: 23,
        images: ['https://tamanh.net/wp-content/uploads/2024/01/giay-da-dang-apron-toe-gnta5501-d-1.jpg'],
        category: catMap['Giày da nam'],
        sizes: [
          { size: '39', stock: 12 },
          { size: '40', stock: 18 },
          { size: '41', stock: 15 },
          { size: '42', stock: 10 },
          { size: '43', stock: 8 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['apron-toe', 'modern', 'sale'],
        featured: false,
        rating: 4.6,
        reviewCount: 156
      },
      {
        name: 'Giày da nam dáng Derby GNTA018-D',
        brand: 'SHOE STORE',
        description: 'Giày da nam dáng Derby đáp ứng cả tính lịch sự và phong cách casual, thiết kế mở dây thoải mái.',
        price: 850000,
        originalPrice: 0,
        discount: 0,
        images: ['https://tamanh.net/wp-content/uploads/2024/01/giay-da-nam-dang-derby-gnta018-d-1.jpg'],
        category: catMap['Giày da nam'],
        sizes: [
          { size: '39', stock: 15 },
          { size: '40', stock: 20 },
          { size: '41', stock: 18 },
          { size: '42', stock: 12 },
          { size: '43', stock: 10 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['derby', 'versatile', 'premium'],
        featured: false,
        rating: 4.5,
        reviewCount: 201
      },
      
      // Giày Boot
      {
        name: 'Giày Chelsea boot đế Chunky thời trang GNTA51-5102-D',
        brand: 'SHOE STORE',
        description: 'Giày Chelsea boot đế Chunky thời trang, thiết kế năng động và hiện đại, phù hợp mọi phong cách.',
        price: 850000,
        originalPrice: 1200000,
        discount: 29,
        images: ['https://tamanh.net/wp-content/uploads/2024/01/giay-chelsea-boot-de-chunky-thoi-trang-gnta51-5102-d-1.jpg'],
        category: catMap['Giày boot'],
        sizes: [
          { size: '39', stock: 10 },
          { size: '40', stock: 15 },
          { size: '41', stock: 12 },
          { size: '42', stock: 10 },
          { size: '43', stock: 8 }
        ],
        colors: ['Black'],
        tags: ['chelsea', 'boot', 'chunky', 'trendy', 'sale'],
        featured: true,
        rating: 4.7,
        reviewCount: 234
      },
      {
        name: 'Giày boot cao cổ đế Chunky GNTA51-5105-D',
        brand: 'SHOE STORE',
        description: 'Giày boot cao cổ đế Chunky mạnh mẽ, phong cách cá tính và năng động cho mọi mùa.',
        price: 950000,
        originalPrice: 1350000,
        discount: 30,
        images: ['https://tamanh.net/wp-content/uploads/2024/01/giay-boot-cao-co-de-chunky-gnta51-5105-d-1.jpg'],
        category: catMap['Giày boot'],
        sizes: [
          { size: '39', stock: 8 },
          { size: '40', stock: 12 },
          { size: '41', stock: 10 },
          { size: '42', stock: 8 },
          { size: '43', stock: 6 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['boot', 'chunky', 'tall', 'sale'],
        featured: false,
        rating: 4.6,
        reviewCount: 187
      },
      
      // Giày tăng chiều cao
      {
        name: 'Giày tăng chiều cao đế Chunky GNTA51-5106-D',
        brand: 'SHOE STORE',
        description: 'Giày tăng chiều cao với đế Chunky dày, giúp tăng 5-7cm chiều cao, thiết kế thời trang không lộ.',
        price: 1100000,
        originalPrice: 1500000,
        discount: 27,
        images: [
          '/product-featured-2.jpg',
          'https://tamanh.net/wp-content/uploads/2024/01/giay-tang-chieu-cao-de-chunky-gnta51-5106-d-1.jpg'
        ],
        category: catMap['Giày tăng chiều cao'],
        sizes: [
          { size: '39', stock: 12 },
          { size: '40', stock: 18 },
          { size: '41', stock: 15 },
          { size: '42', stock: 12 },
          { size: '43', stock: 10 }
        ],
        colors: ['Black'],
        tags: ['height', 'chunky', 'invisible', 'sale'],
        featured: true,
        rating: 4.9,
        reviewCount: 456
      },
      {
        name: 'Giày tăng chiều cao Loafer GNTA21-20248-D',
        brand: 'SHOE STORE',
        description: 'Giày tăng chiều cao kiểu Loafer thanh lịch, tăng 4-6cm một cách tự nhiên, phù hợp công sở.',
        price: 980000,
        originalPrice: 1300000,
        discount: 25,
        images: ['https://tamanh.net/wp-content/uploads/2024/01/giay-tang-chieu-cao-loafer-gnta21-20248-d-1.jpg'],
        category: catMap['Giày tăng chiều cao'],
        sizes: [
          { size: '39', stock: 10 },
          { size: '40', stock: 15 },
          { size: '41', stock: 12 },
          { size: '42', stock: 10 },
          { size: '43', stock: 8 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['height', 'loafer', 'office', 'sale'],
        featured: false,
        rating: 4.7,
        reviewCount: 312
      },
      
      // Giày Sneaker
      {
        name: 'Giày sneaker da bò cao cấp GNTA20240-D',
        brand: 'SHOE STORE',
        description: 'Giày sneaker da bò cao cấp, thiết kế hiện đại phù hợp mọi phong cách từ casual đến sport.',
        price: 1200000,
        originalPrice: 0,
        discount: 0,
        images: ['https://tamanh.net/wp-content/uploads/2024/01/giay-sneaker-da-bo-cao-cap-gnta20240-d-1.jpg'],
        category: catMap['Giày sneaker'],
        sizes: [
          { size: '38', stock: 15 },
          { size: '39', stock: 20 },
          { size: '40', stock: 25 },
          { size: '41', stock: 22 },
          { size: '42', stock: 18 },
          { size: '43', stock: 15 }
        ],
        colors: ['White', 'Black', 'Navy'],
        tags: ['sneaker', 'leather', 'casual', 'premium'],
        featured: true,
        rating: 4.8,
        reviewCount: 423
      },
      {
        name: 'Giày sneaker đế Chunky trẻ trung GNTA20241-D',
        brand: 'SHOE STORE',
        description: 'Giày sneaker đế Chunky trẻ trung, phong cách hiện đại và năng động cho giới trẻ.',
        price: 1050000,
        originalPrice: 1400000,
        discount: 25,
        images: ['https://tamanh.net/wp-content/uploads/2024/01/giay-sneaker-de-chunky-tre-trung-gnta20241-d-1.jpg'],
        category: catMap['Giày sneaker'],
        sizes: [
          { size: '39', stock: 18 },
          { size: '40', stock: 22 },
          { size: '41', stock: 20 },
          { size: '42', stock: 15 },
          { size: '43', stock: 12 }
        ],
        colors: ['Black', 'White'],
        tags: ['sneaker', 'chunky', 'youth', 'sale'],
        featured: false,
        rating: 4.6,
        reviewCount: 267
      },
      
      // Sản phẩm mới từ Sóc Store
      {
        name: 'Giày Penny Loafer thiết kế lịch lãm GNTA16-92027-D',
        brand: 'SHOE STORE',
        description: 'Giày Penny Loafer, đế cao su chống trượt. Quai vắt ngang thân giày, chính giữa phối họa tiết "kim cương" thời trang. Chất liệu da bò cao cấp, form giày gọn gàng ôm chân vừa vặn.',
        price: 870000,
        originalPrice: 0,
        discount: 0,
        images: ['https://tamanh.net/wp-content/uploads/2024/01/giay-penny-loafer-thiet-ke-lich-lam-gnta16-92027-d-1.jpg'],
        category: catMap['Giày lười nam'],
        sizes: [
          { size: '38', stock: 12 },
          { size: '39', stock: 18 },
          { size: '40', stock: 22 },
          { size: '41', stock: 20 },
          { size: '42', stock: 15 },
          { size: '43', stock: 12 }
        ],
        colors: ['Black'],
        tags: ['penny-loafer', 'loafer', 'premium', 'classic'],
        featured: true,
        rating: 4.7,
        reviewCount: 189
      },
      {
        name: 'Giày đơn nam quai da ngang GCTATC1566-D',
        brand: 'SHOE STORE',
        description: 'Giày đơn nam với quai da ngang thời trang, thiết kế tối giản và thanh lịch. Chất liệu da cao cấp, phù hợp cả công sở và casual.',
        price: 750000,
        originalPrice: 950000,
        discount: 21,
        images: [
          'https://tamanh.net/wp-content/uploads/2024/01/giay-don-nam-quai-da-ngang-gctatc1566-d-1.jpg',
          'https://tamanh.net/wp-content/uploads/2024/01/giay-don-nam-quai-da-ngang-gctatc1566-d-2.jpg'
        ],
        category: catMap['Giày lười nam'],
        sizes: [
          { size: '38', stock: 10 },
          { size: '39', stock: 15 },
          { size: '40', stock: 20 },
          { size: '41', stock: 18 },
          { size: '42', stock: 12 },
          { size: '43', stock: 10 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['loafer', 'quai-ngang', 'minimalist', 'sale'],
        featured: true,
        rating: 4.5,
        reviewCount: 156
      },
      {
        name: 'Giày da Derby nam đế Chunky GNTA51-5103-D',
        brand: 'SHOE STORE',
        description: 'Giày da Derby nam đế Chunky thời trang, thiết kế mạnh mẽ và cá tính, phù hợp nhiều phong cách. Được khách hàng đánh giá cao về độ trẻ trung và lịch lãm.',
        price: 800000,
        originalPrice: 1250000,
        discount: 36,
        images: ['https://tamanh.net/wp-content/uploads/2024/01/giay-da-derby-nam-de-chunky-gnta51-5103-d-1.jpg'],
        category: catMap['Giày tây nam'],
        sizes: [
          { size: '39', stock: 15 },
          { size: '40', stock: 20 },
          { size: '41', stock: 18 },
          { size: '42', stock: 12 },
          { size: '43', stock: 10 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['derby', 'chunky', 'trendy', 'bestseller', 'sale'],
        featured: true,
        rating: 4.9,
        reviewCount: 456
      },
      {
        name: 'Giày lười nam quai ngang GNTA2151',
        brand: 'SHOE STORE',
        description: 'Giày lười nam với quai ngang thời trang, thiết kế tối giản và thanh lịch, phù hợp mọi phong cách.',
        price: 680000,
        originalPrice: 850000,
        discount: 20,
        images: ['https://tamanh.net/wp-content/uploads/2024/01/giay-luoi-nam-quai-ngang-gnta2151-1.jpg'],
        category: catMap['Giày lười nam'],
        sizes: [
          { size: '38', stock: 12 },
          { size: '39', stock: 18 },
          { size: '40', stock: 22 },
          { size: '41', stock: 20 },
          { size: '42', stock: 15 },
          { size: '43', stock: 12 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['loafer', 'quai-ngang', 'minimalist', 'sale'],
        featured: false,
        rating: 4.4,
        reviewCount: 142
      },
      {
        name: 'Giày tăng chiều cao thiết kế phong cách GCTA22-20244-D',
        brand: 'SHOE STORE',
        description: 'Giày tăng chiều cao với thiết kế phong cách hiện đại, đế dày giúp tăng chiều cao tự nhiên, phù hợp mọi dịp.',
        price: 1150000,
        originalPrice: 1500000,
        discount: 23,
        images: ['/product-featured-2.jpg'],
        category: catMap['Giày tăng chiều cao'],
        sizes: [
          { size: '39', stock: 10 },
          { size: '40', stock: 15 },
          { size: '41', stock: 12 },
          { size: '42', stock: 10 },
          { size: '43', stock: 8 }
        ],
        colors: ['Black', 'Brown'],
        tags: ['height', 'premium', 'luxury', 'formal'],
        featured: true,
        rating: 4.8,
        reviewCount: 234
      }
    ];

    await Shoe.insertMany(shoes);
    console.log(`✅ Created ${shoes.length} shoes`);

    console.log('🎉 Seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();