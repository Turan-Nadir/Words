import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { siteConfig } from "./siteConfig"; // Replace with your actual config file

const UnitUpdate = () => {
    const { id } = useParams(); // Get unit ID from the URL params
    const [unit, setUnit] = useState(null); // Store the unit data
    const [sauce, setSauce] = useState('');
    const [updatedUnit, setUpdatedUnit] = useState(null); // Track modified unit details

    // Fixed structures for words and story
    const wordTemplate = {
        word: "",
        url:"",
        pronunciation: "",
        part_of_speech: "",
        definition: "",
        example: "",
        korean: "",
        kor_definition: "",
        kor_example: "",
        russian: "",
        rus_definition: "",
        rus_example: "",
        turkish: "",
        tur_definition: "",
        tur_example: "",
    };

    const storyTemplate = {
        title: "",
        kor_title: "",
        rus_title: "",
        tur_title: "",
        content: "",
        kor_content: "",
        rus_content: "",
        tur_content: "",
    };

    // Fetch unit from localStorage
    useEffect(() => {
        const storedUnits = JSON.parse(localStorage.getItem("units"));
        if (storedUnits) {
            const selectedUnit = storedUnits.find((u) => u.day === parseInt(id));
            if (selectedUnit) {
                // Fill missing word fields
                const updatedWords = selectedUnit.words.map((word) => ({
                    ...wordTemplate,
                    ...word,
                }));

                // Fill missing story fields
                const updatedStory = {
                    ...storyTemplate,
                    ...selectedUnit.story,
                };

                setUnit({ ...selectedUnit, words: updatedWords, story: updatedStory });
                setUpdatedUnit({ ...selectedUnit, words: updatedWords, story: updatedStory });
            }
        }
    }, [id]);

    // Handle input changes for words
    const handleWordChange = (index, field, value) => {
        const newWords = [...updatedUnit.words];
        newWords[index][field] = value;
        setUpdatedUnit({ ...updatedUnit, words: newWords });
    };

    // Handle input changes for story
    const handleStoryChange = (field, value) => {
        setUpdatedUnit({
            ...updatedUnit,
            story: { ...updatedUnit.story, [field]: value },
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(siteConfig.links.unitupdate, { unit: updatedUnit, sauce });
            if (response.status === 200) {
                console.log("Unit updated successfully:", response.data);
                
                // Assuming the updated unit is returned in the response
                const updatedUnitFromServer = response.data.unit;
                console.log(updatedUnitFromServer);
                // Fetch existing units from localStorage
                const units = JSON.parse(localStorage.getItem("units")) || [];
                
                // Replace the old unit with the updated unit
                const updatedUnits = units.map((u) =>
                    u.day === parseInt(id) ? updatedUnitFromServer : u
                );
    
                // Save the updated units array back to localStorage
                localStorage.setItem('units', JSON.stringify(updatedUnits));
                alert("Unit updated successfully!");
            }
        } catch (error) {
            console.error("Error updating unit:", error);
            alert("Failed to update unit.");
        }
    };
    

    if (!unit) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modify Unit {id}</h1>
            
            <div className="space-y-6">
                {/* Display and edit words */}
                {updatedUnit.words.map((word, index) => (
                    <div
                        key={index}
                        className="p-4 border border-gray-300 rounded-lg shadow-sm space-y-4"
                    >
                        <h2 className="font-semibold text-lg">Word {index + 1}</h2>
                        {Object.keys(wordTemplate).map((field) => (
                            <div key={field} className="flex flex-col">
                                <label className="font-medium capitalize">{field}:</label>
                                <input
                                    type="text"
                                    className="p-2 border rounded"
                                    value={word[field] || ""}
                                    onChange={(e) =>
                                        handleWordChange(index, field, e.target.value)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ))}

                {/* Display and edit story */}
                <div className="p-4 border border-gray-300 rounded-lg shadow-sm space-y-4">
                    <h2 className="font-semibold text-lg">Story Details</h2>
                    {Object.keys(storyTemplate).map((field) => (
                        <div key={field} className="flex flex-col">
                            <label className="font-medium capitalize">{field}:</label>
                            <input
                                type="text"
                                className="p-2 border rounded"
                                value={updatedUnit.story[field] || ""}
                                onChange={(e) =>
                                    handleStoryChange(field, e.target.value)
                                }
                            />
                        </div>
                    ))}
                </div>

            <div className="bg-slate-400 rounded-full w-60 p-1 border-blue-700">
                <input type="text" 
                className="text-yellow-900 w-full rounded-full"
                value={sauce}
                placeholder="Sauce for finish"
                onChange={(e)=>setSauce(e.target.value)}
                 label="Sauce" />
            </div>
            </div>
            {/* Submit button */}
            <button
                onClick={handleSubmit}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Submit Updates
            </button>
        </div>
    );
};

export default UnitUpdate;
