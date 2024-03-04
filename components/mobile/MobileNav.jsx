import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavItem } from '../NavItem';
import axios from 'axios';

export const MobileNav = ({ signOut }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleStartOrder = async () => {
    try {
      await axios.post('/api/startOrder');
      router.push('/add');
    } catch (error) {
      console.error('Error starting order:', error);
      // Handle error as needed
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white text-gray-800 shadow-md">
      <div className="flex justify-between items-center px-4 py-2">
        <div>
          <button onClick={toggleDrawer} className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        <div className="font-xl font-bold gradient-text">NextJS SaaS</div>
        <div></div>
      </div>
      {isOpen && (
        <div className="px-4 py-2">
          <nav className="space-y-1">
            <NavItem
              label="Profile"
              icon="user"
              isActive={router.pathname === '/dashboard'}
              onClick={() => router.push('/dashboard')}
            />
            <hr className="border-t border-gray-300 my-1" />
            <NavItem
              label="Order History"
              icon="history"
              isActive={router.pathname === '/dashboard/orders'}
              onClick={() => router.push('/dashboard/orders')}
            />
            <hr className="border-t border-gray-300 my-1" />
            <NavItem
              label="Create New"
              icon="history"
              isActive={router.pathname === '/dashboard/orders'}
              onClick={() => handleStartOrder()}
            />
          </nav>
          <button
            onClick={signOut}
            className="block w-full px-4 py-2 mt-4 text-sm font-medium text-center text-white bg-blue-500 hover:bg-blue-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
