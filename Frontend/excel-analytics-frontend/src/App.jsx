import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes, adminRoutes } from './routes/routeConfig.jsx';
import PublicRoutes from './routes/PublicRoutes';
// import PrivateRoutes from './routes/PrivateRoutes';
// import AdminRoutes from './routes/AdminRoutes';
import NotFound from './pages/NotFound.jsx';
import MainLayout from './components/MainLayout.jsx';

// const App = () => {
//   return (
//     <Router>
//       <Routes>

//         <Route element={<MainLayout />}>


//           <Route element={<PublicRoutes />}>
//             {publicRoutes.map(({ path, element }, i) => (
//               <Route key={i} path={path} element={element} />
//             ))}
//           </Route>


//           <Route element={<PrivateRoutes />}>
//             {privateRoutes.map(({ path, element }, i) => (
//               <Route key={i} path={path} element={element} />
//             ))}
//           </Route>


//           <Route element={<AdminRoutes />}>
//             {adminRoutes.map(({ path, element }, i) => (
//               <Route key={i} path={path} element={element} />
//             ))}
//           </Route>


//           <Route path="*" element={<NotFound />} />

//         </Route>
//       </Routes>
//     </Router>
//   )
// }

// export default App;




const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          {/* ALL ROUTES UNDER PUBLIC ROUTES FOR DEV PREVIEW */}
          <Route element={<PublicRoutes />}>
            {/* Public routes */}
            {publicRoutes.map(({ path, element, children }, i) => (
              <Route key={i} path={path} element={element}>
                {children?.map((child, j) => (
                  <Route
                    key={j}
                    path={child.path}
                    element={child.element}
                    index={child.index}
                  />
                ))}
              </Route>
            ))}

            {/* Private routes treated as public for now */}
            {privateRoutes.map(({ path, element, children }, i) => (
              <Route key={i} path={path} element={element}>
                {children?.map((child, j) => (
                  <Route
                    key={j}
                    path={child.path}
                    element={child.element}
                    index={child.index}
                  />
                ))}
              </Route>
            ))}

            {/* Admin routes as public */}
            {adminRoutes.map(({ path, element }, i) => (
              <Route key={i} path={path} element={element} />
            ))}
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
