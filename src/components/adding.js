import React, { useState } from 'react';
import axios from 'axios';
import {siteConfig} from './siteConfig';

const AddWord = () => {
  const [formData, setFormData] = useState({
    word: '',
    lang: '',
    translation: '',
    frequency: 0,
    image: '',
    sauce: '',
    type: 'noun', // default selection
    definition: '',
    example: '',
  });
  const [message, setMessage] = useState(null);

  // Update form state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Submit form data to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert definition and example to arrays
      const data = {
        ...formData,
        definition: formData.definition.split(',').map((item) => item.trim()), // convert comma-separated string to array
        example: formData.example.split(',').map((item) => item.trim()), // convert comma-separated string to array
      };

      const response = await axios.post(siteConfig.links.add, data);
      setMessage(response.data.message); // Display success message
    } catch (error) {
      console.error("Error adding word:", error);
      setMessage('Failed to add word');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Word</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Language Selection */}
        <div>
          <label className="block text-gray-700">Language:</label>
          <select
            name="lang"
            value={formData.lang}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select</option>
            <option value="korean">Korean</option>
            <option value="english">English</option>
            <option value="russian">Russian</option>
            <option value="turkish">Turkish</option>
          </select>
        </div>

        {/* Word */}
        <div>
          <label className="block text-gray-700">Word:</label>
          <input
            type="text"
            name="word"
            value={formData.word}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Translation */}
        <div>
          <label className="block text-gray-700">Translation:</label>
          <input
            type="text"
            name="translation"
            value={formData.translation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
       
        {/* Image URL */}
        <div>
          <label className="block text-gray-700">Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Sauce */}
        <div>
          <label className="block text-gray-700">Sauce:</label>
          <input
            type="text"
            name="sauce"
            value={formData.sauce}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-gray-700">Frequency:</label>
          <input
            type="number"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-gray-700">Type:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="noun">Noun</option>
            <option value="verb">Verb</option>
            <option value="adverb">Adverb</option>
            <option value="adjective">Adjective</option>
          </select>
        </div>

        {/* Definition */}
        <div>
          <label className="block text-gray-700">Definition (comma-separated):</label>
          <input
            type="text"
            name="definition"
            value={formData.definition}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Example */}
        <div>
          <label className="block text-gray-700">Example (comma-separated):</label>
          <input
            type="text"
            name="example"
            value={formData.example}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Word
        </button>
      </form>
      {message && <p className="mb-4 text-green-600">{message}</p>}
    </div>
  );
};

export default AddWord;
