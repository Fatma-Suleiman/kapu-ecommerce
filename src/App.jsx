import { Routes, Route } from "react-router-dom";
import { HomePage } from './pages/HomePage';
import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css'
import { CheckoutPage } from "./pages/CheckoutPage";
import {OrdersPage} from './pages/OrdersPage';


function App() {
 const[cart,setCart] = useState([]);

useEffect(()=>{
  axios.get("/api/cart-items?expand=product")
  .then((response)=>{
 setCart(response.data);
  });
})

  
  return (
    <Routes>
      <Route index element={  <HomePage cart={cart}/>}/>
      <Route path="checkout" element ={<CheckoutPage  cart={cart}/>}/>
      <Route path="orders" element ={<OrdersPage/>}/>
  </Routes>
  )
}

export default App
