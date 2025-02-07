import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <h1>This Page use layout</h1>
      <Outlet />
    </>
  );
}
