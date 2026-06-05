import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Target, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const JobMatchDisplay = ({ jobId, userSkills }) => {
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (jobId) {
            fetchMatchScore();
        }
    }, [jobId]);

    const fetchMatchScore = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/user/jobs/match/${jobId}`);
            setMatchData(response.data.data);
        } catch (err) {
            setError('Failed to calculate match score');
            console.error('Match score error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error || !matchData) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
                <p className="text-red-600 dark:text-red-400">{error || 'No match data available'}</p>
            </div>
        );
    }

    const { score, matchingSkills, missingSkills, totalRequirements, matchedCount } = matchData;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
        if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
        return 'bg-red-100 dark:bg-red-900/20';
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-600">
            <div className="flex items-center gap-3 mb-4">
                <Target className="text-primary" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Job Match Analysis
                </h3>
            </div>

            {/* Match Score */}
            <div className={`rounded-lg p-4 mb-6 ${getScoreBg(score)}`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Match Score
                    </span>
                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                        {score}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                            score >= 80 ? 'bg-green-500' :
                            score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {matchedCount} of {totalRequirements} requirements matched
                </p>
            </div>

            {/* Matching Skills */}
            {matchingSkills.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <CheckCircle className="text-green-500" size={16} />
                        Matching Skills ({matchingSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {matchingSkills.map((skill, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm rounded-full"
                            >
                                <CheckCircle size={12} />
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Missing Skills */}
            {missingSkills.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <XCircle className="text-red-500" size={16} />
                        Missing Skills ({missingSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {missingSkills.map((skill, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-sm rounded-full"
                            >
                                <XCircle size={12} />
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {score < 80 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="text-blue-500 mt-0.5" size={16} />
                        <div>
                            <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                                Improve Your Match
                            </h5>
                            <p className="text-xs text-blue-700 dark:text-blue-400">
                                Consider learning the missing skills to increase your match score for this position.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobMatchDisplay;