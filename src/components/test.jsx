import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { siteConfig } from "./siteConfig";

const TestPage = () => {
    const { slug } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [unitId, setUnitId] = useState("");
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [selectedLang, setSelectedLang] = useState("");
    const [selectedOption, setSelectedOption] = useState(""); // For select element
    const [inputAnswer, setInputAnswer] = useState(""); // For input fields
    const [isTestCompleted, setIsTestCompleted] = useState(false);
    const navigate = useNavigate();

useEffect(() => {
        const lang = localStorage.getItem("lang") || "eng";
        setSelectedLang(lang);
        prepareTest(lang);
}, [slug]);

const prepareTest = (lang) => {
        const storedUnits = JSON.parse(localStorage.getItem("units")) || [];
        let allWords = [];
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return console.error("User not found in localStorage");
        
        let progressField;
        switch (lang) {
            case 'kor': progressField = 'kor_progress';
                break;
            case 'rus': progressField = 'rus_progress';
                break;
            case 'tur': progressField = 'tur_progress';
                break;
            case 'eng': progressField = 'progress';
                break;
            default:  console.error(`Invalid language: ${lang}`);
                return;
        };
        const userProgress = user[progressField];
        if (!userProgress || !userProgress.units) return console.error(`No units found in ${lang} progress for user`);
        
        // Filter the units the user has made progress in
        const userUnitNumbers = userProgress.units.map(unit => unit.unit);
    
        // Filter the stored units based on the user's progress
        let filteredUnits = storedUnits.filter(unit => userUnitNumbers.includes(unit.day));
    
        // Check if units have words
        filteredUnits.forEach(unit => {
            if (!unit.words || unit.words.length === 0)  console.error(`Unit ${unit.day} has no words`);
        });
        // If slug is "all", get words from all units that exist in progress
        if (slug === "all") {
            allWords = filteredUnits.flatMap(unit => {
                if (unit.words && unit.words.length > 0)   return unit.words;  // Only return words if they exist
                return [];
            });
        } else if (!isNaN(slug)) {
            // Get words only from the specific unit in progress
            const unit = filteredUnits.find(u => u.day === parseInt(slug));
            if (unit && unit.words) {
                setUnitId(parseInt(slug));
                allWords = unit.words;
            } else {
                console.error(`No words found for unit ${slug}`);
            }
        }    
        // Only generate questions if we have words to work with
        if (allWords.length > 0) {
            generateQuestions(allWords, lang);
        } else {
            console.error("No words found for this test.");
        }
    };
    
const langMap = {  kor: "korean", tur: "turkish", rus: "russian", eng:"word"};
    
const generateQuestions = (words, lang) => {
    const mappedLang = langMap[lang]; // Map the lang to the full key
    if (!mappedLang) {
        console.error(`Invalid language code: ${lang}`);
        return;
    }

    const shuffledWords = words.sort(() => 0.5 - Math.random());
    const questionSet = shuffledWords.map((word) => {
        const questionType = Math.floor(Math.random() * 3); // Randomize question type
        const options = words
            .filter((w) => w !== word) // Exclude current word
            .sort(() => 0.5 - Math.random()) // Shuffle
            .slice(0, 3) // Take 3 random words
            .map((w) => w[mappedLang]); // Use the mapped language key

        options.push(word[mappedLang]); // Add correct answer
        options.sort(() => 0.5 - Math.random()); // Shuffle options

        // Get the correct field for definition and example
        const definitionField = lang === "eng" ? "definition" : `${lang}_definition`;
        const exampleField = lang === "eng" ? "example" : `${lang}_example`;

        if (questionType === 0) {
            // Multiple choice question
            return {
                question: `Which word in ${lang} matches this definition: "${word[definitionField]}"?`,
                type: "multiple-choice",
                correctAnswer: word[mappedLang],
                options,
            };
        } else if (questionType === 1) {
            // Input word by looking at an image
            return {
                question: `What is the word in ${lang} for this image?`,
                type: "image",
                image: word.url,
                correctAnswer: word[mappedLang],
            };
        } else {
            // Input word based on an example sentence
            const exampleSentence = word[exampleField];
            if (!exampleSentence) {
                // If there's no example sentence, return a fallback question
                return {
                    question: `What is the word in ${lang} for this definition: "${word[definitionField]}"?`,
                    type: "fill-in",
                    correctAnswer: word[mappedLang],
                };
            }

            return {
                question: `Fill in the blank: "${exampleSentence.replace(word[mappedLang], "_____")}"`,
                type: "fill-in",
                correctAnswer: word[mappedLang],
            };
        }
    });

    setQuestions(questionSet);
};


    const calculateOverallProgress = () => {
        if (!currentQuestionIndex || !questions?.length) return 0;

        const totalWords = questions.length;
        const completed = currentQuestionIndex+1;

        return Math.min((completed / totalWords) * 100, 100);
    };

    const handleAnswer = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const userAnswer = currentQuestion.type === "multiple-choice" ? selectedOption : inputAnswer;

        if (userAnswer=== currentQuestion.correctAnswer)  setScore(score + 5); 


        // Reset input values
        setSelectedOption("");
        setInputAnswer("");

        // Move to the next question or finish
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            submitTestResults();
        }
    };
    const submitTestResults = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return;
    
            const response = await axios.post(siteConfig.links.test, {
                userId: user._id,
                lang: selectedLang,
                performance: score,
                unitNumber: unitId,
            });
    
            localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(response.data.user));
    
            setIsTestCompleted(true); // Mark test as completed
        } catch (error) {
            console.error("Error submitting test results:", error);
        }
    };
    

    if (!questions.length) {
        return <div>Loading...</div>;
    }

    if (!isTestStarted) {
        return (
            <div className="flex flex-col items-center justify-center p-6">

                <h1 className="text-2xl font-bold mb-4">Ready to Start the Test?</h1>
                <button
                    onClick={() => setIsTestStarted(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Start Test
                </button>
            </div>
        );
    }
    // Show the result if test is completed
if (isTestCompleted) {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-full h-2 bg-gray-200 overflow-hidden mb-10">
                <div
                    className="h-2 bg-gradient-to-r from-pink-500 to-yellow-500 transition-all duration-300"
                    style={{ width: `${calculateOverallProgress()}%` }}
                />
            </div>
            <h1 className="text-2xl font-bold mb-4">Test Completed</h1>
            <p className="text-lg">Your Score: {score} / {questions.length * 5}</p>
            <button
                onClick={() => navigate("/daily")}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
                Go to Daily Practice
            </button>
        </div>
    );
}


    const currentQuestion = questions[currentQuestionIndex];
  
return (
    <div className="test-page flex flex-col items-center">
        <div className="w-full max-w-full h-2 bg-gray-200 overflow-hidden mb-4">
                <div
                    className="h-2 bg-gradient-to-r from-pink-500 to-yellow-500 transition-all duration-300"
                    style={{ width: `${calculateOverallProgress()}%` }}
                />
            </div>
        <h1 className="text-xl font-semibold my-5">Unit Test - {slug === "all" ? "All Units" : `Day ${slug}`}</h1>
        <div className="question-section flex flex-col rounded-lg border bg-slate-200 p-5 w-fit h-fit items-center">
            <p className="font-bold m-3">{currentQuestion.question}</p>
            {currentQuestion.type === "image" && (
                <div className="m-3">
                    <img src={currentQuestion.image} alt="Test" className="test-image" />
                    <input
                        type="text"
                        placeholder="Type your answer..."
                        value={inputAnswer}
                        onChange={(e) => setInputAnswer(e.target.value)}
                        className="input-answer m-3"
                    />
                </div>
            )}
            {currentQuestion.type === "multiple-choice" && (
                <div className="options m-3">
                    <select
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="select-answer"
                    >
                        <option value="">Select an answer</option>
                        {currentQuestion.options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {currentQuestion.type === "fill-in" && (
                <input
                    type="text"
                    placeholder="Type your answer..."
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    className="input-answer"
                />
            )}
        </div>
        <button
            onClick={handleAnswer}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            disabled={
                (currentQuestion.type === "multiple-choice" && !selectedOption) ||
                (currentQuestion.type !== "multiple-choice" && !inputAnswer)
            }
        >
            Next
        </button>
        <p>
            Question {currentQuestionIndex + 1} of {questions.length}
        </p>
    </div>
);
};

export default TestPage;
