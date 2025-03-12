import { useState } from "react";
import { createVacancy } from "../api/api";

export default function CreateVacancy() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    experience: "",
    noticePeriod: "",
    bond: false,
    skillsRequired: { primary: "", secondary: "" },
    responsibilities: "",
    qualifications: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("skillsRequired.")) {
      const skillType = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        skillsRequired: { ...prev.skillsRequired, [skillType]: value.split(",") },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      await createVacancy(formData);
      setSubmitStatus({ type: 'success', message: 'Vacancy created successfully!' });
      setFormData({
        jobTitle: "",
        location: "",
        experience: "",
        noticePeriod: "",
        bond: false,
        skillsRequired: { primary: "", secondary: "" },
        responsibilities: "",
        qualifications: "",
      });
    } catch (error) {
      console.error("Error creating vacancy:", error);
      setSubmitStatus({ type: 'error', message: 'Failed to create vacancy' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create New Vacancy
          </h2>
          <p className="text-gray-600">Fill in the details to post a new job vacancy</p>
        </div>

        {/* Status Message */}
        {submitStatus.message && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Experience and Notice Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Experience Required</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 3-5 years"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Notice Period</label>
              <input
                type="text"
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleChange}
                placeholder="e.g., 2 months"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Skills Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Primary Skills</label>
              <input
                type="text"
                name="skillsRequired.primary"
                value={formData.skillsRequired.primary}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, TypeScript"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400"
                required
              />
              <p className="text-xs text-gray-500">Separate skills with commas</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Secondary Skills</label>
              <input
                type="text"
                name="skillsRequired.secondary"
                value={formData.skillsRequired.secondary}
                onChange={handleChange}
                placeholder="e.g., AWS, Docker, Git"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400"
                required
              />
              <p className="text-xs text-gray-500">Separate skills with commas</p>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Responsibilities</label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="List the key responsibilities for this position"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400 min-h-[100px]"
              required
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Qualifications</label>
            <textarea
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              placeholder="List the required qualifications"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out placeholder-gray-400 min-h-[100px]"
              required
            ></textarea>
          </div>

          {/* Bond Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="bond"
              checked={formData.bond}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">Bond Required</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium
              hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-all duration-200 ease-in-out transform hover:-translate-y-0.5
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Vacancy...
              </span>
            ) : (
              'Create Vacancy'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}