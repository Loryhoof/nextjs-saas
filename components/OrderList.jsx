import React, { useState } from 'react';
import Link from 'next/link';
import ImageGrid from './ImageGrid';

const OrderList = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOrderClick = (orderId) => {
    if (selectedOrder === orderId) {
      // If the clicked order is already selected, unselect it
      setSelectedOrder(null);
    } else {
      // Select the clicked order
      setSelectedOrder(orderId);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order, index) => (
            <React.Fragment key={order.id}>
              <tr>
                <td className="px-4 py-2 text-sm font-semibold text-gray-800">{`#00${index + 1} Package: ${order.package}`}</td>
                <td className="px-4 py-2 text-sm font-semibold text-blue-600">{statusMappings[order.status]}</td>
                <td className="px-4 py-2 text-sm">
                  {order.status === 'created' && (
                    <Link href={`/upload`} passHref className='text-blue-600'>
                      Upload
                    </Link>
                  )}
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => handleOrderClick(order.id)}
                      className='text-blue-600 cursor-pointer'
                    >
                      {selectedOrder === order.id ? 'Hide Details' : 'Show Details'}
                    </button>
                  )}
                  {order.status === 'uploaded' && (
                    <p className="text-sm">
                      You will receive an email update within <span className="font-semibold">24 hours.</span>
                    </p>
                  )}
                </td>
              </tr>
              {order.status === 'delivered' && selectedOrder === order.id && (
                <tr>
                <td colSpan="3" className="py-4">
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-semibold text-gray-800">Order ID:</p>
                    <p className="text-lg text-blue-600">{order.id}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <p className="text-lg font-semibold text-gray-800">Status:</p>
                    <p className="text-lg text-blue-600">{statusMappings[order.status]}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <p className="text-lg font-semibold text-gray-800">Styles:</p>
                    <p className="text-lg text-blue-600">{order.styles.join(', ')}</p>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                    <p className="text-lg font-semibold text-gray-800">Package:</p>
                    <p className="text-lg text-blue-600">{order.package}</p>
                </div>
                  <div className="mt-4">
                    <ImageGrid images={order.deliveredItems} />
                  </div>
                  {/* Add more details as needed */}
                </td>
              </tr>
              
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const statusMappings = {
  created: 'Order Created',
  uploaded: 'Processing',
  delivered: 'Delivered',
  // Add more statuses and their display strings as needed
};

export default OrderList;
