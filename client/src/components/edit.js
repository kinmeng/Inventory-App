import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
// import '../styles/editPage.css'
import { Button, Modal } from 'react-bootstrap';

export default function Edit({ productID, onEdit }) {
  const [form, setForm] = useState({
    name: "",
    desciption: "",
    price: "",
    category: "",
    sku: "",
  });
  //  const [modalIsOpen, setModalIsOpen] = useState(true)
  //  const params = useParams();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [show, setShow] = useState(false);
  const [products, setProducts] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const baseURL = "http://localhost:5000"

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const editedProduct = {
      name: form.name,
      description: form.description,
      price: form.price,
      category: form.category,
      sku: form.sku
    };

    setIsUpdating(true);

    try {

      // This will send a post request to update the data in the database.
      const response= await fetch(`${baseURL}/products/update/${productID}`, {
        method: "PATCH",
        body: JSON.stringify(editedProduct),
        headers: {
          'Content-Type': 'application/json'
        },
      });

      
      const results = await fetchProducts();
  
      handleClose();
      onEdit(results);
      navigate("/products");

    }

    catch (error) {
      // Handle the error if the update request fails
      console.log(error)
      window.alert("An error occurred while updating. Please try again.");
    } finally {
      setIsUpdating(false); // Update process completed
    }


  }

  async function fetchProducts() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseURL}/products/`, {
        headers: {
          'Authorization': `Bearer ${token}` // Replace with your token
        },
        method: "GET"
      });
      // Set the product list state with the fetched products data
      // Assuming the response contains an array of products
      const productsData = await response.json();
      return productsData
    } catch (error) {
      console.log(error);
      window.alert("An error occurred while fetching products. Please try again.");
    }
  }



  useEffect(() => {
    document.body.style.background = 'white'
    document.body.style.display = 'block'
    async function fetchData() {
      //  const id = params.id.toString();
      console.log(productID)
      const response = await fetch(`${baseURL}/products/${productID}`)

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const product = await response.json();
      if (!product) {
        window.alert(`Product with id ${productID} not found`);
        navigate("/products");
        return;
      }

      setForm(product);
    }

    fetchData();

    return;
  }, [productID, navigate]);




  // This following section will display the form that takes input from the user to update the data.
  return (
    <React.Fragment>
      <Button className="me-1" data-bs-toggle="modal" onClick={handleShow}>
        Update
      </Button>

      <Modal show={show}>
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body> <form onSubmit={onSubmit}>
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
            <label htmlFor="sku">SKU: </label>
            <input
              type="number"
              className="form-control"
              id="sku"
              value={form.sku}
              onChange={(e) => updateForm({ sku: e.target.value })}
            />
          </div>

          <br />

          <div className="form-group">
            <input
              type="submit"

              value={isUpdating ? "Updating..." : "Update Product"}
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