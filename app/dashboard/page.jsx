// components/UserDashboard.js
'use client'
// components/UserDashboard.js
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, redirect } from 'next/navigation';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { MobileNav } from '@/components/mobile/MobileNav';
import { DesktopNav } from '@/components/DesktopNav';
import { LoadingSnippet } from '@/components/LoadingSnippet';

const UserDashboard = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
    redirect('/login');
    },
});
  const [orderInfo, setOrderInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    handleResize(); // Check initial viewport width

    window.addEventListener('resize', handleResize); // Listen for viewport width changes

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener on component unmount
    };
  }, []);

  useEffect(() => {
    const fetchOrderInfo = async () => {
      try {
        const response = await axios.get('/api/getOrderInfo');
        if (!response.data || response.data == null || response.data.orders == null) {
          router.push('/add');
        } else {
          setOrderInfo(response.data);
          setIsLoading(false);
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
      {isLoading ? (
        <LoadingSnippet />
      ) : (
        <div className="flex h-screen bg-gray-100">
          {/* Left Sidebar Navigation */}
          {isDesktop ? (
            <DesktopNav signOut={() => signOut()} />
          ) : (
            <MobileNav signOut={() => signOut()} />
          )}

          {/* Main Content Area */}
          <div className="flex-1 md:p-8 p-2 overflow-y-auto mt-16 md:mt-0">
            <div className="bg-white md:p-8 p-4 rounded-lg shadow-md">
              {/* Content based on the selected navigation */}
              <h1 className="text-3xl font-bold mb-8 text-gray-800">Profile</h1>

              {/* User Avatar */}
              <div className="flex items-center mb-6">
                <img
                  src={session?.user.picture}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{session?.user.name}</h2>
                  <p className="text-gray-500"><span className='gradient-text'>NextJS SaaS</span> {session?.user.role}</p>
                  <p className="text-gray-500">{session?.user.email}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
