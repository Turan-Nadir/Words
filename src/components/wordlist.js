'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { siteConfig } from './siteConfig';

const Wordlist = () => {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [filter, setFilter] = useState({
    sort: '',
    frequency: '',
    type: '',
    language: '',
  });

  useEffect(()=>{
    const fetchWords = async () => {
      try {
        const response = await axios.get(siteConfig.links.all);
        setWords(response.data.words);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    }
    const instorage = localStorage.getItem("words");
    const storedWords = JSON.parse(instorage);
    if(!storedWords) fetchWords();
    setWords(storedWords);
}, []);

  const applyFilters = () => {
    let tempWords = [...words];

    if (filter.frequency) {
      tempWords = tempWords.filter((word) => word.frequency === parseInt(filter.frequency, 10));
    }

    if (filter.type) {
      tempWords = tempWords.filter((word) => word.type === filter.type);
    }

    // Apply sorting by alphabetical order if selected
    if (filter.sort === 'asc') {
      tempWords.sort((a, b) => a.word.localeCompare(b.word));
    } else if (filter.sort === 'desc') {
      tempWords.sort((a, b) => b.word.localeCompare(a.word));
    }

    setFilteredWords(tempWords);
  };

  // Reapply filters whenever any filter option changes
  useEffect(() => {
    applyFilters();
  }, [filter.frequency, filter.type, filter.sort, words]);

  // Update the filter state as user selects filter options
  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col p-6 justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Wordlist</h1>

      <div className="flex flex-wrap items-center space-x-4 mb-6 bg-gray-200 p-4 rounded-lg">
       <div>word count:{filteredWords.length}</div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Sort</label>
          <select
            name="sort"
            value={filter.sort}
            onChange={handleFilterChange}
            className="p-2 rounded-lg border-gray-300"
          >
            <option value="">Select</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Frequency</label>
          <select
            name="frequency"
            value={filter.frequency}
            onChange={handleFilterChange}
            className="p-2 rounded-lg border-gray-300"
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5].map((freq) => (
              <option key={freq} value={freq}>{freq}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Part of Speech</label>
          <select
            name="type"
            value={filter.type}
            onChange={handleFilterChange}
            className="p-2 rounded-lg border-gray-300"
          >
            <option value="">Select</option>
            <option value="noun">Noun</option>
            <option value="verb">Verb</option>
            <option value="adverb">Adverb</option>
            <option value="adjective">Adjective</option>
          </select>
        </div>

        
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Language</label>
          <select
            name="language"
            value={filter.language}
            onChange={handleFilterChange}
            className="p-2 rounded-lg border-gray-300"
          >
            <option value="">Select</option>
            <option value="korean">Korean</option>
            <option value="english">English</option>
            <option value="russian">Russian</option>
            <option value="turkish">Turkish</option>
          </select>
        </div>

      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredWords.map((word) => (
          <div
            key={word._id}
            className="p-4 border rounded-lg shadow-sm bg-white hover:bg-blue-100 cursor-pointer"
          >
            <h3 className="text-lg font-semibold">
              <Link to={`/word/${word._id}`}> {word.word}</Link> {/* Updated link */}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wordlist;
