export const NavItem = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-4 text-sm font-medium transition-colors ${
      isActive ? 'text-gray-200 bg-white' : 'text-gray-800 hover:text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className="mr-3">
      {/* Replace with your actual icon component or SVG */}
      {/* <i className={`fas fa-${icon}`}></i> */}
    </span>
    {label}
  </button>
);
