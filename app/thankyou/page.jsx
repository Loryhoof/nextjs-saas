"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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

    const router = useRouter();

    useEffect(() => {
      const fetchOrderInfo = async () => {
      try {
          const response = await axios.get('/api/userInfo');
          if(response.data.user)
          {
            const userInfo = response.data.user;
            if(userInfo.ordering)
            {
              if(userInfo.orderStep == "checkout")
              {
                router.push('/add');
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
    
  return (
    <>
      <LoadingSnippet></LoadingSnippet>
    </>
  );
  }
  
    
    export default App;
