import React, { useState } from "react";
import { useNavigate } from "react-router";
import '../styles/createProduct.css'
import Navbar from "../components/navbar.js";
import Footer from "../components/footerbar.js"

export default function CreateProduct() {
  const [file, setFile] = useState();
 const [form, setForm] = useState({
  name: "",
  desciption: "",
  price: "",
  category: "",
  sku: "",
  productImage: ""
 });
 const navigate = useNavigate();
 const [isSubmitting, setIsSubmitting] = useState(false);
 const baseURL = "http://localhost:5000"

 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 


const handleChange = (e) => {
  const selectedFile = e.target.files[0];
  console.log(selectedFile)
  const filePathName = selectedFile ? selectedFile.name : '';
  updateForm({ productImage: filePathName });
  setFile(URL.createObjectURL(selectedFile));
  console.log('Selected file path name:', filePathName);
};

 // This function will handle the submission.
 async function onSubmit(e) {


   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newProduct = { ...form };
  
   const token = localStorage.getItem('token');
   setIsSubmitting(true)
   const createProductURL = baseURL + "/products/add"
   await fetch(createProductURL, {
     method: "POST",
     headers: {
      'Authorization': `Bearer ${token}`,
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newProduct),
   })
   .catch(error => {
     window.alert(error);
     setIsSubmitting(false)
     return;
   });
   

   setForm({  name: "",
              desciption: "",
              price: "",
              category: "",
              sku:"",
              productImage:""});
   navigate("/");
   navigate("/products");

 }
 
 // This following section will display the form that takes the input from the user.
 return (
  <React.Fragment>
        <Navbar />
  
  <div id="createproductpage" style={{marginBottom: 100}}>
     <h3 style={{paddingTop:30 }}>Create New Product</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Name: </label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="description">Description: </label>
         <input
           type="text"
           className="form-control"
           id="description"
           value={form.description}
           onChange={(e) => updateForm({ description: e.target.value })}
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
         <label htmlFor="category">Category: </label>
         <input
           type="text"
           className="form-control"
           id="category"
           value={form.category}
           onChange={(e) => updateForm({ category: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="SKU">SKU: </label>
         <input
           type="text" 
           className="form-control"
           id="sku"
           value={form.sku}
           onChange={(e) => updateForm({ sku: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="productImage">Product Image: </label>
         <input type="file"  className="form-control" id="product-image" onChange={handleChange}/>
         <img src={file} style={{width: 300}}/>
       </div>
       <br />
 
       <div className="form-group">
         <input
           type="submit"
           
           value={isSubmitting ? "Submitting..." : "Submit Product"} 
           className="btn btn-primary"
           disabled={isSubmitting}
         />
       </div>
     </form>
   
</div>  
<Footer />
</React.Fragment>
 );
}