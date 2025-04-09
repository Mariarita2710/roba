import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import CarModelsPage from "./pages/CarModelsPage";
import FleetPage from "./pages/FleetPage";
import NotFoundPage from "./pages/NotFoundPage";
import NavbarComponent from "./components/Navbar";
import { ErrorBoundary } from "react-error-boundary";
import ErrorAlert from "./components/ErrorAlert";
import MaintenancePage from "./pages/MaintenancePage.tsx";
import NotesPage from "./pages/NotesPage.tsx";
import { FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className="container mt-4">
            <ErrorAlert message={error.message} />
            <button className="btn btn-primary mt-3" onClick={resetErrorBoundary}>
                Try again
            </button>
        </div>
    );
}


function App() {
    useEffect(() => {
        const updateBodyPadding = () => {
            const navbar = document.querySelector(".navbar");
            if (navbar) {
                document.body.style.paddingTop = `${navbar.clientHeight}px`;
            }
        };

        updateBodyPadding(); // iniziale
        window.addEventListener("resize", updateBodyPadding); // su resize

        return () => window.removeEventListener("resize", updateBodyPadding); // cleanup
    }, []);



    return (
        <Router basename="/ui">
            <NavbarComponent /> {/* assicurati abbia className="navbar" */}
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/models" element={<CarModelsPage />} />
                    <Route path="/fleet" element={<FleetPage />} />
                    <Route path="/fleet/maintenances/:vehicleId" element={<MaintenancePage />} />
                    <Route path="/fleet/notes/:vehicleId" element={<NotesPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </ErrorBoundary>
        </Router>
    );
}

export default App;