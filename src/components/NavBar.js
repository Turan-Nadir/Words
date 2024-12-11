import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { siteConfig } from './siteConfig';

const Navbar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('lang') || 'English');
  const navigate = useNavigate();
  const location = useLocation();
  const current = location.pathname;
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const parsed = JSON.parse(user);

  if (!token) return null;

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(siteConfig.links.search, { word: searchInput });
      setSearchResult(response.data.word); // Store only the word for display
    } catch (error) {
      console.error("Error during search:", error);
      setSearchResult(null);
    }
  };

  // Handle click on the search result word to navigate to the Word component
  const handleWordClick = () => {
    navigate('word/' + searchResult._id);
    setSearchResult(''); // Clear search results
    setSearchInput(''); // Optionally clear the input field as well
  };

  // Handle language selection
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  if (current === '/') return <div></div>;

  return (
    <nav className="bg-blue-600 w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/dashboard" className="text-white text-xl font-bold">
          Words
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link to="/daily" className="text-white hover:text-blue-200 hover:scale-105">
            Daily
          </Link>
          <Link to="/wordlist" className="text-white hover:text-blue-200 hover:scale-105">
            Wordlist
          </Link>
          <Link to="/grammar" className="text-white hover:text-blue-200 hover:scale-105">
            Grammar
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-2 py-1 rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-blue-600 px-1 py-1 rounded-lg hover:bg-gray-100 hover:scale-105"
          >
            Search
          </button>
        </form>

        {/* User Info and Language Selector */}
        <div className="flex items-center space-x-1">
          <p className="text-white hover:text-blue-200 px-1">Signed in as: @{parsed.username}</p>
          <p className='text-white'>Learning </p>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="bg-white text-blue-600 px-2 py-1 rounded-lg focus:outline-none hover:scale-105"
          >
            <option value="eng">English</option>
            <option value="kor">한국어 </option>
            <option value="rus">Русский </option>
            <option value="tur">Türkçe </option>
          </select>
      
        </div>

        {/* Logout Button */}
        <button
          className="h-fit w-fit p-2 m-3 border-2 rounded-lg border-red-500 text-gray-300 hover:scale-105"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('lang');
            navigate('/');
          }}
        >
          Log Out
        </button>

        {/* Display Word Search Result */}
        {searchResult && (
          <div className="absolute top-16 bg-white text-black p-4 rounded shadow-md w-1/2">
            <p
              className="font-semibold text-lg cursor-pointer hover:underline"
              onClick={() => handleWordClick()} // Pass the whole result to Word component
            >
              {searchResult.word}
            </p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
