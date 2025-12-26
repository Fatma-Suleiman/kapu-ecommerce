import { Routes, Route } from "react-router-dom";
import { HomePage } from './pages/HomePage';
import './App.css'
import { CheckoutPage } from "./pages/CheckoutPage";
import {OrdersPage} from './pages/OrdersPage';


function App() {
  return (
    <Routes>
      <Route index element={  <HomePage/>}/>
      <Route path="checkout" element ={<CheckoutPage/>}/>
      <Route path="orders" element ={<OrdersPage/>}/>
  </Routes>
  )
}

export default App
