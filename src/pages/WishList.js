import React, { useEffect, useState } from 'react';
import Header from '../landingpage/Header';
import '../pages/Wishlist.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import * as Icon from 'react-bootstrap-icons';
import image from './search_image.png';
import loginPls from './login_animation.png';
import { getFirestore, collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function WishList() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const navigate = useNavigate();
  const db = getFirestore(); // Firebase Firestore instance

    
  const no=()=>{
    toast.info('The Item Is Added to Cartlist🤍', {
      position: "top-left",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
      
  }

  const not=()=>{
    toast.info('Item Already Exists in Cartlist🤍', {
      position: "top-left",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });
      
  }

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('uid');
    if (userFromLocalStorage) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const localWishlist = JSON.parse(window.localStorage.getItem('wishlist'));
    setLoading(false);

    if (localWishlist !== null) {
      setWishlist(localWishlist);
    }
  }, []);

  const viewProductDetails = (imageUrl,productName ,price,GST,category,description) => {
    navigate('/productdetails', { state: { imageUrl,productName ,price,GST,category,description} });
  };

  const removeWishList =(index) => {
    const itemToRemove = wishlist[index];

    // Remove the specific item from the local wishlist
    const updatedWishlist = wishlist.filter((item, i) => i !== index);
    setWishlist(updatedWishlist);

    // Update local storage with the modified wishlist
    window.localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));

  }

  const AddToCart = (index) => {
    const itemToRemove = wishlist[index];

    // Check if the user is logged in
    const storedUID = localStorage.getItem('uid');
    if (storedUID) {
      const usersCollectionRef = collection(db, 'users');
      const queryRef = query(usersCollectionRef, where('uid', '==', storedUID));

      getDocs(queryRef)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();

              // Check if the user document contains a cartlist
              if (userData.cartlist) {
                // Check if the item already exists in the cartlist
                if (userData.cartlist.some((item) => item.id === itemToRemove.id)) {
                  not();
                  console.log('Product is already in the cart');
                } else {
                  // Add the item to the cartlist in Firestore
                  const updatedCartlist = [...userData.cartlist, itemToRemove];
                  updateDoc(doc.ref, { cartlist: updatedCartlist });
                  no();
                  console.log('Product added to the cart');
                }
              } else {
                // Create a new cartlist and add the item
                const newCartlist = [itemToRemove];
                updateDoc(doc.ref, { cartlist: newCartlist });
                no();
                console.log('Product added to the cart');
              }
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching user documents:', error);
        });
    }
  };

  return (
    <div>
      <Header isHomepage={false} wishlist={wishlist} />
      {isLoggedIn ? (
        loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : wishlist.length ? (
          <div>
            <div className="products">
              {wishlist.map((item, index) => (
                <div className="tittles" key={index}>
                  <div className="icons">
                    <a className="hearts"  onClick={() => removeWishList(index)}>
                      <FontAwesomeIcon icon={faHeart} />
                    </a>
                  </div>
                  <img
                    className="imges"
                    src={item.imageUrl}
                    alt={item.productName}
                    onClick={() => viewProductDetails(item.imageUrl,item.productName,item.price,item.gst,item.category,item.description)}
                  />
                  <h1 className="headings">{item.productName}</h1>
                  <p className="prices">₹{item.price}</p>
                  <button className="add-car" onClick={() => AddToCart(index)}>Add to Cart</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="haha">
            <img className="empty" src={image} alt="ruby" />
            <p className="list">Your Wishlist Is Empty!!</p>
          </div>
        )
      ) : (
        <div>
          <img className="empty" src={loginPls} alt="Login Please" />
          <p className="list">Please Login to view your Wishlist!!</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default WishList;
