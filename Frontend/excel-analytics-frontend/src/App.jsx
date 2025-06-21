  import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes, adminRoutes } from './routes/routeConfig.jsx';
import PublicRoutes from './routes/PublicRoutes';
import PrivateRoutes from './routes/PrivateRoutes';
import AdminRoutes from './routes/AdminRoutes';
import NotFound from './pages/NotFound.jsx';
import MainLayout from './components/MainLayout.jsx';

const App = () => {
  return (
    <Router>
      <Routes>

        <Route element={<MainLayout />}>


          <Route element={<PublicRoutes />}>
            {publicRoutes.map(({ path, element }, i) => (
              <Route key={i} path={path} element={element} />
            ))}
          </Route>


          <Route element={<PrivateRoutes />}>
            {privateRoutes.map(({ path, element }, i) => (
              <Route key={i} path={path} element={element} />
            ))}
          </Route>


          <Route element={<AdminRoutes />}>
            {adminRoutes.map(({ path, element }, i) => (
              <Route key={i} path={path} element={element} />
            ))}
          </Route>


          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
    </Router>
  )
}

export default App;
