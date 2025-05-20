import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InstructorHome from "./pages/InstructorHome";
import AddPlayer from "./pages/AddPlayer";
import PlayerProfile from "./pages/PlayerProfile";
import StartSession from "./pages/StartSession";
import SessionDetail from "./pages/SessionDetail";
import AddShotObservation from "./pages/AddShotObservation";
import AddStrategyObservation from "./pages/AddStrategyObservation";
import AddFocusItem from "./pages/AddFocusItem";
import FocusAreas from "./pages/FocusAreas";
import EditFocusItem from "./pages/EditFocusItem";
import EditShotObservation from "./pages/EditShotObservation";
import EditStrategyObservation from "./pages/EditStrategyObservation";
import TrainingTypes from "./pages/TrainingTypes";
import Shots from "./pages/Shots";
import Strategies from "./pages/Strategies";
import ShotVariations from "./pages/ShotVariations";
import SignInPage from "./pages/SignInPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LayoutInstructor from "./components/LayoutInstructor";
import LayoutPlayer from "./components/LayoutPlayer";
import SignUpPage from "./pages/SignUpPage";
import MyProfile from "./pages/MyProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <InstructorHome />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-player"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <AddPlayer />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/:playerId"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <PlayerProfile />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/start-session"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <StartSession />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/:sessionId"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <SessionDetail />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/:sessionId/add-shot"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <AddShotObservation />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/:sessionId/add-strategy"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <AddStrategyObservation />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/training-types"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <TrainingTypes />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/shots"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <Shots />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/strategies"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <Strategies />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/variations"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <ShotVariations />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/focus-areas"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <FocusAreas />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-focus"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <AddFocusItem />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-focus/:focusItemId"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <EditFocusItem />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-shot/:observationId"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <EditShotObservation />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-strategy/:observationId"
          element={
            <ProtectedRoute>
              <LayoutInstructor>
                <EditStrategyObservation />
              </LayoutInstructor>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <LayoutPlayer>
                <MyProfile />
              </LayoutPlayer>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <LayoutInstructor>
              <SignUpPage />
            </LayoutInstructor>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
