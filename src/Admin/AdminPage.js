import './AdminPage.css';
import React, { useState, useEffect } from "react";

export const AdminPage = () => {

  const [isAdmin, setIsAdmin] = useState(false);
 const currentUid = localStorage.getItem("uid");
  
  useEffect(() => {
    if (currentUid === "TJ1iKOPx4GOjOduDpudI7VCpIep2") {
      setIsAdmin(true);
    }
  }, []);

  return (
<div>
    {isAdmin?(  <div>
      <h1 className='admin-pg'>Admin Page</h1>
 <div className='buttons'>
     <button  className='button-1' ><a className='link-tag' href='/addproduct'>Add Products Page</a></button>
     <button className='button-1'>View Orders</button>
     <button className='button-1'>Edit Product</button>
 </div>
 </div>):(<div><p>You are not a Admin</p></div>)}
 </div>
  )
}
export default AdminPage;