import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout';
import Home from './routes/Home';
import Profile from './routes/Profile';
import CreateAcount from './routes/CreateAcount';
import SingIn from './routes/SignIn';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/loadingScreen/LoadingScreen';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        path: '',
        element: <Home />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/create-acount',
    element: <CreateAcount />,
  },
  {
    path: '/sign-in',
    element: <SingIn />,
  },
]);

const GlobalStyles = createGlobalStyle`
${reset};
*{
  box-sizing: border-box;
}
body{
  background-color: black;
  color: #FFF;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
  ;
}
`;

function App() {
  /**
   * Firebase Authentication 사용을 위한 로직
   * : user token, cookies등 user정보를 받아오는 동안 로딩 화면을 보여줄 것.
   
  */

  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const init = async () => {
    //wait for firebase

    setIsLoading(false);
    // setTimeout(() => setIsLoading(false), 2000);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;
