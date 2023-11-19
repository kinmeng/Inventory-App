import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useState } from "react";
import Navbar from './navbar';
import Footer from './footerbar';
import '../styles/productPage.css';
import { Table, Button } from 'react-bootstrap';
import Edit from '../components/edit.js';


export default function ProductList() {
  const [products, setProducts] = useState([]);

  const baseURL =  process.env.REACT_APP_BASE_URL;

  const handleEdit = (updatedProductList) => {
    setProducts(updatedProductList); // Close the modal after the update
  };

    // This method will delete a record
   function deleteProduct(id) {

      fetch(`${baseURL}/products/${id}`, {
        method: "DELETE"
      });
  
  
    // Remove the deleted product from the products state
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== id)
    );
    
    }

  const Product = (props) => (
    <tr>
      <td>{props.product.name}</td>
      <td>{props.product.description}</td>
      <td>{props.product.price}</td>
      <td>{props.product.category}</td>
      <td><img src={props.product.sku} style={{ width: '10rem' }} /></td>
      <td><img src={props.product.productImage} style={{ width: '10rem' }} /></td>
      <td>

        <Edit productID={props.product._id} onEdit={handleEdit} />
        <Button className='btn-danger'
          onClick={() => {
           deleteProduct(props.product._id);
          }}>
          Delete
        </Button>
   

      </td>
    </tr>
  );

  // This method fetches the records from the database.
  useEffect(() => {
    document.body.style.background = 'white'
    document.body.style.display = 'block'
    async function getProducts() {

      const token = localStorage.getItem('token');
      const response = await fetch(`${baseURL}/products/`, {
        headers: {
          'Authorization': `Bearer ${token}` // Replace with your token
        },
        method: "GET"
      });

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const products = await response.json();
      setProducts(products);
    }

    getProducts();

    return () => {
      // Reset the body styles to their original values when the component is unmounted
      document.body.style.background = '';
      document.body.style.display = ''
    };
  }, []);


  // This method will map out the records on the table
  function productList() {
    return products.map((product) => {
      return (
        <Product
          product={product}
          // deleteProduct={() => deleteProduct(product._id)}
          key={product._id}
        />
      );
    });
  }


  // This following section will display the table with the records of individuals.
  return (
    <React.Fragment>
       <Navbar />
    <div id="product-page">
     
      <div>
        <div className="intro-section">
          <h3>Product List</h3>
          <Button style={{marginTop: 20}} href='/createProduct'>Create a new product</Button>
        </div>
       
        <Table table-dark bordered style={{ marginTop: 20, marginBottom:20}} >
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>SKU</th>
              <th>Product</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{productList()}</tbody>


          <tfoot className="table-dark" colSpan="3" />
        </Table>
      </div>
      
    </div>
    <Footer />
    </React.Fragment>
  );
}