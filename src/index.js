import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css'
import App from './App';
import About from './pages/About';
import Login from './pages/Login';
import Checkout from "./pages/checkout";
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Contact from './pages/Contact';
import WishList from './pages/WishList';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import ProductAdmin from './Admin/ProductAdmin';
import  AdminPage from './Admin/AdminPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path:"/about",
    element: <About/>,
  },
  {
    path:"/contact",
    element: <Contact/>,
  },  
  {
    path:"/login",
    element: <Login/>,
  }, 
  {
    path:"/wishList",
    element: <WishList/>,
  }, 
  {
    path:"/Cart",
    element: <Cart/>,
  }, 
  {
    path:"/checkout",
    element:<Checkout/> 
  },
  {
    path:"/productdetails",
    element:<ProductDetails/> 
  },
  {
    path:"/addProduct",
    element:<ProductAdmin/> 
  },
  {
    path:"/AdminPage",
    element:<AdminPage/> 
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

reportWebVitals();
