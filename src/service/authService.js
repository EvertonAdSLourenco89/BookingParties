const authService = {
  users: [
    { username: 'admin', password: '123', role: 'admin' },
    { username: 'proprietario', password: '123', role: 'proprietario' },
    { username: 'cliente', password: '123', role: 'cliente' },
  ],
  
  getUsers: () => authService.users.map(user => ({
    username: user.username,
    role: user.role,
    name: user.name,
    email: user.email
  })),

  register: (username, password, role = 'proprietario') => {
    const userExists = authService.users.some(user => user.username === username);
    if (userExists) {
      return { error: 'Usuário já existe!' };
    }

    const newUser = { username, password, role };
    authService.users.push(newUser);
    localStorage.setItem('user', JSON.stringify(newUser.role));
    return newUser;
  },
  register2: (username, password, role = 'proprietario') => {
    const userExists = authService.users.some(user => user.username === username);
    if (userExists) {
      return { error: 'Usuário já existe!' };
    }

    const newUser = { username, password, role };
    authService.users.push(newUser);
    localStorage.setItem('user', JSON.stringify(newUser.role));
    return newUser;
  },

  login: (username, password) => {
    const user = authService.users.find(u => u.username === username && u.password === password);
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
