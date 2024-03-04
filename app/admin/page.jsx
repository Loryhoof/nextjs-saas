"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from 'next-auth/react';
import { useRouter, redirect } from "next/navigation";
import axios from "axios";

import AdminOrders from "@/components/AdminOders";

const Admin = () => {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
        redirect('/login');
        },
    });
    
    const router = useRouter();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "ADMIN") {
        router.push('/');
    }
    }, [status, session]);

    useEffect(() => {
        const fetchOrderInfo = async () => {
          try {
            const response = await axios.get('/api/getOrders');
            if(response?.data.orders)
            {
                setOrders(response.data.orders);
            }
          } catch (error) {
            console.error('Error fetching order info:', error);
          }
        };
    
        fetchOrderInfo();
      }, []);

      const downloadFiles = async (files, orderID) => {
        try {
          const response = await fetch('/api/downloadFiles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ files }),
          });
      
          if (response.ok) {
            // Get the Blob representing the zip file
            const zipBlob = await response.blob();
      
            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(zipBlob);
            downloadLink.download = `Order_${orderID}.zip`;
      
            // Append the link to the document and trigger the download
            document.body.appendChild(downloadLink);
            downloadLink.click();
      
            // Remove the link from the document
            document.body.removeChild(downloadLink);
          } else {
            console.error('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const fetchOrdersData = async () => {
        try {
          const response = await axios.get('/api/getOrders');
          if (response?.data.orders) {
            setOrders(response.data.orders);
          }
        } catch (error) {
          console.error('Error fetching order info:', error);
        }
      };

      const handleFulfillOrder = async (orderId) => {
        try {
          const response = await fetch('/api/fulfillOrder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId }),
          });
      
          if (response) {
            console.log("sucess fulfilling order: ", orderId);
            fetchOrdersData();
          } else {
            console.error('Error:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      const handleUploadRequest = async (images, orderId) => {
        if(images.length <= 0) {
            return;
        }

        //console.log(images, orderId)
        
        const formData = new FormData();
    
        images.forEach((image, index) => {
          formData.append(`file`, image);
        });

        formData.append('orderId', JSON.stringify(orderId));

        try {
          const response = await axios.post('/api/uploadSigned', {
            urls: images.map((image) => image.name),
          });
      
          if (response.ok || response.status === 200) {
            const signedURLS = response.data.signedURLS;
      
            // Use Promise.all to concurrently upload all files
            await Promise.all(
              signedURLS.map(async (signedURL, index) => {
                try {
                  // Create new FormData for each file
                  // const fileFormData = new FormData();
                  // fileFormData.append('file', selectedImages[index]);
      
                  // Make a PUT request to upload the file
                  await fetch(signedURL, {
                    method: 'PUT',
                    // headers: {
                    //   'Content-Type': 'multipart/form-data',
                    // },
                    body: images[index],
                  });
      
                  console.log(`File ${index + 1} successfully uploaded!`);
                } catch (error) {
                  console.error(`Error uploading file ${index + 1}:`, error);
                }
              })
            );
      
            console.log('All files successfully uploaded!');
    
            const uploadedImageURLS = signedURLS.map(url => url.split('?')[0]);
    
            const orderData = {
              urls: uploadedImageURLS,
              orderId: orderId
            }
    
            console.log(orderData);
    
            // Create delivery
    
            try {
              const response = await axios.post('/api/createDelivery', orderData);
              //console.log("sucessssssssssss DELIVERY");
              fetchOrdersData();
              // Redirect when all sucess
              //handleRedirect();
              
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
        <div>
            {/* Display admin panel only if the user is an admin */}
            {session?.user.role === "ADMIN" && (
                <div className="flex h-screen bg-gray-100">
                    {/* Display a list of orders */}
                    <div className="flex-1 p-8 overflow-y-auto">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        {/* Content based on the selected navigation */}
                        <h1 className="mb-2 gradient-text font-bold">NextJS SaaS</h1>
                        <div className="inline-flex mb-2">
                          <h1 className="">Admin Account: {session.user.email}</h1>
                          <button
                            onClick={() => signOut()}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            Logout
                          </button>
                        </div>
                        <h1 className="text-3xl font-bold mb-8 text-gray-800">Order Overview</h1>
                        
                        {orders ? (
                        <AdminOrders orders={orders} downloadFiles={downloadFiles} handleFulfillOrder={handleFulfillOrder}
                        handleUploadRequest={handleUploadRequest}/>
                        ) : (
                        <p className="text-gray-600">No orders found.</p>
                        )}
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
};
      

export default Admin;
