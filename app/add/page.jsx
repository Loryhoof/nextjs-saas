"use client";

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { LoadingSnippet } from '@/components/LoadingSnippet';

const App = () => {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
        redirect('/login');
        },
    });

    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [stripeLoading, setIsStripeLoading] = useState(false);

    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isFirstOrder, setIsFirstOrder] = useState(true);

    useEffect(() => {
      const fetchOrderInfo = async () => {
      try {
          const response = await axios.get('/api/userInfo');
          if(response.data.user)
          {
            const userInfo = response.data.user;
            setIsFirstOrder(userInfo.firstOrder);
            if(userInfo.ordering)
            {
              if(userInfo.orderStep == "checkout")
              {
                setIsLoading(false)
              }
              else if(userInfo.orderStep == "upload")
              {
                router.push('/upload');
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
          else
          {
            router.push('/');
          }
      } catch (error) {
          console.error('Error fetching order info:', error);
          router.push('/');
      }
      };

      fetchOrderInfo();
  }, []);

  const cancelCheckout = async () => {
    try {
      await axios.post('/api/cancelCheckout');
      router.push('/dashboard/orders');

  } catch (error) {
      console.error('Error fetching order info:', error);
      router.push('/');
  }
  }

  const packages = [
    {
      type: 'Small',
      styles: 6,
      photos: 12,
      format: 'Small (512x512)',
      price: 8,
      discountPrice: 32,
      stripeID: 'price_1OhwBjIo4LF0lumXAmXZke81',
      offer: ''
    },
    {
      type: 'Large',
      styles: 9,
      photos: 24,
      format: 'HD (1024x1024)',
      price: 14.75,
      discountPrice: 59,
      stripeID: 'price_1OhwDSIo4LF0lumXtnNSTMtM',
      offer: 'Best Seller'
    },
    {
      type: 'ALL',
      styles: 12,
      photos: 48,
      format: 'HD (1024x1024)',
      price: 24.75,
      discountPrice: 99,
      stripeID: 'price_1OhwAdIo4LF0lumXRl8JR4bK',
      offer: ''
    },
  ];

  const handlePackageSelect = (index) => {
    setSelectedPackage(index);
  };

  const handleCheckout = async (pkg) => {
    try {
      const selectedID = packages[pkg].stripeID;
  
      // Send a POST request to your /api/payment endpoint with the product ID
      const { data } = await axios.post('/api/payment', {
        stripeID: selectedID,
      });
  
      // Redirect to the payment URL received from the server
      window.location.assign(data);
    } catch (error) {
      console.error('Error during checkout:', error);
      // Handle error as needed
    }
  };
      
  return (
    <>
      {isLoading ? (
        <LoadingSnippet></LoadingSnippet>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400">
          <div className="max-w-md p-6 border border-gray-300 rounded-md bg-gray-100">
            <h1 className="text-3xl font-bold mb-2 text-left">Select a Package</h1>
            <p className="mb-4">One-time payment. No subscription. All packages come with a default amount of photos.</p>
  
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`p-4 mb-4 border border-gray-200 rounded-md cursor-pointer ${
                  selectedPackage === index ? 'bg-blue-200' : ''
                }`}
                onClick={() => handlePackageSelect(index)}
              >
                <div className='inline-flex items-center mb-2'>
                  <h2 className="text-xl font-bold mr-2">{pkg.type}</h2>
                  {pkg.offer && 
                  <p className='text-sm font-medium text-white bg-teal-500 rounded-full px-4 py-2'>{pkg.offer}</p>

                  }
              </div>
                <p className="text-gray-600 mb-4">{`Pick ${pkg.styles} styles, get ${pkg.photos} photos in ${pkg.format} format.`}</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-bold">${pkg.price.toFixed(2)}</span>
                  <span className="line-through text-gray-500">${pkg.discountPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
            <button
              className={`w-full mt-8 ${
                selectedPackage !== null ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
              } text-white py-3 px-6 rounded-md text-xl`}
              disabled={selectedPackage === null || stripeLoading}
              onClick={() => {
                setIsStripeLoading(true);
                handleCheckout(selectedPackage)
              }}
            >
              {stripeLoading ? "Loading..." : (selectedPackage !== null ? 'Checkout' : 'Select a package')}
            </button>
            {!isFirstOrder && <button
              onClick={() => cancelCheckout()}
              className="mt-4 w-full text-md"
            >
              Cancel Checkout
            </button>}
            {isFirstOrder && <button
              onClick={() => signOut()}
              className="mt-4 w-full text-sm"
            >
              Logout
            </button>}
          </div>
        </div>
      )}
    </>
  );
  }
  
    
    export default App;
