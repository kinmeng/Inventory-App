import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import ProductList from "./components/productList";
import Edit from "./components/edit";
import CreateProduct from "./components/createProduct";
import CreateSale from "./components/createSale";
import EditSale from "./components/editSale";
import TransactionList from "./components/transactionList"
import LoginPage from "./components/loginPage";
import RegistrationPage from "./components/registrationPage";

 
const App = () => {
 return (
   <div>
     {/* <Navbar /> */}
     <Routes>
       <Route exact path="/" element={<LoginPage/>} />
       <Route exact path="/login" element={<LoginPage/>} />
       <Route exact path="/register" element={<RegistrationPage/>} />
       <Route path="/products" element={<ProductList />} />
       <Route path="/edit/:id" element={<Edit />} />
       <Route path="/sales/edit/:id" element={<EditSale />} />
       <Route path="/createProduct" element={<CreateProduct />} />
       <Route path="/createSale" element={<CreateSale />} />
       <Route path="/sales/" element={<TransactionList />} />
     </Routes>
   </div>
 );
};
 
export default App;