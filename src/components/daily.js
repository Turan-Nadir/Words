import React, { useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { siteConfig } from "./siteConfig";
import "./hexagon.css";
import axios from "axios";

const DailyPage = () => {
    const [Units, setUnits] = useState([]);
    const [day, setDay] = useState(null);
    const [lang, setLang] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedUnits = JSON.parse(localStorage.getItem("units"));
        const lang = localStorage.getItem("lang");
        setLang(lang);
        if (storedUser) {
            setUser(storedUser);
            setDay(
                lang === "kor"
                    ? storedUser.kor_progress?.next
                    : lang === "rus"
                    ? storedUser.rus_progress?.next
                    : lang === "tur"
                    ? storedUser.tur_progress?.next
                    : storedUser.progress.next
            );
        }
        if (storedUnits) {
            setUnits(storedUnits);
        }
    }, []);

    const handleStart = async () => {
        try {
            const response = await axios.post(siteConfig.links.unit, {
                userId: user._id,
                lang: lang,
            });
            if (response.status === 200) {
                const updatedUser = response.data.user;
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                setDay(updatedUser.progress?.next);
            }
        } catch (error) {
            console.error("Error starting daily progress:", error);
        }
    };

    const getReadyTestUnit = () => {
        // Retrieve the progress units based on the language
             const units = lang === "eng"
            ? user.progress?.units
            : user[`${lang}_progress`]?.units; // Use optional chaining for safety
                
        // Ensure units exist and is an array
        if (Array.isArray(units)) {
            const readyUnit = units.find((unit) => unit.performance === 0);
            return readyUnit || null;
        }
    
        return null;
    };
    

    // Tooltip content for today's unit or ready test
    const getTooltipContent = (unitDay) => {
        const unit = Units.find((u) => u.day === unitDay);
        if (unit && unit.words) {
            return unit.words
                .slice(0, 5)
                .map((w) =>
                    lang === "kor"
                        ? w.korean
                        : lang === "rus"
                        ? w.russian
                        : lang === "tur"
                        ? w.turkish
                        : w.word
                )
                .join(", ");
        }
        return "No words available.";
    };

    if (!day) {
        return (
            <div className="flex flex-col items-center justify-center p-6">
                <h1 className="text-2xl font-bold mb-4">Start Daily Words</h1>
                <button
                    onClick={handleStart}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Start
                </button>
            </div>
        );
    }

    // Get the first unit with performance 0
    const readyTestUnit = getReadyTestUnit();

    return (
        <div className="flex flex-col items-center justify-center h-fit">
            <h1 className="text-2xl font-bold mt-5">Daily Units</h1>
            <div className="flex flex-row gap-4 relative items-center w-9/12">
                {/* Last Finished Unit */}
                {day - 1 > 0 && (
                    <Tooltip content={`${getTooltipContent(day - 1)}...`} placement="top" color="primary">
                        <div
                            className="grayscale hexagon-card bg-gradient-to-br from-yellow-600 to-blue-500 hover:scale-105"
                            onClick={() => navigate(`/unit/${day - 1}`)}
                        >
                            <div className="hexagon-content">
                                <h3>Last Finished Unit {day -1}</h3>
                            </div>
                        </div>
                    </Tooltip>
                )}
                {/* Today's Unit */}
                <Tooltip content={`${getTooltipContent(day )}...`} placement="top" color="primary">
                    <div
                        className="scale-125 m-5 hexagon-card bg-gradient-to-br from-blue-600 to-green-700 hover:scale-150"
                        onClick={() => navigate(`/unit/${day}`)}
                    >
                        <div className="hexagon-content">
                            <h3>Today's Unit {day}</h3>
                        </div>
                    </div>
                </Tooltip>
                {/* Next Unit */}
                <Tooltip content={`${getTooltipContent(day+1)}...`} placement="top" color="primary">
                    <div
                        className="scale-110 m-5 hexagon-card bg-gradient-to-br from-blue-700 to-fuchsia-500 hover:scale-125"
                        onClick={() => navigate(`/unit/${day+1}`)}
                    >
                        <div className="hexagon-content">
                            <h3>Next Unit {day+1}</h3>
                        </div>
                    </div>
                </Tooltip>
            </div>

            <h1 className="text-2xl font-bold my-5">Units Tests</h1>
            <div className="flex flex-row m-2 gap-4 relative items-center w-9/12">
                {/* Today's Ready Test */}
                {readyTestUnit && (
                    <Tooltip content={`${getTooltipContent(readyTestUnit.unit)}...`} placement="top" color="primary">
                        <div
                            className="hexagon-card bg-gradient-to-br from-yellow-600 to-blue-500 hover:scale-105 border-red-500"
                            onClick={() => navigate(`/test/${readyTestUnit.unit}`)}
                        >
                            <div className="hexagon-content">
                                <h3>Today's Ready Test - Unit {readyTestUnit.unit}</h3>
                            </div>
                        </div>
                    </Tooltip>
                )}
                {/* All Units Test */}
                <Tooltip content="This test contains all the units you have completed so far." placement="top" color="primary">
                    <div
                        className="m-5 hexagon-card bg-gradient-to-br from-blue-600 to-green-700 hover:scale-105"
                        onClick={() => navigate(`/test/all`)}
                    >
                        <div className="hexagon-content">
                            <h3>All Units Test</h3>
                        </div>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
};

export default DailyPage;
