import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import ViewEventsPage from "../pages/ViewEventPage";
import "../css/OrganizerPage.css";

function OrganizerLayout() {
  return (
    <div className="organizer-container">
      <Sidebar role="organizer" />

      <div className="organizer-content">
        <Routes>
          <Route path="" element={<ViewEventsPage />} />
          <Route path="home" element={<ViewEventsPage />} />
          <Route path="events" element={<ViewEventsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default OrganizerLayout;
