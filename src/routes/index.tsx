import { createBrowserRouter } from 'react-router-dom';
import InvoicesPage from '../pages/InvoicesPage';
import SuppliersPage from '../pages/SuppliersPage';
import NewSupplierPage from '../pages/NewSupplierPage';
import NewInvoicePage from '../pages/NewInvoicePage';
import MainLayout from '../layouts/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '', element: <InvoicesPage /> },
      { path: 'suppliers', element: <SuppliersPage /> },
      { path: 'suppliers/new', element: <NewSupplierPage /> },
      { path: 'invoices/new', element: <NewInvoicePage /> },
    ],
  },
]);
