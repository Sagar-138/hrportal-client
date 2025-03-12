import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import VacancyList from "./pages/VacancyList";
import CandidateList from "./pages/CandidateList";
import CreateVacancy from "./components/CreateVacancy";
import AddCandidate from "./components/AddCandidate";
import InterviewSchedule from "./components/InterviewSchedule";
import OfferLetter from "./components/Offerletter";
import AddMarks from "./components/AddMarks";

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
      <Link 
        to={to} 
        className={`${
          isActive 
            ? 'bg-blue-500 text-white' 
            : 'text-gray-600 hover:bg-blue-50'
        } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95`}
      >
        {children}
      </Link>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white/70 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo Area */}
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">HR Portal</h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <NavLink to="/">Vacancies</NavLink>
                <NavLink to="/candidates">Candidates</NavLink>
                <NavLink to="/create-vacancy">Create Vacancy</NavLink>
                <NavLink to="/add-candidate">Add Candidate</NavLink>
                <NavLink to="/schedule-interview">Schedule Interview</NavLink>
                <NavLink to="/add-marks">Add Marks</NavLink>
                <NavLink to="/offer-letter">Offer Letter</NavLink>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {/* Hamburger icon */}
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <NavLink to="/">Vacancies</NavLink>
                <NavLink to="/candidates">Candidates</NavLink>
                <NavLink to="/create-vacancy">Create Vacancy</NavLink>
                <NavLink to="/add-candidate">Add Candidate</NavLink>
                <NavLink to="/schedule-interview">Schedule Interview</NavLink>
                <NavLink to="/add-marks">Add Marks</NavLink>
                <NavLink to="/offer-letter">Offer Letter</NavLink>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 
              transition-all duration-300 hover:shadow-2xl border border-gray-100">
              <Routes>
                <Route path="/" element={<VacancyList />} />
                <Route path="/candidates" element={<CandidateList />} />
                <Route path="/create-vacancy" element={<CreateVacancy />} />
                <Route path="/add-candidate" element={<AddCandidate />} />
                <Route path="/schedule-interview" element={<InterviewSchedule />} />
                <Route path="/offer-letter" element={<OfferLetter />} />
                <Route path="/add-marks" element={<AddMarks />} />
              </Routes>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/70 backdrop-blur-lg border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © 2024 HR Portal. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
