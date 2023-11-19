import React, { useEffect, useState } from "react";
// import { Navbar } from "react-bootstrap";
import { useNavigate } from "react-router";
import Navbar from './navbar';
import Footer from './footerbar';

export default function CreateSale() {


  const [productNames, setProductNames] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  // Fetch the object names from the API
  useEffect(() => {
    fetchProductNames();
  }, []);

  const baseURL = "http://localhost:5000"
  
  async function fetchProductNames() {
    try {
      // const response = await fetch("http://localhost:5000/products/");
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseURL}/products/`, {
        headers: {
          'Authorization': `Bearer ${token}` // Replace with your token
        },
        method: "GET"
      });

      const data = await response.json();
      const names = data.map((product) => product.name);
      setProductNames(names);
    } catch (error) {
      console.error("Error fetching product names:", error);
    }
  }

  function handleProductChange(event) {
    setSelectedProduct(event.target.value);
  }

 const [form, setForm] = useState({
  productName: "",
  productDescription: "",
  price: "",
  quantity: ""

 });
 const navigate = useNavigate();
 const [isSubmitting, setIsSubmitting] = useState(false);
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newProduct = { ...form };
   console.log(newProduct)
   setIsSubmitting(true)
   await fetch("${baseURL}/sales/add", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newProduct),
   })
   .catch(error => {
     window.alert(error);
     setIsSubmitting(false)
     return;
   });
   

   setForm({    productName: "",
                productDescription: "",
                price: "",
                quantity: "" });
   navigate("/sales/");

 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
    <Navbar />
     <h3>Create New Sale</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Product Name: </label>
         <select
            className="form-control"
            id="productName"
            value={form.Name}
            onChange={(e) => updateForm({ Name: e.target.value })}>
          <option value="">Select a product</option>
          {productNames.map((productName) => (
            <option key={productName} value={productName}>
              {productName}
            </option>))}
        </select>
        </div>

     
       <div className="form-group">
         <label htmlFor="description">Description: </label>
         <input
           type="text"
           className="form-control"
           id="productDescription"
           value={form.Description}
           onChange={(e) => updateForm({ Description: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="price">Price: </label>
         <input
           type="number"
           className="form-control"
           id="price"
           value={form.price}
           onChange={(e) => updateForm({ price: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="price">Quantity: </label>
         <input
           type="number"
           className="form-control"
           id="quantity"
           value={form.quantity}
           onChange={(e) => updateForm({ quantity: e.target.value })}
         />
       </div>
 
       <br />
 
       <div className="form-group">
         <input
           type="submit"
           
           value={isSubmitting ? "Submitting..." : "Submit Transaction"} 
           className="btn btn-primary"
           disabled={isSubmitting}
         />
       </div>
     </form>
     <Footer />
</div>
 );
}