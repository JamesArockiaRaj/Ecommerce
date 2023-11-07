import React, { useState, useEffect } from "react";
import './ProductAdmin.css'
import { categories } from '../pages/category';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import '../firebase'; 
import { getFirestore, addDoc, collection } from "firebase/firestore"; 
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";

function ProductAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const currentUid = localStorage.getItem("uid");
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [gst, setGst] = useState('0'); // Set a default value for gst
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const db = getFirestore();


  // State to store uploaded file
  const [file, setFile] = useState("");
  // progress
  const [percent, setPercent] = useState(0);
  const storage = getStorage();

  // Handle file upload event and update state
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const no = () => {
    toast.info('Item  Added 🤍', {
      position: 'top-left',
      autoClose: 250,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      
    } 
    );
  };

  const handleUpload = () => {
    if (!file) {
        alert("Please upload an image first!");
    }

    const storageRef = ref(storage, `/productImgs/${file.name}`);

    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );

            // update progress
            setPercent(percent);
        },
        (err) => console.log(err),
        () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log(url);
                setImageUrl(url);
            });
        }
    );
};

  useEffect(() => {
    if (currentUid === "TJ1iKOPx4GOjOduDpudI7VCpIep2") {
      setIsAdmin(true);
    }
  }, []);

  const handleStateChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Create a data object with the form values
    const data = {
      productName,
      price,
      category: selectedCategory,
      gst,
      quantity,
      description,
      imageUrl: imageUrl,
    };

    // Add the data to Firestore
    try {
      await addDoc(collection(db, 'products'), data);
      // Reset the form or perform any additional actions upon successful submission
    } catch (error) {
      console.error('Error adding document: ', error);
    }
    no();
    window.location.reload();
  };
 

  const [selectedGST, setSelectedGST] = useState(''); 

  const handleGSTchange = (e) => {
    setSelectedGST(e.target.value); 
  };

  return (
    <div>
      {isAdmin ? (
        <div>
          <div className='check'>
            <div className='checkout'>Add Product</div>
          </div>
          <div className="comment-box">
            <h3>Product Details</h3>
            <form className="comment-form">
              <div className='flex-row'>
                <input type="file" accept="image/*" onChange={handleChange}/>
                <button onClick={handleUpload}>Upload Image</button>

                {imageUrl && <img src={imageUrl} alt="Selected Image" />}
                <div className='names'>
                  <label>
                    Product Name
                    <input
                      required
                      type="text"
                      placeholder="Product Name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </label>
                  <label>
                    Price
                    <input
                      type="text"
                      placeholder="Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </label>
                </div>
                <div className='names'>
                  <label>
                    Category<br></br>
                    <select
                      className='dropdown'
                      name="category"
                      value={selectedCategory}
                      onChange={handleStateChange}
                    >
                      <option value="" disabled hidden>-- Select a Category --</option>
                      {categories.map((category) => (
                        <option className='state' key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    GST
             <select
                 className='dropdown'
                 value={selectedGST}
                onChange={handleGSTchange}
                   >
                <option value="">GST</option>
                <option className="state" >0%</option>
                <option className="state">3%</option>
                <option className="state">5%</option>
                <option className="state">12%</option>
                <option className="state">18%</option>
                <option className="state">28%</option>
              </select>
                  </label>
                  <label>
                    Quantity
                    <input
                      name="quantity"
                      required
                      type="number"
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </label>
                </div>
                <div className='names'>
                  <label>
                    Description
                    <textarea
                      name="description"
                      required
                      rows="5"
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </label>
                </div>
              </div>
              <button type="submit" className="buto" onClick={handleFormSubmit}>Add Product</button>
            </form>
          </div>
        </div>
      ) : (
        <p>You're not admin!</p>
      )}
        <ToastContainer />
    </div>
  );
}

export default ProductAdmin;
