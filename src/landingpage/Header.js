import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faBars, faHeart, faCartShopping, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link ,useNavigate} from "react-router-dom";
import '../landingpage/Product';
import { useState, useEffect} from 'react';
import logo from '../landingpage/images/logo.png';
import '../firebase';
import { getFirestore, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

function Header({ items, onFilter, isHomepage = true, wishlist, loading }) {
  const [searchText, setSearchText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [username,setUsername]=useState('')
  // const currentUid = localStorage.getItem("uid");
  const db = getFirestore();
  const navigate= useNavigate();


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
              console.log('Ruby', userData);

              // Check if the user document contains a cartlist
              if (userData.username) {
                setUsername(userData.username);
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

    useEffect(() => {
      const userFromLocalStorage = localStorage.getItem('uid');
      if (userFromLocalStorage) {
        setIsLoggedIn(true);
      }
    }, []);
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    const filtered = items.filter((item) =>
      item.productName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    onFilter(filtered);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (e) => {
    setIsMenuOpen(false);
    e.preventDefault();
  };

  const handleLogout = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  const forLogout=()=>{
    localStorage.removeItem('uid');
    setIsLoggedIn(false);
    window.location.reload();
  }

  const gotologinPage=()=>{
    navigate('/Login');
 }

 

  return (
    <div>
      <section id="header">
        <a href="/">
          <img src={logo} className="logo" alt="Logo" />
        </a>
        <div>
          {isHomepage && (
            <div className='sea'>
              <div className='se'><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
              <input
                className='search'
                value={searchText}
                onChange={handleSearch}
                placeholder='Search'
              ></input>
            </div>
          )}
          <ul id="navbar" style={{ right: isMenuOpen ? '0' : '-250px' }}>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><Link className='favs' to="/wishList"><FontAwesomeIcon icon={faHeart} /></Link><Link  to="/wishList"><div className='fav'>Wishlist</div></Link></li>
            <li><a className='cars'  href="/Cart"><FontAwesomeIcon icon={faCartShopping} /></a><a href="/Cart"><div className='car'>Cart</div></a></li>
            {isLoggedIn ? (
              <li><a className='log' onClick={handleLogout}><FontAwesomeIcon icon={faUser} /></a></li>
              ) : (
              <li><Link className='log' to="/login">Login</Link></li>
            )}                       
            <a href="" id='close'><FontAwesomeIcon icon={faClose} onClick={closeMenu} /></a>
          </ul>
          <div id="mobile">
            {isLoggedIn?(<a  onClick={handleLogout}><FontAwesomeIcon icon={faUser} /></a>):<a onClick={gotologinPage}><FontAwesomeIcon  icon={faUser} /></a>}
            <i ><FontAwesomeIcon icon={faBars} onClick={toggleMenu} /></i>
          </div>
          {isProfileVisible && (
         <div className="profilee">
          <h2 class="namee">{username}</h2>
          <div class="flexe">
         <button class="bu">Profile</button>
         <button class="bu">My Orders</button>
       </div>
         <a class="account" onClick={forLogout}>
      Logout
    </a>
  </div>
)}
        </div>
      </section>
    </div>
  );
}

export default Header;
{/* <Link className='log'  to="/login"></Link> */}