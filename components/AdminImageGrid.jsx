import React, { useState } from 'react';

// ... (other imports)

// ... (other imports)

const AdminImageGrid = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(null);
  
    const handleImageClick = (index) => {
      setSelectedImage(index);
    };
  
    const handleCloseModal = () => {
      setSelectedImage(null);
    };
  
    const handleModalClick = (e) => {
      // Prevent clicks inside the modal from closing it
      e.stopPropagation();
    };
  
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 relative z-0">
        {images?.map((image, index) => (
          <div key={index} className="relative aspect-w-1 aspect-h-1">
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full h-32 object-cover rounded cursor-pointer"
              onClick={() => handleImageClick(index)}
            />
            {selectedImage === index && (
              <div
                className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50"
                onClick={handleCloseModal}
              >
                <div
                  className="w-full h-full max-w-screen-md p-4 relative flex items-center justify-center"
                  onClick={handleModalClick}
                >
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                    onClick={handleCloseModal}
                  />
                </div>
              </div>
            )}
            <div className="hidden group-hover:block absolute inset-0 bg-black bg-opacity-50 justify-center items-center z-10">
              <p className="text-black text-sm font-bold">Click to Expand</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default AdminImageGrid;
  