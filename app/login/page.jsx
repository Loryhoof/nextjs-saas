"use client"

import { useState, useEffect } from "react";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const session = useSession();
  const router = useRouter();

  const [isEmailLogin, setIsEmailLogin] = useState(false);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/add');
    }
  }, [session, router]);

  const handleEmailLogin = async () => {
    const data = {
      email: email,
      password: password
    };
  
    try {
      const response = await signIn('credentials', {...data, redirect: false});
      if(response.error)
      {
        setError(response.error)
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError("An error occurred while signing in.");
    }
  };
  

  const handleSignUp = () => {
    router.push('/register');
  };

  const handleEmailOpen = () => {
    setIsEmailLogin(true);
  }

  const handleEmailClose = () => {
    setIsEmailLogin(false);
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 flex min-h-screen items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-sm">
        {!isEmailLogin &&
        <div className="">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Log in or sign up in seconds
          </h2>

          <p className="">
            Use your email or another service to continue with NextJS SaaS!
          </p>
        </div>
        }

        {isEmailLogin &&
          <div className="flex items-center text-3xl font-semibold text-gray-900 mb-4">
            <button onClick={handleEmailClose} className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#000000" d="M15.45 17.97 9.5 12.01a.25.25 0 0 1 0-.36l5.87-5.87a.75.75 0 0 0-1.06-1.06l-5.87 5.87c-.69.68-.69 1.8 0 2.48l5.96 5.96a.75.75 0 0 0 1.06-1.06z"></path>
              </svg>
            </button>
            Continue with email
          </div>
        }




        <div className="mt-8">
          {isEmailLogin &&
          <div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className={`w-full py-2 px-3 border rounded-md bg-gray-100 text-gray-600 ${error && 'border-red-500'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className={`w-full py-2 px-3 border rounded-md bg-gray-100 text-gray-600 ${error && 'border-red-500'}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // Clear error message when typing
                }}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <button
              type="button"
              onClick={handleEmailLogin}
              className="w-full py-2 text-md font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            >
              Continue
            </button>

            <p className="text-center text-gray-600">
              No account yet?
              <span
                className="ml-1 text-blue-500 cursor-pointer"
                onClick={handleSignUp}
              >
                Sign up now
              </span>
            </p>
          </div>
          }

          

          {!isEmailLogin &&
          <div>
          <button
            onClick={() => signIn('google')}
            className="mb-4 flex items-center justify-center w-full py-2 bg-white text-gray-600 rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="24" width="24" className="mr-2">
              <path fill="#4285f4" d="M386 400c45-42 65-112 53-179H260v74h102c-4 24-18 44-38 57z" />
              <path fill="#34a853" d="M90 341a192 192 0 0 0 296 59l-62-48c-53 35-141 22-171-60z" />
              <path fill="#fbbc02" d="M153 292c-8-25-8-48 0-73l-63-49c-23 46-30 111 0 171z" />
              <path fill="#ea4335" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55z" />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={handleEmailOpen}
            className="flex items-center justify-center w-full py-2 bg-white text-gray-600 rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="mr-2">
            <path fill="#000000" d="M20.37 5.03A2 2 0 0 1 22 7v10a2 2 0 0 1-1.96 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16.1H4zm.13 2.07-4.53 5.31 4.53 4.63a.5.5 0 0 0 0-.04V7.1zm-17-.14a.5.5 0 0 0 0 .04v10a.5.5 0 0 0 0 .04l4.59-4.7L3.5 6.97zm5.57 6.53-3.92 4 13.7.01L15 13.56a4 4 0 0 1-5.93-.07zm9.88-6.99H5l5.07 5.96a2.5 2.5 0 0 0 3.81 0l5.07-5.96z"></path></svg>
            Continue with Email
          </button>
          </div>
          }

        <p className="mt-6 text-sm text-gray-600">
          By continuing, you agree to our 
          <a 
            href="https://www.nextjssaassite.com/terms" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline text-black ml-1"
          >
            Terms of Use
          </a>.
        </p>
        <p className="text-sm text-gray-600">
          Read our 
          <a 
            href="https://www.nextjssaassite.com/privacy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline text-black ml-1"
          >
            Privacy Policy
          </a>.
        </p>



          
        </div>
      </div>
    </div>
  );
};

export default Login;
