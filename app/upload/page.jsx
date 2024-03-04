'use client'

import { useRouter, redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';
import { LoadingSnippet } from '@/components/LoadingSnippet';
import { FaCheck, FaTimes } from 'react-icons/fa';

const YourFormComponent = () => {
  const { data: session, status } = useSession({
      required: true,
      onUnauthenticated() {
      redirect('/login');
      },
  });

  const [name, setName] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageCounter, setImageCounter] = useState(0);
  const [isCheckboxChecked, setCheckboxChecked] = useState(false);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedType, setSelectedType] = useState('Individual');
  const [styleAmount, setStyleAmount] = useState(6);

  const artStyles = [
    {url: '/assets/showcase/b.png', name:'Varient 1'},
    {url: '/assets/showcase/b.png', name:'Varient 2'},
    {url: '/assets/showcase/b.png', name:'Varient 3'},
    {url: '/assets/showcase/b.png', name:'Varient 4'},

    {url: '/assets/showcase/b.png', name:'Varient 5'},
    {url: '/assets/showcase/b.png', name:'Varient 6'},
    {url: '/assets/showcase/b.png', name:'Varient 7'},
    {url: '/assets/showcase/b.png', name:'Varient 8'},

    {url: '/assets/showcase/b.png', name:'Varient 9'},
    {url: '/assets/showcase/b.png', name:'Varient 10'},
    {url: '/assets/showcase/b.png', name:'Varient 11'},
    {url: '/assets/showcase/b.png', name:'Varient 12'},
  ]

  const packageList = [
    {name:'SMALL', amount: 6},
    {name:'LARGE', amount: 9},
    {name:'ALL', amount: 12},
  ]

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleStylePickerClick = () => {
    // Show/hide the style picker
    setShowStylePicker(!showStylePicker);
  };

  const handleStyleSelection = (style) => {
    // Toggle the style selection
    if (selectedStyles.includes(style)) {
      setSelectedStyles((prevSelectedStyles) =>
        prevSelectedStyles.filter((selectedStyle) => selectedStyle !== style)
      );
    } else {
      if (selectedStyles.length < styleAmount) {
        setSelectedStyles((prevSelectedStyles) => [...prevSelectedStyles, style]);
      }
    }
  };

  const handleConfirmStyles = () => {
    // Perform any action needed with the selected styles

    // Hide the style picker
    setShowStylePicker(false);
  };

  useEffect(() => {
    const fetchOrderInfo = async () => {
    try {
        const response = await axios.get('/api/userInfo');
        if(response.data.user)
          {
            const userInfo = response.data.user;
            if(userInfo.ordering)
            {
              if(userInfo.orderStep == "upload")
              {
                const order = await axios.get('/api/getActiveOrderInfo');
                if(order && order.data.order)
                {
                  setStyleAmount(packageList.find(item => item.name === order.data.order.package).amount);
                }
                setIsLoading(false)
              }
              else if(userInfo.orderStep == "checkout")
              {
                router.push('/add');
              }
              else
              {
                router.push('/dashboard/orders')
              }
            }
            else
            {
              router.push('/dashboard/orders')
            }
          }
    } catch (error) {
        console.error('Error fetching order info:', error);
        router.push('/');
    }
    };

    fetchOrderInfo();
}, []);

  const handleCheckboxChange = (e) => {
    setCheckboxChecked(e.target.checked);
  };

  const handleRedirect = () => {
    router.push('/dashboard/orders');
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
  
    if (files) {
      // Convert FileList to array for easier manipulation
      const fileList = Array.from(files);
  
      // Update image counter
      setImageCounter((prevCounter) => prevCounter + fileList.length);
  
      // Update selected images
      setSelectedImages((prevImages) => [...prevImages, ...fileList]);
    }
  };
  

  const handleDrop = (e) => {
    e.preventDefault();

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      setImageCounter((prevCounter) => prevCounter + files.length);

      setSelectedImages((prevImages) => [...prevImages, ...files]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      setImageCounter((prevCounter) => prevCounter - 1);
      return newImages;
    });
  };

  const handleSubmit = async () => {
    if (!isCheckboxChecked) {
      // Show an alert or handle the case where the user hasn't agreed to terms
      return;
    }
  
    try {
      // Create FormData and append selected images
      const formData = new FormData();
      selectedImages.forEach((image, index) => {
        formData.append(`file${index}`, image);
      });
  
      // Send request to get signed URLs
      const response = await axios.post('/api/uploadSigned', {
        urls: selectedImages.map((image) => image.name),
      });
  
      if (response.ok || response.status === 200) {
        const signedURLS = response.data.signedURLS;
  
        // Use Promise.all to concurrently upload all files
        await Promise.all(
          signedURLS.map(async (signedURL, index) => {
            try {
              // Create new FormData for each file
              const fileFormData = new FormData();
              fileFormData.append('file', selectedImages[index]);
  
              // Make a PUT request to upload the file
              await fetch(signedURL, {
                method: 'PUT',
                // headers: {
                //   'Content-Type': 'multipart/form-data',
                // },
                body: selectedImages[index],
              });
  
              console.log(`File ${index + 1} successfully uploaded!`);
            } catch (error) {
              console.error(`Error uploading file ${index + 1}:`, error);
            }
          })
        );
  
        console.log('All files successfully uploaded!');

        const uploadedImageURLS = signedURLS.map(url => url.split('?')[0]);
        const selectedStylesNames = selectedStyles.map(index => artStyles[index].name);

        const orderData = {
          urls: uploadedImageURLS,
          styles: selectedStylesNames,
          imageType: selectedType
        }

        //console.log(orderData);

        // Create order

        try {
          const response1 = await axios.post('/api/createOrder', orderData);


          //console.log(jobData, "JOB DATA");

          try {

            const jobData = {
              images: uploadedImageURLS,
              imageType: selectedType,
              orderId: response1.data.order.id
            }

            const response2 = await axios.post('/api/gen-lora', jobData);

            //console.log(response2.data, "lora-gen DATAAAAA")
  
  
                      
            // Redirect when all sucess
            handleRedirect();
            
          } catch (error) {
            console.error('Error:', error);
            // Handle error
          }
                    
        } catch (error) {
          console.error('Error:', error);
          // Handle error
        }


  
        // Perform any other actions after successful file upload
  
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <>
      {isLoading ? (
        <LoadingSnippet />
      ) : (
        <>
        {!showStylePicker && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400">
          <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-md bg-gray-100">
            <div className="mb-4">
              <h1 className="text-xl font-bold">Upload 10 photos of your <span className='text-blue-500'>{selectedType}</span></h1>
              <p className="">Upload 10 of your best photos {selectedType == 'Couple' ? 'including both of you' : ''}</p>
            </div>

            {/* Choose between Couple or Individual */}
            <div className="mb-4">
              <label htmlFor="type" className="mr-2">Select Type:</label>
              <select
                id="type"
                value={selectedType}
                onChange={handleTypeChange}
                className="py-2 px-4 rounded-md"
                disabled={isSubmitting}
              >
                <option value="Couple">Couple</option>
                <option value="Individual">Individual</option>
              </select>
            </div>
            
            <ul className="flex flex-col mb-2">
              <li className="flex items-center mb-2">
                <FaCheck className="text-green-500 mr-2" />
                <span>Looking at the camera</span>
              </li>
              <li className="flex items-center mb-2">
                <FaCheck className="text-green-500 mr-2" />
                <span>{selectedType == 'Couple' ? 'Faces are' : 'Face is'} clearly visible</span>
              </li>
              <li className="flex items-center mb-2">
                <FaCheck className="text-green-500 mr-2" />
                <span>Variety of poses and backgrounds</span>
              </li>
              <li className="flex items-center mb-2">
                <FaTimes className="text-red-500 mr-2" />
                <span>Bad lighting</span>
              </li>
              <li className="flex items-center mb-2">
                <FaTimes className="text-red-500 mr-2" />
                <span>Blurry or pixelated images</span>
              </li>
            </ul>

            <div
              className="mb-4 border-dashed border-2 border-gray-300 p-6 rounded-md text-center cursor-pointer"
              onClick={() => document.getElementById('fileInput').click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              disabled={isSubmitting}
            >
              <p className="text-gray-500">Click or drag and drop images here</p>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                multiple
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-4">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative inline-block mr-2">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-14 h-14 object-cover rounded-md mb-2"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 mb-4">{`${imageCounter}/10 images selected`}</p>

            <div className="flex items-center mb-4">
            <input
                type="checkbox"
                id="termsCheckbox"
                className="mr-2"
                onChange={(e) => handleCheckboxChange(e)}
                defaultChecked={isCheckboxChecked}
                disabled={isSubmitting}
              />
              <label htmlFor="termsCheckbox" className="text-gray-800">
                I understand low-quality photo uploads will not qualify for refunds and I agree to the{' '}
                <a href="/terms" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  terms of conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                  privacy policy
                </a>
                .
              </label>

            </div>
            
            {/* <p className='text-red-500'>Please select this</p> */}

            <button
              onClick={handleStylePickerClick}
              className={`mt-4 w-full text-white ${isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'} py-3 px-6 rounded-md text-xl`}
              disabled={isSubmitting}
            >
              {selectedStyles.length > 0 ? `${selectedStyles.length} ${selectedStyles.length === 1 ? 'Style' : 'Styles'} Selected` : 'Pick Styles'}
            </button>

            <button
              onClick={() => {
                setIsSubmitting(true);
                handleSubmit().finally(() => {
                  setIsSubmitting(true);
                });
              }}
              className={`w-full mt-4 ${isSubmitting ? 'bg-gray-300 cursor-not-allowed' : (imageCounter < 10 || selectedStyles.length < 1 || !isCheckboxChecked ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600')} text-white py-3 px-6 rounded-md text-xl`}
              disabled={isSubmitting || imageCounter < 10 || selectedStyles.length < 1 || !isCheckboxChecked}
            >
              {isSubmitting ? 'Uploading...' : 'Submit'}
            </button>


            <button onClick={() => signOut()} className="mt-4 w-full text-sm">
              Logout
            </button>
          </div>
        </div>
      )}
      </>
      )}

      {showStylePicker && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400">
          <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-md bg-white">
            <h1 className="text-xl font-bold mb-2">Pick up to {styleAmount} styles</h1>
            <div className="grid grid-cols-3 gap-4">
              {artStyles.map((style, index) => (
                <div
                  key={index}
                  onClick={() => handleStyleSelection(index)}
                  className={`relative w-32 h-32 border ${
                    selectedStyles.includes(index)
                      ? 'border-green-500 border-4' // Green border for selected styles
                      : 'border-gray-300' // Default border for unselected styles
                  } rounded-md cursor-pointer`}
                >
                  <img
                    src={style.url}
                    alt={`Style ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center p-2">
                    {style.name}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={handleConfirmStyles}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md text-xl"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default YourFormComponent;
