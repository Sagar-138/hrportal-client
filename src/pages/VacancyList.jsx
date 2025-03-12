import { useState, useEffect } from "react";
import { getVacancies, deleteVacancy } from "../api/api";

export default function VacancyList() {
  const [vacancies, setVacancies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVacancies() {
      try {
        const res = await getVacancies();
        setVacancies(res.data);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
        setError("Failed to load vacancies");
      } finally {
        setIsLoading(false);
      }
    }
    fetchVacancies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vacancy?")) {
      try {
        await deleteVacancy(id);
        setVacancies(vacancies.filter((v) => v._id !== id));
      } catch (error) {
        console.error("Error deleting vacancy:", error);
      }
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
            Vacancy List
          </h2>
          <p className="text-gray-600 mt-1">Manage and track all job openings</p>
        </div>
        <div className="flex gap-4 items-center">
          <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            Total Vacancies: <span className="font-bold">{vacancies.length}</span>
          </span>
        </div>
      </div>

      {vacancies.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vacancies available</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new vacancy.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {vacancies.map((vacancy) => (
            <div 
              key={vacancy._id} 
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-grow">
                  {/* Main Info */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">{vacancy.jobTitle}</h3>
                    <button
                      onClick={() => handleDelete(vacancy._id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{vacancy.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">{vacancy.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Notice Period</p>
                      <p className="font-medium">{vacancy.noticePeriod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Subcontractor</p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vacancy.subcontractor
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {vacancy.subcontractor ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Primary Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {vacancy.skillsRequired?.primary?.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Secondary Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {vacancy.skillsRequired?.secondary?.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Responsibilities</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {vacancy.responsibilities?.map((r, index) => (
                          <li key={index}>{r}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Qualifications</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {vacancy.qualifications?.map((q, index) => (
                          <li key={index}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="flex justify-between text-xs text-gray-500 pt-4 border-t">
                    <span>Created: {new Date(vacancy.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(vacancy.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}