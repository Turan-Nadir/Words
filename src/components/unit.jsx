import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { siteConfig } from "./siteConfig";

const UnitPage = () => {
    const { id } = useParams(); // Get unit ID from the URL
    const [unit, setUnit] = useState(null); // Store the current unit's data
    const [performance, setPerformance] = useState({}); // Track performance for each word
    const [lang, setLang] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0); // Track which word the user is on
    const [inputValue, setInputValue] = useState(""); // User's input
    const navigate = useNavigate();

    useEffect(() => {
        const storedUnits = JSON.parse(localStorage.getItem("units"));
        const storedPerformance = JSON.parse(localStorage.getItem(`performance_${id}`)) || {};
        setLang(localStorage.getItem("lang") || "eng");
        if (storedUnits) {
            const selectedUnit = storedUnits.find((u) => u.day === parseInt(id, 10));
            setUnit(selectedUnit);
        }
        setPerformance(storedPerformance);
    }, [id]);

    const calculateOverallProgress = () => {
        if (!unit || !unit.words?.length) return 0;

        const totalWords = unit.words.length;
        const totalRequired = totalWords * 10;
        const completed = Object.values(performance).reduce((sum, count) => sum + count, 0);

        return Math.min((completed / totalRequired) * 100, 100);
    };

    const handleInputChange = (e) => {
        const typedWord = e.target.value.trim(); // Trim to avoid leading/trailing spaces
        const currentWord = getLangSpecificField(unit.words[currentWordIndex]); // Get the current word based on the selected language
    
        if (typedWord === currentWord) {
            // Update performance for the current word
            const updatedPerformance = { ...performance };
            updatedPerformance[currentWord] = (updatedPerformance[currentWord] || 0) + 1;
    
            setPerformance(updatedPerformance);
            localStorage.setItem(`performance_${id}`, JSON.stringify(updatedPerformance));
    
            setInputValue(""); // Clear input after correct entry
    
            // Move to the next word if the current one is completed
            if (updatedPerformance[currentWord] === 10) {
                let nextIndex = currentWordIndex + 1;
    
                // Ensure we skip words that have already been completed
                while (
                    nextIndex < unit.words.length &&
                    updatedPerformance[getLangSpecificField(unit.words[nextIndex])] >= 10
                ) {
                    nextIndex++;
                }
    
                if (nextIndex < unit.words.length) {
                    setCurrentWordIndex(nextIndex); // Move to the next word
                } else {
                    console.log("All words completed!");
                    setCurrentWordIndex(unit.words.length); // Mark as complete
                }
            }
        } else {
            setInputValue(typedWord); // Update input for incorrect entries
        }
    };
    
    

    const handleCompleteUnit = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const response = await axios.post(siteConfig.links.unitup, {
                userId: user._id,
                unitNumber: id,
                lang:lang
            });

            if (response.status === 200) {
                console.log("Unit progress updated successfully");
                const updatedUser = response.data.user;
                localStorage.setItem("user", JSON.stringify(updatedUser));
                localStorage.removeItem(`performance_${id}`);
                navigate("/daily");
            }
        } catch (error) {
            console.error("Error updating unit progress:", error);
        }
    };

    if (!unit) return <div>Loading...</div>;

    const isUnitComplete = currentWordIndex >= unit.words.length;

    const getLangSpecificField = (field) =>
        lang === "tur"
            ? field.turkish
            : lang === "kor"
            ? field.korean
            : lang === "rus"
            ? field.russian
            : field.word;

    const getLangSpecificDefinition = (field) =>
        lang === "tur"
            ? field.tur_definition
            : lang === "kor"
            ? field.kor_definition
            : lang === "rus"
            ? field.rus_definition
            : field.definition;

    const getLangSpecificExample = (field) =>
        lang === "tur"
            ? field.tur_example
            : lang === "kor"
            ? field.kor_example
            : lang === "rus"
            ? field.rus_example
            : field.example;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-full h-2 bg-gray-200 overflow-hidden mb-4">
                <div
                    className="h-2 bg-gradient-to-r from-pink-500 to-yellow-500 transition-all duration-300"
                    style={{ width: `${calculateOverallProgress()}%` }}
                />
            </div>
            <h1 className="text-2xl font-bold">Unit {id} - Daily Practice</h1>
            <p className="text-center text-sm font-medium mb-4">{calculateOverallProgress().toFixed(1)}% completed</p>

            <div className="flex flex-col items-center justify-center rounded-lg w-10/12 h-10/12 backdrop:blur-xl bg-slate-100 p-6">
                {isUnitComplete ? (
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-bold text-green-600 mb-2">Congratulations! You’ve completed the unit.</h1>
                        <h3 className="text-xl font-semibold">
                            {lang === "tur"
                                ? unit.story.tur_title
                                : lang === "kor"
                                ? unit.story.kor_title
                                : lang === "rus"
                                ? unit.story.rus_title
                                : unit.story.title}
                        </h3>
                        <p>
                            {lang === "tur"
                                ? unit.story.tur_content
                                : lang === "kor"
                                ? unit.story.kor_content
                                : lang === "rus"
                                ? unit.story.rus_content
                                : unit.story.content}
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-2 text-purple-600">
                            Word: {getLangSpecificField(unit.words[currentWordIndex])} -- {unit.words[currentWordIndex].word}
                        </h2>
                        <img
                            src={unit.words[currentWordIndex].url}
                            alt={getLangSpecificField(unit.words[currentWordIndex])}
                            className="size-52 m-1"
                        />
                        <div className="text-left mb-4 p-4 bg-white shadow rounded">
                            <p className="text-md italic mb-2">
                                <strong>Definition:</strong> {getLangSpecificDefinition(unit.words[currentWordIndex])}
                            </p>
                            <p className="text-md mb-2">
                                <strong>Pronunciation:</strong> {unit.words[currentWordIndex].pronunciation}
                            </p>
                            <p className="text-md">
                                <strong>Example:</strong> {getLangSpecificExample(unit.words[currentWordIndex])}
                            </p>
                        </div>
                        <input
                            type="text"
                            className="text-black px-4 py-2 rounded border border-gray-400 mb-2"
                            placeholder={`Type "${getLangSpecificField(unit.words[currentWordIndex])}"`}
                            value={inputValue}
                            onChange={handleInputChange}
                            disabled={performance[getLangSpecificField(unit.words[currentWordIndex])] >= 10}
                        />
                        <p>{performance[getLangSpecificField(unit.words[currentWordIndex])] || 0} / 10 completed</p>
                    </>
                )}
            </div>
            {isUnitComplete && (
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    onClick={handleCompleteUnit}
                >
                    Submit Unit
                </button>
            )}
        </div>
    );
};

export default UnitPage;
