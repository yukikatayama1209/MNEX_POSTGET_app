import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [prices, setPrices] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    product: "",
    purchase_date: "",
    shop_location: "",
    product_photo: "",
    comments: "",
  });

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/prices/");
      setPrices(response.data);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/prices/", formData);
      fetchPrices();
    } catch (error) {
      console.error("Error posting price:", error);
    }
  };

  return (
    <div>
      <h1>Prices</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="text"
          name="product"
          placeholder="Product"
          value={formData.product}
          onChange={handleChange}
        />
        <input
          type="date"
          name="purchase_date"
          value={formData.purchase_date}
          onChange={handleChange}
        />
        <input
          type="text"
          name="shop_location"
          placeholder="Shop Location"
          value={formData.shop_location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="product_photo"
          placeholder="Product Photo URL"
          value={formData.product_photo}
          onChange={handleChange}
        />
        <textarea
          name="comments"
          placeholder="Comments"
          value={formData.comments}
          onChange={handleChange}
        />
        <button type="submit">Add Price</button>
      </form>

      <ul>
        {prices.map((price) => (
          <li key={price.id}>
            {price.username} bought {price.product} on {price.purchase_date} at{" "}
            {price.shop_location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
