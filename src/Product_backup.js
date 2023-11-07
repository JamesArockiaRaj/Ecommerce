import React, { useState,useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link , useNavigate} from 'react-router-dom';
import { faHeart,faCartShopping} from "@fortawesome/free-solid-svg-icons";
import * as Icon from "react-bootstrap-icons";
import "../landingpage/Product.css";
import image from './man.png'
import '../firebase'; 
import { getFirestore, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 


const  notify=()=>{
  toast.error('The Item Is Removed From The Wishlist!', {
    position: "top-left",
    autoClose: 500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    });
}

const notif=()=>{
  toast.info('The Item Is Added to Wishlist🩵', {
    position: "top-left",
    autoClose: 500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    });
    
}

const not=()=>{
  toast.error('The Item is Removed From The Cartlist!', {
    position: "top-left",
    autoClose: 500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    });
}
  
const no=()=>{
  toast.info('The Item Is Added to Cartlist🤍', {
    position: "top-left",
    autoClose: 500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    });
    
}

const db = getFirestore();

const StoreItem = ({id,productName, price, imageUrl, icon, toggleIcon,cart,exchangeIcon,quantity,GST,description,category}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate= useNavigate();

  const viewProductDetails=()=>{
    navigate('/productdetails',{state:{id,productName,imageUrl,price,quantity,GST,description,category}});
 }
  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('uid');
    if (userFromLocalStorage) {
      setIsLoggedIn(true);
      // console.log(productId)

    }
  }, []);
  
  
  const alertMsg=()=>{
    alert("Login First")
  }

  const ViewDetails=()=>{
    alert("Login Done")
  }


  return (
    
    <div className="tittle">
      <div className="icon">
        
        {isLoggedIn?<a className="heart" onClick={toggleIcon}>
          {icon ? (
            <FontAwesomeIcon icon={faHeart}/>
          ) : (
            <div>
            < Icon.Heart/>
            </div>
          )}
        </a>: < Icon.Heart onClick={alertMsg} />}

        {isLoggedIn?<a className="cart" onClick={exchangeIcon}>
          {cart ? (
            <FontAwesomeIcon icon={faCartShopping} />
          ) : (<div>
            <Icon.Cart/></div>
          )}
        </a>: < Icon.Cart onClick={alertMsg} />}
        
      </div>
 
      <img className="imge" src={imageUrl} alt={productName} />
      <h1 className="heading">{productName}</h1>
      <p className="price">${price}</p>
      <button className="re" onClick={viewProductDetails}>View Details</button>
    </div>
  );
};
 
 
function Product({ items , loading}) {
  const initialWishlist = JSON.parse(window.localStorage.getItem("wishlist")) || [];
  const [wishlist, setLocalWishlist] = useState(initialWishlist);
 
  const [itemStates, setItemStates] = useState(
    items.map((item) => wishlist.some((wishedItem) => wishedItem.value === item.value))
  );

  useEffect(() => {
    window.localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const localWishlist = JSON.parse(window.localStorage.getItem("wishlist"));
    if (localWishlist !== null) {
      setLocalWishlist(localWishlist);
    }
  }, []);

  const toggleIcon = (index) => {
    const newItemStates = [...itemStates];
    newItemStates[index] = !newItemStates[index];
    setItemStates(newItemStates);

    const itemToAdd = items[index];

    if (newItemStates[index]) {
      if (!wishlist.some((item) => item.id === itemToAdd.id)) {
        setLocalWishlist([...wishlist, itemToAdd]);
        notif();
      } else {
        const updatedWishlist = wishlist.filter((item) => item.id !== itemToAdd.id);
        notify();
        setLocalWishlist(updatedWishlist);
      }
    } else {
      const itemToRemove = items[index];
      const updatedWishlist = wishlist.filter((item) => item.id !== itemToRemove.id);
      notify();
      setLocalWishlist(updatedWishlist);
    }
  };

 
  const initialCartlist = [];
  useEffect(() => {
    const storedUID = localStorage.getItem('uid');
    if (storedUID) {
      const usersCollectionRef = collection(db, 'users');
      const queryRef = query(usersCollectionRef, where('uid', '==', storedUID));
  
      getDocs(queryRef)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              console.log('Matching user document:', userData);
  
              // Check if the user document contains a cartlist
              if (userData.cartlist) {
                setLocalCartlist(userData.cartlist);
              }
            });
          } else {
            // No user document with a matching UID was found
            console.log('User document with UID not found.');
          }
        })
        .catch((error) => {
          console.error('Error fetching user documents:', error);
        });
    }
  }, []);
  
  const [cartlist,setLocalCartlist]=useState(initialCartlist);
 
  const [itemState,setItemstate]=useState(items.map((item)=> cartlist.some((cartsitem) => cartsitem.value ===item.value)));
 
  // useEffect(()=>{window.localStorage.setItem("cartlist",JSON.stringify(cartlist))},[cartlist]);
 
  // useEffect(()=>{const localcartlist = JSON.parse(window.localStorage.getItem("cartlist"))
  // if(localcartlist!==null) setLocalCartlist(localcartlist);
  // },[])
 
  const exchangeIcon = (index) => {
    const newItemState = [...itemState];
    newItemState[index] = !newItemState[index];
    setItemstate(newItemState);
  
    const itemToAddToCart = items[index];
  
    if (newItemState[index]) {
      if (!cartlist.some((item) => item.id === itemToAddToCart.id)) {
        const updatedCartlist = [...cartlist, itemToAddToCart];
        setLocalCartlist(updatedCartlist);
        console.log("Updated Cartlist:", updatedCartlist);
        no();
  
        // After updating the local cart list, also update it in Firestore
        const storedUID = localStorage.getItem('uid');
        if (storedUID) {
          const userCollectionRef = collection(db, 'users');
          const queryRef = query(userCollectionRef, where('uid', '==', storedUID));
  
          getDocs(queryRef)
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                  // doc.id is the document ID (auto-generated by Firestore)
                  const userData = doc.data();
                  const updatedUserData = { ...userData, cartlist: updatedCartlist };
                  updateDoc(doc.ref, updatedUserData); // Update the user document
                });
              } else {
                console.log('User document with UID not found.');
              }
            })
            .catch((error) => {
              console.error('Error fetching user documents:', error);
            });
        }
      } else {
        // Remove item from the cart list
        const updatedCartlist = cartlist.filter((item) => item.id !== itemToAddToCart.id);
        console.log("Updated Cartlist:", updatedCartlist);
        not();
        setLocalCartlist(updatedCartlist);
  
        // After updating the local cart list, also update it in Firestore
        const storedUID = localStorage.getItem('uid');
        if (storedUID) {
          const userCollectionRef = collection(db, 'users');
          const queryRef = query(userCollectionRef, where('uid', '==', storedUID));
  
          getDocs(queryRef)
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                  const userData = doc.data();
                  const updatedUserData = { ...userData, cartlist: updatedCartlist };
                  updateDoc(doc.ref, updatedUserData); // Update the user document
                });
              } else {
                console.log('User document with UID not found.');
              }
            })
            .catch((error) => {
              console.error('Error fetching user documents:', error);
            });
        }
      }
    }
  };
  useEffect(() => {
    const storedUID = localStorage.getItem('uid');
    if (storedUID) {
      const usersCollectionRef = collection(db, 'users');
      const queryRef = query(usersCollectionRef, where('uid', '==', storedUID));

      getDocs(queryRef)
  .then((querySnapshot) => {
    if (!querySnapshot.empty) {
      // At least one user document with a matching UID was found
      querySnapshot.forEach((doc) => {
        // doc.id is the document ID (auto-generated by Firestore)
        const userData = doc.data();
        console.log('Matching user document:', userData);
      });
    } else {
      // No user document with a matching UID was found
      console.log('User document with UID not found.');
    }
  })
  .catch((error) => {
    console.error('Error fetching user documents:', error);
  });
    }
  }, []);  
  
  return (
    <div>
      {loading? <div className="spinner-container"><div className="spinner"></div></div>:(<div>
     <div>
        <h1 className="he">Products</h1>
      </div>
      {items.length ? (
            <div>
              <div className="product">
                {items.map((item, index) => (
                  <StoreItem
                    key={item.value}
                    {...item}
                    icon={wishlist.some(wishedItem => wishedItem.id === item.id)}
                    toggleIcon={() => toggleIcon(index)}
                    cart={cartlist.some(cartsitem => cartsitem.id === item.id)}
                    exchangeIcon={() => {
                      exchangeIcon(index);
                      
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className='pen'>
              <img className='pen' src={image} alt="ruby"></img>
              <p className='found'> Oops! Search not Found👀</p>
            </div>
          )}
      
      <ToastContainer />
    </div>)}

    </div>
  );
}
 
 
export default Product;