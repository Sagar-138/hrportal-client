import { useState, useEffect } from "react";
import { addCandidate, getVacancies } from "../api/api";

export default function AddCandidate() {
  const [candidate, setCandidate] = useState({
    name: "",
    email: "",
    experience: "",
    skills: "",
    vacancyId: "",
    resume: null,
  });

  const [vacancies, setVacancies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    async function fetchVacancies() {
      try {
        const res = await getVacancies();
        setVacancies(res.data);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
        setSubmitStatus({ type: 'error', message: 'Failed to fetch vacancies' });
      }
    }
    fetchVacancies();
  }, []);

  const handleChange = (e) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      setSubmitStatus({ type: 'error', message: 'Please upload a PDF file only' });
      return;
    }
    setCandidate({ ...candidate, resume: file });
    setSubmitStatus({ type: 'success', message: 'File selected successfully' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    if (!candidate.resume) {
      setSubmitStatus({ type: 'error', message: 'Please upload a resume (PDF only)' });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", candidate.name);
    formData.append("email", candidate.email);
    formData.append("experience", candidate.experience);
    formData.append("skills", candidate.skills);
    formData.append("vacancyId", candidate.vacancyId);
    formData.append("resume", candidate.resume);

    try {
      await addCandidate(formData);
      setSubmitStatus({ type: 'success', message: 'Candidate added successfully!' });
      setCandidate({
        name: "",
        email: "",
        experience: "",
        skills: "",
        vacancyId: "",
        resume: null,
      });
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error("Error adding candidate:", error);
      setSubmitStatus({ type: 'error', message: 'Failed to add candidate' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Candidate</h2>
          <p className="text-gray-600">Enter candidate details to create a new profile</p>
        </div>

        {submitStatus.message && (
          <div className={`mb-4 p-4 rounded-lg ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={candidate.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400"
              required
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={candidate.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400"
              required
            />
          </div>

          {/* Experience Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Experience (Years)</label>
            <input
              type="text"
              name="experience"
              placeholder="e.g., 5"
              value={candidate.experience}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400"
              required
            />
          </div>

          {/* Skills Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="React, Node.js, MongoDB"
              value={candidate.skills}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400"
              required
            />
            <p className="text-xs text-gray-500">Separate skills with commas</p>
          </div>

          {/* Vacancy Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Select Vacancy</label>
            <select
              name="vacancyId"
              value={candidate.vacancyId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out bg-white"
              required
            >
              <option value="">Choose a position</option>
              {vacancies.map((vacancy) => (
                <option key={vacancy._id} value={vacancy._id}>
                  {vacancy.jobTitle} ({vacancy.location})
                </option>
              ))}
            </select>
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Resume (PDF)</label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-center rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-all duration-200">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="mt-2 text-sm text-gray-600">Click to upload resume</span>
                <input
                  type="file"
                  name="resume"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
            {candidate.resume && (
              <p className="text-sm text-green-600">
                Selected file: {candidate.resume.name}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-all duration-200 ease-in-out transform hover:-translate-y-0.5
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Add Candidate'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}