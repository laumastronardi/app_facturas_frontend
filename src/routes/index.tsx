import { createBrowserRouter } from 'react-router-dom';
import InvoicesPage from '../pages/InvoicesPage';
import SuppliersPage from '../pages/SuppliersPage';
import NewSupplierPage from '../pages/NewSupplierPage';
import NewInvoicePage from '../pages/NewInvoicePage';
import LoginPage from '../pages/LoginPage';
import MainLayout from '../layouts/MainLayout';
import { PrivateRoute } from '../components/PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { 
        path: '', 
        element: <PrivateRoute><InvoicesPage /></PrivateRoute> 
      },
      { 
        path: 'invoices', 
        element: <PrivateRoute><InvoicesPage /></PrivateRoute> 
      },
      { 
        path: 'suppliers', 
        element: <PrivateRoute><SuppliersPage /></PrivateRoute> 
      },
      { 
        path: 'suppliers/new', 
        element: <PrivateRoute><NewSupplierPage /></PrivateRoute> 
      },
      { 
        path: 'invoices/new', 
        element: <PrivateRoute><NewInvoicePage /></PrivateRoute> 
      },
    ],
  },
]);
