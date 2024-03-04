import { useRouter } from "next/navigation";
import { NavItem } from "./NavItem";
import axios from "axios";

export const DesktopNav = ({ signOut }) => {
    const router = useRouter();

    const handleStartOrder = async () => {
      try {
        await axios.post('/api/startOrder');
        router.push('/add')
      } catch (error) {
        console.error('Error starting order:', error);
        // Handle error as needed
      }
    }
  
    return (
      <div className="flex-shrink-0 w-56 bg-white text-gray-800 shadow-md flex flex-col">
        <div className="flex items-center justify-center p-4">
          <span className="text-2xl font-bold gradient-text">NextJS SaaS</span>
        </div>
        <nav className="space-y-1 flex-grow">
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
    );
  };
  