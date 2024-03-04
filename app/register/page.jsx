'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
        const data = {
            email: email,
            password: password
        }
      let user = axios.post('/api/register', data)
      .then(() => router.push('/login'))

      //console.log(user, "Userrr client side");
    } else {
      setPasswordsMatch(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 flex min-h-screen items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-sm">
        <div className="text-center">
        <div className="flex justify-center">
            <h1 className="text-4xl font-bold gradient-text">NextJS SaaS</h1>
          </div>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            Create an account
          </h2>
        </div>

        <form onSubmit={handleRegister}>
          <div className="mt-8">
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full py-2 px-3 border rounded-md bg-gray-100 text-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full py-2 px-3 border rounded-md bg-gray-100 text-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                className={`w-full py-2 px-3 border rounded-md bg-gray-100 text-gray-600 ${!passwordsMatch ? 'border-red-500' : ''}`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordsMatch(true);
                }}
              />
              {!passwordsMatch && (
                <p className="text-red-500 text-sm mt-1">Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            >
              Register
            </button>

            {/* "Don't have an account yet?" Sign Up Link */}
            <p className="text-center text-gray-600 mt-4">
              Have an account?
              <span
                className="ml-1 text-blue-500 cursor-pointer"
                onClick={handleLogin}
              >
                Sign in here
              </span>
            </p>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
