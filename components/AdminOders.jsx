import React, { useState } from 'react';
import Link from 'next/link';
import AdminImageGrid from './AdminImageGrid';
import JSZip from 'jszip';
import axios from 'axios';

const AdminOrders = ({ orders, downloadFiles, handleFulfillOrder, handleUploadRequest }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isFulfilling, setIsFulfilling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleOrderClick = (orderId) => {
    if (selectedOrder === orderId) {
      // If the clicked order is already selected, unselect it
      setSelectedOrder(null);
    } else {
      // Select the clicked order
      setSelectedOrder(orderId);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);

    // Display preview images
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);

    // Update selected images
    setSelectedImages((prevImages) => [...prevImages, ...fileArray]);
  };

  const formatDateString = (dateString) => {
    return new Date(dateString).toLocaleString();
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

// const handleUploadImages = (selectedImages, orderId) =>
// {
//     handleUploadRequest(selectedImages, orderId)
//     setSelectedImages([]);
// }


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order, index) => (
            <React.Fragment key={order.id}>
              <tr>
                <td className="px-4 py-2 text-sm font-semibold text-gray-800">{index}</td>
                <td className="px-4 py-2 text-sm font-semibold text-gray-800">{formatDateString(order.createdAt)}</td>
                <td className="px-4 py-2 text-sm font-semibold text-blue-600">{statusMappings[order.status]} {order.lora_url && order.status == "uploaded" ? 'LoRa Ready' : ''}</td>
                <td className="px-4 py-2 text-sm">
                  <button
                      onClick={() => handleOrderClick(order.id)}
                      className='text-blue-600 cursor-pointer'
                    >
                      {selectedOrder === order.id ? 'Hide Details' : 'Show Details'}
                    </button>
                </td>
              </tr>
              {selectedOrder === order.id && (
                <tr>
                <td colSpan="3" className="py-4">
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-semibold text-gray-800">Order ID:</p>
                    <p className="text-lg text-blue-600">{order.id}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-semibold text-gray-800">Customer Email:</p>
                    <p className="text-lg text-blue-600">{order.user.email}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-semibold text-gray-800">Package:</p>
                    <p className="text-lg text-blue-600">{order.package}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-semibold text-gray-800">Created At:</p>
                    <p className="text-lg text-blue-600">{formatDateString(order.createdAt)}</p>
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
                    <p className="text-lg font-semibold text-gray-800">Image Type:</p>
                    <p className="text-lg text-blue-600">{order.imageType}</p>
                </div>
                {order.lora_url && (
                    <div className="mt-4">
                      <p className="text-lg font-semibold text-gray-800">LoRa URL:</p>
                      <div className="flex items-center space-x-4">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                          onClick={() => copyToClipboard(order.lora_url)}
                        >
                          Copy URL
                        </button>
                      </div>
                    </div>
                  )}
                <button
                      onClick={() => {
                        setIsDownloading(true);
                        downloadFiles(order.images, index).finally(() => {
                          setIsDownloading(false);
                        });
                      }}
                      className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ${
                        isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isDownloading}
                    >
                      {isDownloading ? 'Downloading...' : 'Download All Images'}
                    </button>
                    <div className="mt-4">
                      <p className="text-lg font-semibold text-gray-800">Upload Images:</p>
                      {/* Input for selecting images */}
                      <input type="file" multiple onChange={handleFileChange} />
                      {/* Preview selected images */}
                      <div className="flex mt-2">
                        {previewImages?.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover rounded mr-2"
                          />
                        ))}
                      </div>
                      {/* Button to upload images */}
                      {/* <button
                        onClick={()=>handleUploadImages(selectedImages, order.id)}
                        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Upload Images
                      </button> */}
                      <button
                        onClick={() => {
                            setIsUploading(true);
                            handleUploadRequest(selectedImages, order.id).finally(() => {
                                setIsUploading(false);
                                setSelectedImages([]);
                            });
                          }}
                          className={`mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 ${
                            isUploading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Upload Images'}
                      </button>
                    </div>
                  <div className="mt-4">
                    <p className="text-lg font-semibold text-gray-800">User Submitted Images:</p>
                    <AdminImageGrid images={order.images} />
                  </div>
                  <div className="mt-4">
                    <p className="text-lg font-semibold text-gray-800">Delivered Items:</p>
                    <AdminImageGrid images={order.deliveredItems} />
                  </div>
                  <button
                        onClick={() => {
                            setIsFulfilling(true);
                            handleFulfillOrder(order.id).finally(() => {
                                setIsFulfilling(false);
                            });
                          }}
                        className={`mt-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 ${
                            isFulfilling ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        disabled={isFulfilling}
                      >
                        {isFulfilling ? 'Fulfilling...': 'Fulfill Order (Mark as Delivered)'}
                      </button>
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
  created: 'Created 1/3',
  uploaded: 'Uploaded 2/3',
  delivered: 'Delivered 3/3',
  // Add more statuses and their display strings as needed
};

export default AdminOrders;
