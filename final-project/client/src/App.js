import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import NavBar from "./components/NavBar";
import CheckInPage from "./pages/CheckInPage";
import CreatorsPage from "./pages/CreatorsPage";
import MoodJourneyPage from "./pages/MoodJourneyPage";
import PersonalizedContentPage from "./pages/PersonalizedContentPage";
import WorldPage from "./pages/WorldPage";

export default function App() {
  const [bgColor, setBgColor] = useState(200);

  const gradientStyle = {
    background: `linear-gradient(to bottom, hsl(${bgColor}, 100%, 50%), white)`,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
      <BrowserRouter>
        <div className={`w-full`} style={gradientStyle}>
          <NavBar />
          <Routes>
            <Route path="/" element={<CheckInPage color={bgColor} />}/>
            <Route path="/creators" element={<CreatorsPage />} />
            <Route path="/moodjourney" element={<MoodJourneyPage />} />
            <Route path="/content" element={<PersonalizedContentPage />} />
            <Route path="/world" element={<WorldPage />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}