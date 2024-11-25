import {createBrowserRouter} from 'react-router-dom'

import AuthLayout from './layouts/AuthLayout';
import Layout from './layouts/Layout';
import Inicio from './views/Inicio';
import Login from './views/Login';
import Registro from './views/Registro';
import Producto from './components/Producto';
import AdminSidebar from './layouts/AdminLayout';
import Productos from './views/Productos';
import Ordenes from './views/Ordenes';
import AdminLayout from './layouts/AdminLayout';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children:[
            {
                index:true,
                element:<Inicio />
            }
        ]
    },
    {
        path:'/auth',
        element:<AuthLayout />,
        children:[
            {
                path:'/auth/login',
                element: <Login />,
            },
            {
                path: '/auth/registro',
                element: <Registro />
            }
        ]
    },
    {
        path:'/admin',
        element: <AdminLayout />,
        children:[
            {
                index:true,
                element: <Ordenes />

            },
            {
                path: '/admin/productos',
                element: <Productos />
            }
        ]
    }
]); 


export default router; 