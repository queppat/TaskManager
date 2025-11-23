import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <header>
        <h1>Welcome to Task Manager</h1>
        <div>
          <span>Hello, {user?.username}!</span>
          <span>Roles: {user?.roles?.join(', ')}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <main>
        <p>This is a protected page. Only authenticated users can see this.</p>
      </main>
    </div>
  );
};

export default Home;