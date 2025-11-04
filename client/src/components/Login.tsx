import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

interface LoginProps {
  onClose?: () => void;
  onSwitchToRegister?: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        onClose?.();
      } else {
        if (!name || !email || !password) {
          throw new Error('Vui lòng điền đầy đủ thông tin');
        }
        await register(name, email, password, phone);
        onClose?.();
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-container" onClick={(e) => e.stopPropagation()}>
        <button className="login-close" onClick={onClose}>✕</button>
        
        <div className="login-header">
          <div className="login-icon">👟</div>
          <h2>{isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}</h2>
          <p>{isLogin ? 'Đăng nhập để mua sắm thả ga' : 'Đăng ký ngay để nhận ưu đãi'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label>
                <span className="label-icon">👤</span>
                Họ và tên
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên của bạn"
                required={!isLogin}
                className="input-modern"
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label>
                <span className="label-icon">📱</span>
                Số điện thoại (tùy chọn)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
                className="input-modern"
              />
            </div>
          )}

          <div className="form-group">
            <label>
              <span className="label-icon">📧</span>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="input-modern"
            />
          </div>

          <div className="form-group">
            <label>
              <span className="label-icon">🔒</span>
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              className="input-modern"
            />
          </div>

          {error && (
            <div className="error-message-modern">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" className="login-submit-modern" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Đang xử lý...
              </>
            ) : (
              <>
                {isLogin ? '🚀 Đăng Nhập' : '✨ Đăng Ký'}
              </>
            )}
          </button>
        </form>

        <div className="login-switch-modern">
          {isLogin ? (
            <>
              <p>Chưa có tài khoản?</p>
              <button type="button" onClick={() => setIsLogin(false)} className="switch-btn-modern">
                Đăng ký ngay →
              </button>
            </>
          ) : (
            <>
              <p>Đã có tài khoản?</p>
              <button type="button" onClick={() => setIsLogin(true)} className="switch-btn-modern">
                Đăng nhập ngay →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;