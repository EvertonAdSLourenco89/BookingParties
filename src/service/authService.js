const authService = {
    login: (username, password) => {
  
      const users = [
        { username: 'admin', password: '123', role: 'admin' },
        { username: 'proprietario', password: '123', role: 'proprietario' },
        { username: 'cliente', password: '123', role: 'cliente' },
      ];
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user.role));
      }
      return user;
    },
    getCurrentUser: () => JSON.parse(localStorage.getItem('user')),
    logout: (navigate) => {
      localStorage.removeItem('user');
      if (navigate) navigate('/login');
    }
  };
  
  export default authService;