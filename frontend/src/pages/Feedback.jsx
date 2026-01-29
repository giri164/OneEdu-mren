import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Star, Send, CheckCircle, ArrowLeft } from 'lucide-react';

const Feedback = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/user/feedback', { rating, comment });
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      alert('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-950 pt-24 pb-32 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-primary font-bold mb-8 hover:opacity-80 transition"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        {submitted ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border-2 border-green-100 dark:border-green-900/30 shadow-xl">
            <div className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-bold text-green-900 dark:text-green-100 mb-3">Thank You!</h2>
            <p className="text-green-700 dark:text-green-300 text-lg mb-2">Your feedback helps us improve OneEdu for everyone.</p>
            <p className="text-gray-500 dark:text-slate-400 text-sm">Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 dark:border-slate-800">
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-100 mb-2">Share Your Feedback</h1>
              <p className="text-gray-600 dark:text-slate-300 text-lg">Help us improve OneEdu with your valuable insights and suggestions</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">
                  How would you rate your experience?
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 transform ${
                        rating >= num
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 scale-110 shadow-lg'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-slate-600 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Star size={28} fill={rating >= num ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-900 dark:text-slate-100 mb-3">
                  Tell us more
                </label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-6 py-4 border-2 border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                  placeholder="What did you like? What could we improve? Any suggestions for new features?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg flex justify-center items-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Send Feedback
                    <Send size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <p className="text-blue-900 dark:text-blue-100 text-sm">
                <span className="font-bold">💡 Tip:</span> Your feedback is reviewed by our team and helps shape the future of OneEdu. Be as detailed as possible!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
