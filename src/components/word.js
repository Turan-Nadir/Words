import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { siteConfig } from './siteConfig';

const Word = () => {
  const { id } = useParams(); // Get the word ID from the URL
  const [wordDetails, setWordDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWordDetails = async () => {
      try {
        const response = await axios.get(siteConfig.links.word + id);
        setWordDetails(response.data.word); // Assuming response.data.word contains word details
      } catch (error) {
        console.error('Error fetching word details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWordDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!wordDetails) return <div>No word details found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{wordDetails.word}</h1>
      {/* Display image if it exists */}
      {wordDetails?.imageUrl && (
        <img
          src={wordDetails.imageUrl}
          alt={wordDetails.word}
          height={400}
          width={400}
          className="my-4"
        />
      )}
      <h2 className="text-xl">{wordDetails.translation}</h2>
      <p>
        <strong>Frequency:</strong> {wordDetails.frequency}
      </p>
      <p>
        <strong>Type:</strong> {wordDetails.type}
      </p>
      <div>
        <strong>Definitions:</strong> {wordDetails.definition}
      </div>
    </div>
  );
};

export default Word;
