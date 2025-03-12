import { useState, useEffect } from "react";
import { getCandidates, scheduleInterview } from "../api/api";

export default function InterviewSchedule() {
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({
    candidateId: "",
    date: "",
    time: "",
    interviewer: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await getCandidates();
        // Access the candidates array from the response data structure
        setCandidates(res.data.candidates || []); // Add fallback empty array
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setSubmitStatus({ type: 'error', message: 'Failed to fetch candidates' });
      }
    }
    fetchCandidates();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      await scheduleInterview(formData);
      setSubmitStatus({ type: 'success', message: 'Interview scheduled successfully!' });
      setFormData({ candidateId: "", date: "", time: "", interviewer: "" });
    } catch (error) {
      console.error("Error scheduling interview:", error);
      setSubmitStatus({ type: 'error', message: 'Failed to schedule interview' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Schedule Interview
          </h2>
          <p className="text-gray-600">Plan and organize candidate interviews</p>
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
          {/* Candidate Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Select Candidate</label>
            <select
              name="candidateId"
              value={formData.candidateId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a candidate</option>
              {candidates.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Interview Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Interview Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Interviewer Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Interviewer Name</label>
            <input
              type="text"
              name="interviewer"
              value={formData.interviewer}
              onChange={handleChange}
              placeholder="Enter interviewer's name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
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
                Scheduling...
              </span>
            ) : (
              'Schedule Interview'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}