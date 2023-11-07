import React,{useState, useEffect} from 'react'
import Header from '../landingpage/Header'
import '../pages/Login.css'
import UserIcon from '../pages/LoginImg/person.png'
import EmailIcon from '../pages/LoginImg/email.png'
import Password from '../pages/LoginImg/password.png'
import {useNavigate} from 'react-router-dom';
import '../firebase'; 
import { getFirestore, addDoc, collection } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validator from 'validator'

function Login(){
    const [action,setAction] = useState("Login");
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate= useNavigate();

    const db = getFirestore();
    const auth = getAuth(); 
    
    // Check local storage for a logged-in user on component mount
    useEffect(() => {
      const userFromLocalStorage = localStorage.getItem('uid');
      if (userFromLocalStorage) {
        setIsLoggedIn(true);
      }
    }, []);

    const  notifyRegister=()=>{
      toast.info('Registration Success🩵', {
        position: "top-left",
        autoClose: 750,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    }

    const  RegisterFailed=()=>{
      toast.info('Registration Failed', {
        position: "top-left",
        autoClose: 750,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }

    const  notifyLogin=()=>{
      toast.info('Login Success🩵', {
        position: "top-left",
        autoClose: 750,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    }

    const  LoginFailed=()=>{
      toast.info('Login Failed', {
        position: "top-left",
        autoClose: 750,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
    
    function validateRegister() {
      if(username === null || username.length===0) {
        alert("Enter valid name!")
      }
      else if(!validator.isEmail(email)){
        alert("Invalid Email!")
      }
      else if(password.length<6) {
        alert("Password should be atleast 6 characters!")
      }
      else{
        handleRegister();
      }
    }

    function validateLogin() {
      if(!validator.isEmail(email)){
        alert("Invalid Email!")
      }
      else if(password.length<6) {
        alert("Password should be atleast 6 characters!")
      }
      else{
        handleLogin();
      }
    }

    const handleRegister = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        localStorage.setItem('uid', user.uid);
        const userObj = {
          uid: user.uid, 
          username: username,
          email: email,
          password: password,
        };
        setIsLoggedIn(true);
        saveDataToFirestore(userObj);

      } catch (error) {
        console.error('Registration Error:', error);
        if (error.code === 'auth/email-already-in-use') {
          alert('Email ID exists!'); 
        } else {
          RegisterFailed();
        }
      }
    };

    const handleLogin = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        setIsLoggedIn(true);
        localStorage.setItem('uid', user.uid);
        if (user.uid === "TJ1iKOPx4GOjOduDpudI7VCpIep2") {
          notifyLogin();
          setTimeout(() => {
            navigate('/AdminPage');
          }, 1000);
        }
        else{
        notifyLogin();
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
      } catch (error) {
        console.error('Login Error:', error);
        if (error.code == 'auth/invalid-login-credentials') {
          alert('Invalid Login Credentials');
        } else {
          LoginFailed();
        }
      }
    };
    
    const saveDataToFirestore = async (userData) => {
        await addDoc(collection(db, 'users'), userData);
        notifyRegister();
        setTimeout(() => {
          navigate('/');
        }, 1000); 
    };
  
    return(
        <div>
            <Header isHomepage={false}></Header>
            <div className='back'>
              <div className='chuma'>
            <div className='container'>
              <div className='header'>
                <div className='text'>{action}</div>
    
              </div>
              <div className='inputs'>
                {action==="Login"?<div></div>:<div className='input'> 
               <img src={UserIcon} alt=""></img>
               <input type='text' placeholder='User Name' value={username}
                onChange={(e) => setUsername(e.target.value)}></input>
               </div>}

               <div className='input'> 
               <img src={EmailIcon} alt=""></img>
               <input type='email' placeholder='Email Id' value={email}
               onChange={(e) => setEmail(e.target.value)}></input>
               </div>
               <div className='input'> 
               <img src={Password} alt=""></img>
               <input type='password' placeholder='Password' value={password}
               onChange={(e) => setPassword(e.target.value)}></input>
               </div>
              </div>
               
               {action=="Sign Up"?<div></div>:<div className='forgotpw'>Forgot password? <span>Click Here</span></div>}
        
            <div className='Submit-container'>
                
             {action=="Sign Up"?<div  className="submit" onClick={validateRegister}>Sign Up</div>:
            <div  className="submit" onClick={validateLogin}>Login</div>} 
               
            </div>
            {action=="Sign Up"?<div  className='register'>Already Have an account? <span  onClick={()=>{setAction("Login")}}>Login Here</span></div>:
           <div  className='register'>Haven't registered yet? <span onClick={()=>{setAction("Sign Up")}}>Register Here</span></div> }
            
            </div>
            </div>
            </div>
            <ToastContainer />
        </div>
    )
}
export default Login