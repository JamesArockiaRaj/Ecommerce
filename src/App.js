import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Header from './landingpage/Header';
import Slider from './landingpage/Slider';
import Product from './landingpage/Product';
import { collection, query, getDocs, where,getFirestore } from 'firebase/firestore'; 


function App() {
  const [StoreItems, setStoreItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading,setLoading]=useState(true)

  const db = getFirestore();

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products'); // Change this path to your Firestore collection

      const querySnapshot = await getDocs(productsCollection);
      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      setStoreItems(data);
      setFilteredItems(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleFilter = (filtered) => {
    setFilteredItems(filtered);
  };
 

  return (
    <div>
      <Header  items={StoreItems} onFilter={handleFilter} wishlist={wishlist}></Header>
      <Slider></Slider>
      <Product loading={loading} items={filteredItems} wishlist={wishlist} setWishlist={setWishlist} />
    </div>
  );
}

export default App;