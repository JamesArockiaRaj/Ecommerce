import { useState, React ,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import './checkout.css';
import { states } from './state';

const Checkout = () => {
  const location = useLocation();
  const total = location.state.total || 0;
  const cartlist = location.state.cartlist || []; 
  const itemQuantities = location.state.itemQuantities || {};

  const [selectedState, setSelectedState] = useState('');
  const [Sum, setSum] = useState(0);

  useEffect(() => {
    let newSum = 0;
    cartlist.forEach((item, index) => {
      const priceWithGST = (item.price/item.gst)+(item.price);
      console.log(priceWithGST)
      newSum += priceWithGST * (itemQuantities[index] || 1);
    });
    setSum(newSum);
  }, [cartlist, itemQuantities]);
  

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };
  return (
    <div>
    
      <div className='check'>
      <div className='checkout'>Payment</div>
      </div>
      <div className='payment-page'>
        <div className='page-1'>
      <div className="comment-box">
        <h3>Basic Information</h3>
        <form className="comment-form">
          <div className='flex-row'>
          <div className='names'>
          <label>
            First Name
            <input required type="text" placeholder="First Name"></input>
          </label>
          <label>

            Last  Name
            <input type="text" placeholder="Last Name" />
          </label>
          </div>
          <div className='names'>
          <label>
            Mail Id
            <input  required type="mail" placeholder="Mail Address" />
          </label>
          <label>
            Phone Number
            <input  required type="text" placeholder="Phone Number" />
          </label>
          </div>
          <div className='names'>
          <label>
            State<br></br>
            <select className='dropdown' id="stateSelect" value={selectedState} onChange={handleStateChange}>
        <option value="" disabled hidden>-- Select a state --</option>
        {states.map((state) => (
          <option className='state' key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
          </label>
          <label>
            Pin Code
            <input  required type="text" placeholder="Pin Code" />
          </label>
          </div>          
          <div className='names'>
            <label>
            Address
          <textarea  required rows="5" placeholder="Address"></textarea>
          </label>
          <label>
           City
          <input  required type='text' placeholder='City'></input>
          </label>
          </div></div>
        
          <button  type="submit" className="buto">Proceed To Pay</button>

        </form>
      </div>
      </div>
     <div className='page-2'>
      <table>
  <thead>
    <tr>
      <th>Product Name</th>
      <th>Quantity</th>
      <th>GST</th>
      <th>Price(₹)</th>
    </tr>
  </thead>
  <tbody>
    {cartlist.map((item, index) => (
      <tr key={index}>
        <td>{item.productName}</td>
        <td>{itemQuantities[index] || 1}</td>
        <td>{item.gst}</td>
        <td>{item.price * (itemQuantities[index] || 1)}</td>
      
      </tr>
    ))}
    <tr><td colspan="3" >Total(₹)</td>
    <td>{Sum}</td>
    </tr>
  </tbody>
</table>
</div>
   </div>
   </div>
  );
};

export default Checkout;

// <p>Total:</p>