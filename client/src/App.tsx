import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import './App.css';

const API_URL = 'http://localhost:5001/api';

interface Shoe {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount: number;
  images: string[];
  category: any;
  sizes: { size: string; stock: number }[];
  colors: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

function App() {
  const { user, logout } = useAuth();
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchFeaturedShoes();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFeaturedShoes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/shoes?featured=true`);
      const data = await response.json();
      // Đảm bảo chỉ hiển thị sản phẩm có hình ảnh
      const shoesWithImages = data.filter((shoe: Shoe) => 
        shoe.images && shoe.images.length > 0 && shoe.images[0]
      );
      setShoes(shoesWithImages);
    } catch (error) {
      console.error('Error fetching shoes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Get featured products with images - ưu tiên ảnh local
  const featuredProducts = shoes
    .filter(shoe => shoe.featured && shoe.images && shoe.images.length > 0)
    .slice(0, 4)
    .map(shoe => {
      // Nếu ảnh đầu tiên là URL bị lỗi, thử ảnh tiếp theo
      const firstImage = shoe.images?.[0] || '';
      return {
        ...shoe,
        images: shoe.images || []
      };
    });

  return (
    <div className="App tamanh-style">
      {/* Header */}
      <header className="header-tamanh">
        <div className="container">
          <div className="header-content-tamanh">
            <div className="logo-tamanh">
              <span className="logo-icon-t">🐿️</span>
              <span className="logo-text-tamanh">SOC STORE</span>
            </div>
            
            <nav className="nav-tamanh">
              <a href="#home" className="nav-item-tamanh">Trang chủ</a>
              <a href="#products" className="nav-item-tamanh">Sản phẩm</a>
              <a href="#about" className="nav-item-tamanh">Giới thiệu</a>
              <a href="#blog" className="nav-item-tamanh">Blog</a>
              <a href="#contact" className="nav-item-tamanh">Liên hệ</a>
            </nav>

            <div className="header-actions-tamanh">
              <button className="icon-btn-tamanh">🔍</button>
              <button className="icon-btn-tamanh cart-btn-tamanh">
                🛒 <span className="cart-count-badge">{cartCount}</span>
              </button>
              {user ? (
                <div className="user-menu-tamanh">
                  <button className="user-avatar-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                    {user.name.charAt(0)}
                  </button>
                  {showUserMenu && (
                    <>
                      <div className="dropdown-backdrop" onClick={() => setShowUserMenu(false)}></div>
                      <div className="user-dropdown-tamanh">
                        <div className="user-info-tamanh">
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </div>
                        <button className="dropdown-item-tamanh" onClick={() => setShowUserMenu(false)}>
                          👤 Tài khoản
                        </button>
                        <button className="dropdown-item-tamanh" onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}>
                          🚪 Đăng xuất
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button className="login-btn-tamanh" onClick={() => setShowLogin(true)}>
                  Đăng Nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Chỉ hình, không text overlay */}
      <section className="hero-tamanh">
        <div className="hero-banner-image" style={{ backgroundImage: 'url(/banner-hero.jpg)' }}></div>
      </section>

      {/* Product Categories */}
      <section className="categories-tamanh" id="products">
        <div className="container">
          <h2 className="section-title-tamanh">Danh mục sản phẩm</h2>
          <div className="categories-grid-tamanh">
            <div className="category-card-large-tamanh" onClick={() => setSelectedCategory('all')}>
              <div className="category-image-large">
                <img src="/banner-feedback.jpg" alt="Giày da nam" />
              </div>
              <div className="category-overlay-large-tamanh">
                <h3>Giày da nam</h3>
                <p>Bộ sưu tập giày da nam cao cấp</p>
                <button className="category-btn-tamanh">XEM TẤT CẢ</button>
              </div>
            </div>
            
            {categories.filter(cat => 
              cat.name.includes('Giày') || cat.name.includes('giày')
            ).filter(cat => cat.name !== 'Giày sneaker' && cat.name !== 'Giày da nam').slice(0, 4).map((cat, index) => {
              // Map ảnh cho từng category từ folder ảnh
              const categoryImages: { [key: string]: string } = {
                'Giày lười nam': '/category-luoi.jpg',
                'Giày tăng chiều cao': '/category-height-increase.jpg',
                'Giày tây nam': '/category-tay-nam.jpg',
                'Giày boot': '/category-boot.jpg',
                'Giày da nam': '/category-da-nam.jpg'
              };
              
              const catImage = categoryImages[cat.name] || '/category-luoi.jpg';
              
              return (
                <div key={cat._id} className="category-card-small-tamanh" onClick={() => setSelectedCategory(cat._id)}>
                  <div className="category-image-small">
                    <img src={catImage} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                  <div className="category-name-vertical-tamanh">{cat.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lookbook Section - Chỉ về giày */}
      <section className="lookbook-tamanh">
        <div className="container">
          <h2 className="section-title-tamanh">Lookbook</h2>
          <div className="lookbook-grid-tamanh">
            <div className="lookbook-card-tamanh">
              <div className="lookbook-image-tamanh">
                <img src="/lookbook-da.jpg" alt="Lookbook giày da" />
              </div>
              <div className="lookbook-content-tamanh">
                <h3>Lookbook giày da</h3>
                <p>Khám phá phong cách đa dạng và tinh tế của giày da cao cấp. Từ cổ điển đến hiện đại, mỗi đôi giày đều kể một câu chuyện riêng.</p>
              </div>
            </div>
            <div className="lookbook-card-tamanh">
              <div className="lookbook-image-tamanh">
                <img src="/lookbook-tay.jpg" alt="Lookbook giày tây nam" />
              </div>
              <div className="lookbook-content-tamanh">
                <h3>Lookbook giày tây nam</h3>
                <p>Phong cách lịch lãm và thanh lịch với các mẫu giày tây nam cao cấp. Hoàn thiện outfit công sở chuyên nghiệp.</p>
              </div>
            </div>
            <div className="lookbook-card-tamanh">
              <div className="lookbook-image-tamanh">
                <img src="/lookbook-luoi.jpg" alt="Lookbook giày lười" />
              </div>
              <div className="lookbook-content-tamanh">
                <h3>Lookbook giày lười</h3>
                <p>Sự kết hợp hoàn hảo giữa thoải mái và thời trang. Giày lười da thật mang đến phong cách đẳng cấp cho người đàn ông hiện đại.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-tamanh">
        <div className="container">
          <h2 className="section-title-tamanh">Sản phẩm nổi bật</h2>
          <div className="products-grid-tamanh">
            {loading ? (
              <div className="loading-tamanh">Đang tải...</div>
            ) : featuredProducts.length === 0 ? (
              <div className="empty-tamanh">Chưa có sản phẩm</div>
            ) : (
              featuredProducts.map(shoe => (
                <div key={shoe._id} className="product-card-tamanh" onClick={() => setSelectedShoe(shoe)}>
                  <div className="product-image-tamanh">
                    {shoe.images && shoe.images[0] ? (
                      <img 
                        src={shoe.images[0]} 
                        alt={shoe.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // Thử ảnh tiếp theo nếu có
                          const currentIndex = shoe.images?.indexOf(target.src) || 0;
                          if (shoe.images && shoe.images.length > currentIndex + 1) {
                            target.src = shoe.images[currentIndex + 1];
                          } else {
                            target.style.display = 'none';
                            const placeholder = document.createElement('div');
                            placeholder.className = 'product-placeholder';
                            placeholder.textContent = '👟';
                            target.parentElement?.appendChild(placeholder);
                          }
                        }}
                      />
                    ) : (
                      <div className="product-placeholder">👟</div>
                    )}
                    {shoe.discount > 0 && (
                      <span className="sale-badge-absolute">GIẢM GIÁ</span>
                    )}
                  </div>
                  <div className="product-info-tamanh">
                    <h3>{shoe.name}</h3>
                    <div className="product-price-tamanh">
                      {shoe.originalPrice && shoe.originalPrice > shoe.price ? (
                        <>
                          <span className="old-price-tamanh">{formatPrice(shoe.originalPrice)} đ</span>
                          <span className="current-price-tamanh">{formatPrice(shoe.price)} đ</span>
                        </>
                      ) : (
                        <span className="current-price-tamanh">{formatPrice(shoe.price)} đ</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="value-prop-tamanh">
        <div className="container">
          <h2 className="value-title-tamanh">Lựa chọn Giày da Sóc Store</h2>
          <div className="value-grid-tamanh">
            <div className="value-item-tamanh">
              <div className="value-icon-tamanh">🏷️</div>
              <h3>Giày da thật 100%</h3>
            </div>
            <div className="value-item-tamanh">
              <div className="value-icon-tamanh">🚚</div>
              <h3>Miễn phí vận chuyển trên Toàn quốc</h3>
            </div>
            <div className="value-item-tamanh">
              <div className="value-icon-tamanh">✓</div>
              <h3>Bảo hành 12 tháng</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="blog-tamanh" id="blog">
        <div className="container">
          <h2 className="section-title-tamanh">Blog thời trang</h2>
          <div className="blog-grid-tamanh">
            {[
              {
                title: 'Chụp kỷ yếu nên đi giày gì? Tips chọn giày kỷ yếu...',
                date: '15/03/2024',
                views: '1,234',
                image: '/blog-ky-yeu.jpg'
              },
              {
                title: 'Gợi Ý 30+ Món Quà Tặng Tốt Nghiệp Nam Ý Nghĩa...',
                date: '12/03/2024',
                views: '2,156',
                image: '/blog-qua-tang.jpg'
              },
              {
                title: 'Nguồn gốc lịch sử của giay da, giày da xuất hiện...',
                date: '10/03/2024',
                views: '987',
                image: '/blog-lich-su.jpg'
              },
              {
                title: '6+ Cách tháo thắt lưng nam đơn giản với từng lo...',
                date: '08/03/2024',
                views: '1,543',
                image: '/blog-that-lung.jpg'
              }
            ].map((blog, index) => (
              <div key={index} className="blog-card-tamanh">
                <div className="blog-image-tamanh">
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = document.createElement('div');
                      placeholder.className = 'blog-placeholder';
                      placeholder.textContent = '📰';
                      placeholder.style.cssText = 'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; font-size: 3rem;';
                      target.parentElement?.appendChild(placeholder);
                    }}
                  />
                </div>
                <div className="blog-meta-tamanh">
                  <span>{blog.date}</span>
                  <span>👁️ {blog.views}</span>
                </div>
                <h3>{blog.title}</h3>
                <p>Khám phá những xu hướng và bí quyết thời trang mới nhất...</p>
              </div>
            ))}
          </div>
          <div className="blog-view-all">
            <button className="view-all-btn">XEM TẤT CẢ</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-tamanh">
        <div className="container">
          <h2 className="section-title-tamanh">Báo chí nói về chúng tôi</h2>
          <div className="testimonial-grid-tamanh">
            <div className="testimonial-slide-tamanh">
              <div className="testimonial-content-tamanh">
                <div className="quote-icon">"</div>
                <p>Luôn mong chờ 1 đôi giày chunky được nhà Sóc Store ra mắt, GNTA51-5103-D đã giải quyết được mọi nhu cầu của tôi về một đôi giày vừa trẻ trung, vừa lịch lãm có thể phối đồ đi làm công sở lẫn đi chơi dạo phố</p>
                <div className="testimonial-rating">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <div className="testimonial-author">Đức Việt</div>
              </div>
            </div>
            <div className="testimonial-slide-tamanh">
              <div className="testimonial-content-tamanh">
                <div className="quote-icon">"</div>
                <p>Giày da Oxford GNTA51-5104-D của Sóc Store thật sự làm tôi ấn tượng. Chất liệu da mềm mại, đường may tỉ mỉ và đế chunky rất ổn định. Tôi đã mua 2 đôi và sẽ tiếp tục ủng hộ thương hiệu này.</p>
                <div className="testimonial-rating">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <div className="testimonial-author">Minh Quang</div>
              </div>
            </div>
            <div className="testimonial-slide-tamanh">
              <div className="testimonial-content-tamanh">
                <div className="quote-icon">"</div>
                <p>Từ ngày biết đến giày tăng chiều cao GCTA22-20244-D, tôi tự tin hơn rất nhiều. Đế dày nhưng không lộ, thiết kế thanh lịch phù hợp mọi hoàn cảnh. Dịch vụ chăm sóc khách hàng của Sóc Store cũng rất tốt.</p>
                <div className="testimonial-rating">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <div className="testimonial-author">Văn Hùng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-tamanh" id="contact">
        <div className="container">
          <div className="footer-grid-tamanh">
            <div className="footer-col-tamanh">
              <h3>Hà Nội</h3>
              <p>86 Cầu Giấy, Q.Cầu Giấy<br />(024)6673 6901</p>
              <p>44 Bùi Thị Xuân, Q.Hai Bà Trưng<br />(024)6688 2428</p>
              <p>105 Tây Sơn, Q.Đống Đa<br />(024) 6658 8777</p>
              <p>11 Quán Thánh, Q.Ba Đình<br />(024) 665 73 555</p>
            </div>
            
            <div className="footer-col-tamanh">
              <h3>Giày da Sóc Store</h3>
              <p>CÔNG TY TNHH TỔNG HỢP SÓC STORE</p>
              <p>Địa chỉ: Số 44 Bùi Thị Xuân, Phường Nguyễn Du, Quận Hai Bà Trưng, Thành phố Hà Nội</p>
              <p>Email: cskh@socstore.net</p>
              <div className="social-tamanh">
                <a href="#" className="social-icon">📘</a>
                <a href="#" className="social-icon">📷</a>
                <a href="#" className="social-icon">▶️</a>
                <a href="#" className="social-icon">💬</a>
              </div>
            </div>
            
            <div className="footer-col-tamanh">
              <h3>Tỉnh thành khác</h3>
              <p>70 Hoàng Văn Thụ - TP. Bắc Giang<br />(020)4655 4886</p>
            </div>
            
            <div className="footer-col-tamanh">
              <h3>Hướng dẫn mua hàng</h3>
              <p>Hướng dẫn mua hàng</p>
              <p>Chính sách đổi trả</p>
              <p>Phương thức thanh toán</p>
            </div>
            
            <div className="footer-col-tamanh">
              <h3>Chính sách khách hàng</h3>
              <p>Chính sách vận chuyển</p>
              <p>Chính sách bảo mật</p>
              <p>Chính sách bảo hành</p>
            </div>
          </div>
          
          <div className="footer-hotline-tamanh">
            <div className="hotline-badge-tamanh">Hotline: <strong>0333 50 3333</strong></div>
          </div>
          
          <div className="footer-bottom-tamanh">
            <p>© 2018-2024 SocStore.net. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Icons */}
      <div className="floating-icons-tamanh">
        <button className="float-btn-tamanh chat-btn">💬</button>
        <button className="float-btn-tamanh phone-btn">📞</button>
      </div>

      {/* Product Detail Modal */}
      {selectedShoe && (
        <div className="modal-tamanh" onClick={() => setSelectedShoe(null)}>
          <div className="modal-content-tamanh" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-tamanh" onClick={() => setSelectedShoe(null)}>✕</button>
            <div className="modal-product-tamanh">
              <div className="modal-image-tamanh">
                {selectedShoe.images && selectedShoe.images[0] ? (
                  <img src={selectedShoe.images[0]} alt={selectedShoe.name} />
                ) : (
                  <div className="modal-placeholder">👟</div>
                )}
              </div>
              <div className="modal-info-tamanh">
                <h2>{selectedShoe.name}</h2>
                <div className="modal-price-tamanh">
                  {selectedShoe.originalPrice && (
                    <span className="modal-old-price">{formatPrice(selectedShoe.originalPrice)} đ</span>
                  )}
                  <span className="modal-current-price">{formatPrice(selectedShoe.price)} đ</span>
                </div>
                <p>{selectedShoe.description}</p>
                {selectedShoe.sizes && (
                  <div className="modal-sizes-tamanh">
                    <h4>Kích cỡ:</h4>
                    <div className="size-buttons-tamanh">
                      {selectedShoe.sizes.map((s, i) => (
                        <button key={i} className="size-btn-tamanh" disabled={s.stock === 0}>
                          {s.size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="modal-actions-tamanh">
                  <button className="btn-buy-tamanh">Mua ngay</button>
                  <button className="btn-cart-tamanh">Thêm vào giỏ</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default App;