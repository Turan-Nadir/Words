import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import dayjs from 'dayjs';
import Particle from './particle';
// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    // Fetch user data (simulate fetching from localStorage or API)
    const user = JSON.parse(localStorage.getItem('user')); // Assuming user data is stored in localStorage
    const storedunits = JSON.parse(localStorage.getItem('units')) || []; // Default to empty array if null
    if (user) {
      setUserData(user);
      calculateProgress(user, storedunits); // Pass storedunits directly
    }
  }, []);

  const calculateProgress = (user, storedunits) => {
    const languages = ['kor', 'rus', 'tur', 'eng']; // List of supported languages
    const progress = {};

    languages.forEach((lang) => {
      const progressField = lang==="eng"?"progress":`${lang}_progress`;
      const langData = user[progressField];

      if (langData) {
        if (langData.startdate) {
          const learntUnits = langData.units.filter((unit) => unit.startdate).length;
          const totalUnits = storedunits.length; // Use passed storedunits length
          const testedUnits = langData.units.filter((unit) => unit.finishdate).length;

          // Calculate daily progress from startdate to today
          const start = dayjs(langData.startdate);
          const today = dayjs();
          const days = today.diff(start, 'day') + 1; // Include today
          const dailyProgress = Array.from({ length: days }, (_, i) => {
            const date = start.add(i, 'day').format('D MMM'); // e.g., 8 Dec
            const unit = langData.units.find((u) => dayjs(u.startdate).isSame(start.add(i, 'day'), 'day'));
            return {
              label: date,
              progress: unit ? unit.performance : 0, // Use 0 if no unit found
            };
          });

          progress[lang] = {
            learntUnits,
            totalUnits,
            testedUnits,
            unitProgress: dailyProgress,
          };
        } else {
          progress[lang] = { message: 'You have not started this language' };
        }
      } else {
        progress[lang] = { message: `No progress data found for ${lang}` };
      }
    });

    setProgressData(progress);
  };

  // Function to generate the doughnut chart data
  const getDoughnutData = (learntUnits, totalUnits) => ({
    labels: ['Learnt', 'Remaining'],
    datasets: [
      {
        data: [learntUnits, totalUnits - learntUnits],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  });

  // Function to generate the bar chart data
  const getBarData = (unitProgress) => ({
    labels: unitProgress.map((unit) => unit.label),
    datasets: [
      {
        label: 'Performance',
        data: unitProgress.map((unit) => unit.progress),
        backgroundColor: '#FF6384',
        borderColor: '#FF6384',
        borderWidth: 1,
      },
    ],
  });
  const langLabel = (lang) =>{
    return lang==="kor"? "Korean Language progress":
    lang==="rus"? "Russian Language progress":
    lang==="tur"? "Turkish Language progress":"English Language progress"
  }

  return (
    <div className='flex flex-col items-center justify-center p-3'>
      <Particle/>
      <h1 className='text-2xl font-bold mt-5'>Dashboard</h1>

      {userData ? (
        Object.keys(progressData).map((lang) => {
          const langProgress = progressData[lang];

          if (langProgress.message) {
            return (
              <div key={lang} className='flex flex-col items-center space-x-2 justify-center w-fit h-fit p-3 m-5 border rounded-lg shadow-lg backdrop-blur-md'>
                <h2 className='text-xl font-semibold'>{langLabel(lang)}</h2>
                <p>{langProgress.message}</p>
                <p>Change your learning language to this language 
                  and go to Daily page to start a progress.</p>
              </div>
            );
          }

          return (
            <div key={lang} className='flex flex-col items-center space-x-2 justify-center w-fit h-fit p-3 m-5 border rounded-lg shadow-lg backdrop-blur-md'>
              <h2 className='text-xl font-semibold'>{langLabel(lang)}</h2>
              <div className='flex flex-row'>

              {/* Doughnut chart for learnt units */}
              <div className='w-2/3 p-2'>
                <h3>Learnt Units</h3>
                <Doughnut
                 className='bg-slate-100 rounded-lg'
                  data={getDoughnutData(langProgress.learntUnits, langProgress.totalUnits)}
                  options={{ maintainAspectRatio: false }}
                  style={{ maxWidth: '300px', maxHeight: '300px' }} 
                  />
              </div>

             
              <div className='w-2/3 p-2'>
                <h3>Performance by Day</h3>
                <Bar
                className='rounded-lg bg-slate-100'
                  data={getBarData(langProgress.unitProgress)}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }}
                  style={{ maxHeight: '300px', maxWidth:"450px" }} // Control size
                  />
                  </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
