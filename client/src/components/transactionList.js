import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from './footerbar';
import Navbar from './navbar'
import '../styles/sale.css'
import { Table, Button } from 'react-bootstrap';
import EditSale from '../components/editSale.js';


export default function TransactionList() {
  const [sales, setSales] = useState([]);
  const baseURL =  process.env.REACT_APP_BASE_URL;
  const handleEdit = (updatedTransactionList) => {
    setSales(updatedTransactionList); // Close the modal after the update
  };

   // This method will delete a record
function deleteSale(id) {
    fetch(`${baseURL}/sales/${id}`, {
      method: "DELETE"
    });

    // Remove the deleted sa;e from the products state
    setSales((prevSales) =>
      prevSales.filter((sale) => sale._id !== id)
    );

  }

  const Sale = (props) => (
    <tr>
      <td>{props.sale.productName}</td>
      <td>{props.sale.productDescription}</td>
      <td>{props.sale.price}</td>
      <td>{props.sale.quantity}</td>
      <td>{props.sale.quantity * props.sale.price}</td>
      <td>
        <EditSale saleID={props.sale._id} onEdit={handleEdit} >Edit</EditSale> 
        <Button className="btn-danger"
          onClick={() => {
            deleteSale(props.sale._id);
              }}
        >
          Delete
        </Button>
      </td>
    </tr>
   ); 

  // This method fetches the records from the database.
  useEffect(() => {
    async function getSales() {
      const response = await fetch(`${baseURL}/sales/`, {
        method: "GET"});
  
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
  
      const sales = await response.json();
      setSales(sales);
    }
  
    getSales();
  
    return;
  }, []);

 
 
 // This method will map out the records on the table
 function saleList() {
   return sales.map((sale) => {
     return (
       <Sale
         sale={sale}
         key={sale._id}
       />
     );
   });
 }
 
 // This following section will display the table with the records of individuals.
 return (
   <div>
    <Navbar />
    

     <div id="sales-page">
     <h3 style={{marginTop:30}}>Transaction List</h3>
     <Table  table-dark bordered style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Product Name</th>
           <th>Product Description</th>
           <th>Price</th>
           <th>Quantity</th>
           <th>Total Sales</th>
           <th>Actions</th>
 
         </tr>
       </thead>
       <tbody>{saleList()}</tbody>
     </Table>
     </div>
     <Footer />
   </div>
 );
}