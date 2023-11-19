import React, { useState, useEffect } from "react";
// import { useParams} from "react-router";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';


export default function EditSale({ saleID, onEdit }) {

  //  const params = useParams();

  const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    price: "",
    quantity: ""
  });

  const [productNames, setProductNames] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [show, setShow] = useState(false);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);  
  const baseURL = "http://localhost:5000"




  // Fetch the object names from the API
  useEffect(() => {
    async function fetchProductNames() {
      try {
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
    fetchProductNames();
  }, []);



  function handleProductChange(event) {
    setSelectedProduct(event.target.value);
  }



  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  useEffect(() => {
    async function fetchData() {
      const id = saleID;
      const response = await fetch(`${baseURL}/sales/${id}`);

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const sale = await response.json();
      console.log(sale)
      if (!sale) {
        window.alert(`Sale with id ${id} not found`);
        navigate("/");
        return;
      }

      setForm(sale);
    }

    fetchData();

    return;
  }, [saleID, navigate]);

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
    return sales
  }


  async function onSubmit(e) {
    e.preventDefault();
    const editedSale = {
      productName: form.productName,
      //productName: form.Name,
      productDescription: form.productDescription,
      price: form.price,
      quantity: form.quantity
    };

    setIsUpdating(true);
    console.log(editedSale)

    try {

      // This will send a post request to update the data in the database.
      await fetch(`${baseURL}/sales/update/${saleID}`, {
        method: "PATCH",
        body: JSON.stringify(editedSale),
        headers: {
          'Content-Type': 'application/json'
        },
      });


      setForm({
        productName: "",
        productDescription: "",
        price: "",
        quantity: "",
      });

    
      const results = await getSales();
      handleClose();
      onEdit(results);
      navigate("/sales");
   
      // fetchData();  

    }

    catch (error) {
      // Handle the error if the update request fails
      window.alert("An error occurred while updating. Please try again.");
    } finally {
      setIsUpdating(false); // Update process completed
    }


  }

  // This following section will display the form that takes input from the user to update the data.
  return (
    <React.Fragment>
       <Button className="me-1" data-bs-toggle="modal" onClick={handleShow}>
        Update
      </Button>
      <Modal show={show}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Title>Update Sale</Modal.Title>
        <Modal.Body>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name: </label>
            <select
              className="form-control"
              id="productName"
              value={form.productName}
              onChange={(e) => {
                updateForm({ productName: e.target.value })
              }}>
              <option value="">Select a product</option>
              {productNames.map((productName) => (
                <option key={productName} value={productName} selected={form.productName === productName ? "selected" : undefined}>
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
              value={form.productDescription}
              onChange={(e) => updateForm({ productDescription: e.target.value })}
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
            <label htmlFor="quantity">Quantity: </label>
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

              value={isUpdating ? "Updating..." : "Update Transaction"}
              className="btn btn-primary"
              disabled={isUpdating}
            />
          </div>
        </form></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
        </Modal>
    </React.Fragment>
  );
}