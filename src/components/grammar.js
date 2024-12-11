import React, { useEffect, useState } from 'react';
import grammarData from './grammar.json'; // Adjust the path as needed

const Grammar = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(grammarData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="w-full h-fit flex flex-col p-32 items-center justify-center">
      <img src='/1.png' alt='conjunction of verbs' className='size-8/12 mr-32 my-5' /> 
      <img src='/2.png' alt='part 2' className='size-6/12 my-5' /> 
      <img src='/3.png' alt='part 3' className='size-7/12 my-5' /> 
      <img src='/4.png' alt='part 4' className='size-6/12 my-5' /> 
      <img src='/5.png' alt='part 5' className='size-7/12 my-5' /> 
      <img src='/6.png' alt='part 6' className='size-6/12 my-5' /> 
      <img src='/7.png' alt='part 7' className='size-7/12 my-5' /> 
      <img src='/8.png' alt='part 8' className='size-7/12 my-5' /> 
      <img src='/9.png' alt='part 9' className='size-7/12 my-5' /> 
      <img src='/10.png' alt='part 10' className='size-7/12 my-5' /> 

      <img src='/11.png' alt='conjunction of adjectives' className='size-7/12 my-5' /> 
      <img src='/12.png' alt='part 12' className='size-7/12 my-5' /> 
      <img src='/13.png' alt='part 13' className='size-8/12 my-5' /> 
      <img src='/14.png' alt='part 14' className='size-8/12 my-5' /> 
      <img src='/15.png' alt='part 15' className='size-7/12 my-5' /> 
      <img src='/16.png' alt='part 16' className='size-7/12 my-5' /> 
      <img src='/17.png' alt='congunction of irregular verbs' className='size-8/12 my-5' /> 
      <img src='/18.png' alt='part 18' className='size-7/12 my-5' /> 
      <img src='/19.png' alt='Conjugation' className='size-7/12 my-5' /> 
      <img src='/20.png' alt='part 20' className='size-7/12 my-5' /> 
      <img src='/21.png' alt='part 21' className='size-7/12 my-5' /> 
      <img src='/22.png' alt='part 22' className='size-6/12 my-5' /> 
      <img src='/23.png' alt='part 23' className='size-7/12 my-5' /> 
      <img src='/24.png' alt='part 24' className='size-7/12 my-5' /> 
      <img src='/25.png' alt='part 25' className='size-7/12 my-5' /> 
      <img src='/26.png' alt='part 26 ' className='size-7/12 my-5' /> 
      <img src='/27.png' alt='part 27' className='size-7/12 my-5' /> 
      <img src='/28.png' alt='part 28' className='size-7/12 my-5' /> 
      <img src='/29.png' alt='part 29' className='size-7/12 my-5' /> 
      <img src='/30.png' alt='part 30' className='size-7/12 my-5' /> 
    </div>
  );
};

export default Grammar;
