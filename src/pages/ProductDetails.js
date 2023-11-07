import React, { useEffect, useState }from 'react'
import {useLocation } from 'react-router-dom';
import './ProductDetails.css'
import { getFirestore, collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProductDetails = () => {
  const location = useLocation();
  const title = location.state.productName || 0;  
  const image=location.state.imageUrl|| 0;
  const price=location.state.price|| 0;
  const GST=location.state.GST|| 0;
  const description=location.state.description|| 0;
  const category=location.state.category|| 0;
  const itemid=location.state.id|| 0;
  const db = getFirestore(); 
console.log(itemid)

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
   const [isLoggedIn, setIsLoggedIn] = useState();
  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('uid');
    if (userFromLocalStorage) {
      setIsLoggedIn(true);
    }
  }, []);

  

const AddToCart = () => {
  if (isLoggedIn) {

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
              const itemToAdd = {
                id: itemid,
                productName: title,
                price: price,
                imageUrl: image,
                // Add other item details here
              };

              if (userData.cartlist.some((item) => item.id === itemToAdd.id)) {
                not();
                console.log('Product is already in the cart');
              } else {
                // Add the item to the cartlist in Firestore
                const updatedCartlist = [...userData.cartlist, itemToAdd];
                updateDoc(doc.ref, { cartlist: updatedCartlist });
                no();
                console.log('Product added to the cart');
              }
            } else {
              // Create a new cartlist and add the item
              const newCartlist = [{ id: itemid, productName: title, price: price, imageUrl: image, /* Add other item details here */ }];
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
} else {
  alert('Login First');
}
};

  
  

  return (
    <div className='pro-deatil'>
      <div className='pro-info'>
      <img className='pro-img' src={image} alt="img"></img>
      <div className='pro-rate'>
      <h1 className='pro-name'>{title}</h1>
      <h3>Price : ₹{price}</h3>
      <p>GST : {GST}</p>
      <p>Category : {category}</p>
      <p>{description}</p>
      <div className='batten'>
      <button  className="nem" onClick={() => AddToCart()}>Add to Cart</button>
      <button  className="nem">Buy Now</button>
      </div>
      </div>
      </div>
      <ToastContainer />
      </div> 
  )
}

export default ProductDetails