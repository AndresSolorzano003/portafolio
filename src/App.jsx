import { Route, Routes } from "react-router-dom";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

export default function App() {
  return (
    <>
      <div className="grain" />
      <CustomCursor />
      <ScrollProgress />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/proyecto/:slug" element={<ProjectDetailPage />} />
      </Routes>
    </>
  );
}
