import { useState, useEffect } from "react";
import { getCandidates, deleteCandidate } from "../api/api";

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      const res = await getCandidates();
      setCandidates(res.data.candidates || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to load candidates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (candidateId) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteCandidate(candidateId);
      setCandidates(prev => prev.filter(c => c._id !== candidateId));
      alert("Candidate deleted successfully");
    } catch (error) {
      console.error("Error deleting candidate:", error);
      alert("Failed to delete candidate. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Candidate List
          </h2>
          <p className="text-gray-600 mt-1">View and manage all candidates</p>
        </div>
        <div className="flex gap-4 items-center">
          <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            Total Candidates: <span className="font-bold">{candidates.length}</span>
          </span>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates available</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new candidate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden"
            >
              {/* Candidate Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {candidate.experience} years
                    </span>
                    <button
                      onClick={() => handleDelete(candidate._id)}
                      disabled={isDeleting}
                      className={`p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200 
                        ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Delete Candidate"
                    >
                      {isDeleting ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Vacancy Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Applied For</p>
                  <p className="font-medium text-gray-900">
                    {candidate.vacancyId?.jobTitle || "N/A"}
                  </p>
                </div>

                {/* Status and Marks */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      candidate.status === 'selected' ? 'bg-green-100 text-green-800' :
                      candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      candidate.status === 'interviewed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {candidate.status?.charAt(0).toUpperCase() + candidate.status?.slice(1) || 'Pending'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Marks</p>
                    <p className="font-medium text-gray-900">{candidate.marks || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="p-6 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume Link */}
              {candidate.resume && (
                <div className="px-6 py-4 border-t border-gray-100">
                  <a
                    href={candidate.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Resume
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}