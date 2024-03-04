"use client";

import { MdPlayCircleFilled, MdAccessTime, MdPhoto, MdCameraAlt, MdDelete, MdThumbUp } from 'react-icons/md'

import React, { useState, useEffect } from 'react';

const varientList = [
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

const varientList2 = [
  {url: '/assets/showcase/b.png', name:''},
  {url: '/assets/showcase/b.png', name:''},
  {url: '/assets/showcase/b.png', name:''},
  {url: '/assets/showcase/b.png', name:''},
]



const MobileNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  

  return (
    <div className="md:hidden">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-gray-800 hover:text-gray-700 focus:outline-none focus:text-gray-700 p-2"
      >
        <svg
          className="h-6 w-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M4 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 5h16a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2zm0 5h16a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2z"
          />
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute top-0 right-0 mt-12 w-48 bg-white p-4 border rounded shadow-md">
          <a href="/login" className="block text-gray-800 py-2 hover:bg-gray-100">
            Login
          </a>
        </div>
      )}
    </div>
  );
};

const LandingPage = () => {
  const [currentWord, setCurrentWord] = useState("Varient 1");
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0); // Fade out

      setTimeout(() => {
        setCurrentWord(prevWord => prevWord === "Varient 1" ? "Varient 2" : "Varient 1");
        setOpacity(1); // Fade in
      }, 500); // Half the interval duration
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const textGradientStyle = {
    backgroundClip: 'text',
    color: 'transparent',
    backgroundImage: 'linear-gradient(to right, #8b5cf6, #4399f7)',
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <header className="border-b border-gray-200 py-4 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="text-3xl font-extrabold hover:text-gray-700 transition duration-300 gradient-text">
          NextJS SaaS
        </a>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="/login" className="text-lg font-medium text-gray-600 hover:text-gray-800 transition duration-300">
            Login
          </a>
        </nav>

        <MobileNav />
      </div>
    </header>


    <section className="py-16">
  <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
    <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
      Make Service In X Styles For <span style={{ opacity, transition: 'opacity 0.5s ease', display: 'inline-block' }}>
        <span style={textGradientStyle}>
          {currentWord}
        </span>
      </span> 
    </h1>
    <p className="text-lg md:text-xl text-gray-700 mb-8 mx-4 md:mx-0">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam semper odio ac lacinia tempus. Nam nec interdum nibh. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.
    </p>


      


      <div className="flex flex-col items-center md:items-start mb-6">
          <a
              href="/login"
              className="font-semibold animated-gradient text-white py-3 px-6 rounded-full text-2xl mt-4"
          >
              Start Creating Now
          </a>
      </div>




    </div>

    <div className="md:w-1/2">
      <img
        src="/assets/showcase/thum.png"
        alt="Placeholder Image"
        className="w-full h-auto md:w-96 mx-auto rounded-md"
      />
    </div>
  </div>
</section>




<section className="border-t border-gray-200 py-16">
  <div className="container mx-auto text-center">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose <span className='gradient-text'>NextJS SaaS</span>?</h2>
    <div className="flex flex-col md:flex-row justify-around">
      <div className="p-4 md:w-1/3">
        <h3 className="text-xl font-semibold mb-2">Lorem ipsum dolor</h3>
        <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <div className="p-4 md:w-1/3">
        <h3 className="text-xl font-semibold mb-2">Lorem ipsum dolor</h3>
        <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <div className="p-4 md:w-1/3">
        <h3 className="text-xl font-semibold mb-2">Lorem ipsum dolor</h3>
        <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </div>
  </div>
</section>


      <div className=" py-16 bg-gray-50">
      {/*Section 1*/}
      <div className="container mx-auto text-center mb-16">
      <h2 className="text-4xl font-semibold text-gray-800 mb-16">How does it work?</h2>
          <div className='mb-4'>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Lorem ipsum dolor</h2>
            <p className="text-gray-600 text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className="flex flex-wrap justify-center -mx-2">
            {varientList2.map((obj, index) => (
              <div key={index} className="text-center mx-2 mb-4 mt-4">
                <div className="relative overflow-hidden group">
                  <img
                    src={obj.url}
                    alt={obj.name}
                    className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-md transition-transform transform group-hover:scale-105"
                  />
                </div>
                {/* <p className="mt-2 text-gray-600">{obj.name}</p> */}
              </div>
            ))}
          </div>
        </div>
        {/*Section 2*/}
        <div className="container mx-auto text-center mb-16 max-w-screen-lg">
  <div className='mb-4'>
    <h2 className="text-4xl font-bold text-gray-800 mb-4">Lorem ipsum dolor</h2>
    <p className="text-gray-600 text-xl">Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor</p>
    <p className="text-gray-600 text-xl mt-2">Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor</p>
  </div>
  <div className="flex flex-wrap justify-center -mx-2">
    {varientList.map((obj, index) => (
      <div key={index} className="text-center mx-2 mb-4 mt-4" style={{ maxWidth: "200px" }}>
        <div className="relative overflow-hidden group">
          <img
            src={obj.url}
            alt={obj.name}
            className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-md transition-transform transform group-hover:scale-105"
          />
        </div>
        <p className="mt-2 text-gray-600">{obj.name}</p>
      </div>
    ))}
  </div>
</div>

        {/*Section 3*/}
        <div className="container mx-auto text-center">
          <div className='mb-4'>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Lorem ipsum dolor</h2>
            <p className="text-gray-600 text-xl mb-10">Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor</p>
            <a href="/login" className="font-semibold animated-gradient text-white py-3 px-6 rounded-full text-2xl mt-4">
              Start Creating Now
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 mt-12">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
  {/* FAQ Item 1 */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      <MdPlayCircleFilled className="text-blue-500 inline-block mr-2" /> Lorem ipsum dolor?
    </h3>
    <p className="text-gray-600">Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor</p>
  </div>

  {/* FAQ Item 2 */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      <MdAccessTime className="text-blue-500 inline-block mr-2" /> Lorem ipsum dolor?
    </h3>
    <p className="text-gray-600">Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor</p>
  </div>

  {/* FAQ Item 3 */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      <MdPhoto className="text-blue-500 inline-block mr-2" /> Lorem ipsum dolor?
    </h3>
    <p className="text-gray-600">Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor.</p>
  </div>

  {/* FAQ Item 4 */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      <MdCameraAlt className="text-blue-500 inline-block mr-2" /> Lorem ipsum dolor?
    </h3>
    <p className="text-gray-600">Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor</p>
  </div>

  {/* FAQ Item 5 */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      <MdDelete className="text-blue-500 inline-block mr-2" /> Lorem ipsum dolor?
    </h3>
    <p className="text-gray-600">Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor</p>
  </div>

  {/* FAQ Item 6 */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      <MdThumbUp className="text-blue-500 inline-block mr-2" /> Lorem ipsum dolor?
    </h3>
    <p className="text-gray-600">Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor</p>
  </div>

  {/* Add more FAQ items as needed */}

</div>

      </div>

      <footer className="border-t border-gray-200 py-8 bg-black text-gray-300">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2 text-gray-300">Legal</h3>
          <ul>
            <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2 text-gray-300">Support</h3>
          <ul>
            <li><a href="mailto:hello@nextjssaassite.com" className="hover:text-white">hello@nextjssaassite.com</a></li>
          </ul>
        </div>


       

        
      </div>

      <div className="text-center mt-8">
        <p className="text-sm">&copy; 2024 NextJS SaaS. All rights reserved.</p>
      </div>
    </footer>

    </div>
  );
};

export default LandingPage;



