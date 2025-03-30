export function authGuard(to, from, next) {
    const token = localStorage.getItem('token');
  if (!token || isTokenExpired(token)) {
    return next({ name: 'login' });
  }
  
    next();
  }

  function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã payload
      const exp = payload.exp; // Thời gian hết hạn
      const now = Math.floor(Date.now() / 1000); // Thời gian hiện tại
      return exp < now; // Token hết hạn nếu `exp` nhỏ hơn thời gian hiện tại
    } catch (e) {
      console.error('Token không hợp lệ', e);
      return true; // Token không hợp lệ hoặc lỗi giải mã
    }
  }
// roleGuard.js
export function roleGuard(to, from, next) {
    const userRole = localStorage.getItem('role');
    
    if (to.meta.requiredRole === 0 && userRole !== '0') {
      return next({ name: 'AdminPage' });
    }
  
    if (to.meta.requiredRole === 1 && userRole !== '1') {
      return next({ name: 'UserHome' });
    }
  
    next();
  }