import './App.css'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import NavBar from './components/Navbar';
import { useEffect, useState } from 'react';
import LoginComponent from './components/LoginComponent';
import { AuthService } from './services/AuthService';
import { DataService } from './services/DataService';
import CreateAnimals from './components/animals/CreateAnimals';
import Animals from './components/animals/Animals';

const authService = new AuthService();
const dataService = new DataService(authService);


function App() {
  const [userName, setUserName] = useState<string | undefined>(undefined);

  useEffect(() => {
    authService.tryRestoreSession().then(restoredUserName => {
      if (restoredUserName) {
        setUserName(restoredUserName);
      }
    });
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUserName(undefined);
  };

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar userName={userName} onLogout={handleLogout} />
          <Outlet />
        </>
      ),
      children: [
        {
          path: "/",
          element: <div>Hello world!</div>,
        },
        {
          path: "/login",
          element: <LoginComponent authService={authService} setUserNameCb={setUserName} />,
        },
        {
          path: "/profile",
          element: <div>Profile page</div>,
        },
        {
          path: "/createAnimals",
          element: <CreateAnimals dataService={dataService} />,
        },
        {
          path: "/animals",
          element: <Animals dataService={dataService} />,
        },
      ]
    },
  ]);

  return (
    <div className="wrapper">
      <RouterProvider router={router} />
    </div>
  )
}

export default App