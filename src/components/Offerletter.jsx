import { useState, useEffect } from "react";
import { getEligibleCandidates, generateOfferLetter, previewOfferLetter } from "../api/api";

export default function OfferLetter() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [offerLetter, setOfferLetter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    startDate: "",
    salary: "",
    position: "",
    department: "",
    reportingTo: "",
    workLocation: "",
    workHours: "",
    probationPeriod: "3 months",
    companyName: "",
    hrManagerName: "",
    additionalTerms: ""
  });

  useEffect(() => {
    fetchEligibleCandidates();
  }, []);

  const fetchEligibleCandidates = async () => {
    try {
      setIsLoading(true);
      const res = await getEligibleCandidates();
      setCandidates(res.data.candidates);
    } catch (error) {
      setError("Failed to fetch eligible candidates");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'candidateId') {
      const candidate = candidates.find((c) => c._id === value);
      setSelectedCandidate(candidate);
      if (candidate?.vacancyId) {
        setFormData(prev => ({
          ...prev,
          position: candidate.vacancyId.jobTitle,
          department: candidate.vacancyId.department || ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    try {
      setIsLoading(true);
      setError(null);

      const offerLetterData = {
        candidateId: selectedCandidate._id,
        ...formData
      };

      const res = await generateOfferLetter(offerLetterData);

      if (res.data.success) {
        setOfferLetter(res.data.offerLetter);
        // Automatically show preview after generation
        setPreviewContent(res.data.offerLetter.content);
        setShowPreview(true);
        alert("Offer Letter Generated Successfully!");
      } else {
        throw new Error(res.data.message || 'Failed to generate offer letter');
      }
    } catch (error) {
      console.error("Error generating offer letter:", error);
      setError(error.response?.data?.message || error.message || "Failed to generate offer letter");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!offerLetter) return;

    try {
      setIsLoading(true);
      setError(null);
      const res = await previewOfferLetter(offerLetter._id);
      setPreviewContent(res.data.offerLetter.content);
      setShowPreview(true);
    } catch (error) {
      console.error("Error previewing offer letter:", error);
      setError("Failed to preview offer letter");
    } finally {
      setIsLoading(false);
    }
  };

  const PreviewModal = () => {
    if (!showPreview) return null;

    return (
      <div className="fixed inset-0 bg-grey bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Offer Letter Preview</h3>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap font-serif">
            {previewContent}
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Generate Offer Letter
          </h2>
          <p className="text-gray-600">Create and manage offer letters for selected candidates</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Candidate Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Select Candidate</label>
            <select
              name="candidateId"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Candidate</option>
              {candidates.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.email}) - {c.vacancyId?.jobTitle}
                </option>
              ))}
            </select>
          </div>

          {selectedCandidate && (
            <>
              {/* Employment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">Annual Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="Enter annual salary"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">Reporting To</label>
                  <input
                    type="text"
                    name="reportingTo"
                    value={formData.reportingTo}
                    onChange={handleChange}
                    placeholder="Enter reporting manager's name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">Work Location</label>
                  <input
                    type="text"
                    name="workLocation"
                    value={formData.workLocation}
                    onChange={handleChange}
                    placeholder="Enter work location"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Company Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block">HR Manager Name</label>
                  <input
                    type="text"
                    name="hrManagerName"
                    value={formData.hrManagerName}
                    onChange={handleChange}
                    placeholder="Enter HR manager's name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Additional Terms */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Additional Terms</label>
                <textarea
                  name="additionalTerms"
                  value={formData.additionalTerms}
                  onChange={handleChange}
                  placeholder="Enter any additional terms or conditions"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium
                    hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    'Generate Offer Letter'
                  )}
                </button>

                {offerLetter && (
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium
                      hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                      transition-all duration-200"
                  >
                    Preview Offer Letter
                  </button>
                )}
              </div>
            </>
          )}
        </form>
        <PreviewModal />
      </div>
    </div>
  );
}