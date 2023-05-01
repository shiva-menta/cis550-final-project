import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import NavBar from "./components/NavBar";
import CheckInPage from "./pages/CheckInPage";
import ExploreCreatorsPage from "./pages/ExploreCreatorsPage";
import MoodJourneyPage from "./pages/MoodJourneyPage";
import WorldPage from "./pages/WorldPage";
import TitleComparisonsPage from "./pages/TitleComparisonsPage";
import CreatorPage from "./pages/CreatorPage";

export default function App() {
    const [bgColor, setBgColor] = useState(200);

    const gradientStyle = {
        background: `linear-gradient(to bottom, hsl(${bgColor}, 80%, 50%), hsl(${bgColor}, 40%, 50%))`,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    };

  return (
    <BrowserRouter>
        <div className={`w-full`} style={gradientStyle}>
            <NavBar />
            <Routes>
                <Route path="/" element={<CheckInPage color={bgColor} setColor={setBgColor} />}/>
                <Route path="/explorecreators" element={<ExploreCreatorsPage color={bgColor} />} />
                <Route path="/creator/:name/:type" element={<CreatorPage />} />
                <Route path="/moodjourney" element={<MoodJourneyPage color={bgColor} />} />
                <Route path="/world" element={<WorldPage />} />
                <Route path="/titlecomparisons" element={<TitleComparisonsPage color={bgColor} />} />
            </Routes>
        </div>
    </BrowserRouter>
  );
}