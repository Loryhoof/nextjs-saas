import React from 'react';
import Link from 'next/link';
import SignInButton from './SignInButton';

const Header = () => {
  return (
    <header className="bg-black text-white sticky top-0 z-10">
      <div className="container mx-auto px-8">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-bold hover:text-purple-500">
            NextJS SaaS
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/chat" className="text-base hover:text-purple-500">
              <span>Chat</span>
            </Link>
            <Link href="/pricing" className="text-base hover:text-purple-500">
              <span>Pricing</span>
            </Link>
          </div>
          <SignInButton />
        </nav>
      </div>
    </header>
  );
}

export default Header;
