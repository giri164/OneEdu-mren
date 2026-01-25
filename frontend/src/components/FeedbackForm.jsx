import { useState } from 'react';
import API from '../api/axios';
import { Star, Send, CheckCircle } from 'lucide-react';

const FeedbackForm = () => {
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
    } catch (err) {
      alert('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-100">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Thank You!</h3>
        <p className="text-green-700">Your feedback helps us improve OneEdu for everyone.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-2xl font-bold mb-6">Share Your Experience</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">How would you rate your experience?</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setRating(num)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  rating >= num ? 'bg-amber-100 text-amber-500 scale-110' : 'bg-gray-50 text-gray-300 hover:bg-gray-100'
                }`}
              >
                <Star size={24} fill={rating >= num ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Feedback</label>
          <textarea
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
            placeholder="Tell us what you like or how we can improve..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition shadow-lg flex justify-center items-center gap-2"
        >
          {loading ? 'Submitting...' : (
            <>
              Send Feedback <Send size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
