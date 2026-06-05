class JobMatchingService {
    // Calculate match score between user skills and job requirements
    calculateMatchScore(userSkills, jobRequirements) {
        if (!userSkills || !jobRequirements || jobRequirements.length === 0) {
            return 0;
        }

        const userSkillsLower = userSkills.map(skill => skill.toLowerCase().trim());
        const jobReqsLower = jobRequirements.map(req => req.toLowerCase().trim());

        let matchingSkills = 0;
        const matchedSkills = [];
        const missingSkills = [];

        // Check each job requirement against user skills
        jobReqsLower.forEach(req => {
            const isMatched = userSkillsLower.some(userSkill =>
                this.isSkillMatch(userSkill, req)
            );

            if (isMatched) {
                matchingSkills++;
                matchedSkills.push(req);
            } else {
                missingSkills.push(req);
            }
        });

        const matchScore = Math.round((matchingSkills / jobReqsLower.length) * 100);

        return {
            score: matchScore,
            matchingSkills: matchedSkills,
            missingSkills: missingSkills,
            totalRequirements: jobReqsLower.length,
            matchedCount: matchingSkills
        };
    }

    // Check if two skills match (with fuzzy matching)
    isSkillMatch(userSkill, jobSkill) {
        // Exact match
        if (userSkill === jobSkill) return true;

        // Contains match
        if (userSkill.includes(jobSkill) || jobSkill.includes(userSkill)) return true;

        // Common variations
        const skillVariations = {
            'javascript': ['js', 'java script', 'ecmascript'],
            'python': ['py', 'python programming'],
            'react': ['react.js', 'reactjs'],
            'node.js': ['nodejs', 'node', 'express.js'],
            'html': ['html5', 'hypertext markup language'],
            'css': ['css3', 'cascading style sheets'],
            'sql': ['mysql', 'postgresql', 'database'],
            'git': ['github', 'version control'],
            'aws': ['amazon web services', 'cloud'],
            'docker': ['containerization', 'containers']
        };

        // Check if skills are variations of each other
        for (const [canonical, variations] of Object.entries(skillVariations)) {
            if ((userSkill === canonical || variations.includes(userSkill)) &&
                (jobSkill === canonical || variations.includes(jobSkill))) {
                return true;
            }
        }

        return false;
    }

    // Get job recommendations for a user based on their skills
    getJobRecommendations(userSkills, jobs) {
        const recommendations = jobs.map(job => {
            const matchResult = this.calculateMatchScore(userSkills, job.requirements || []);
            return {
                ...job.toObject(),
                matchScore: matchResult.score,
                matchingSkills: matchResult.matchingSkills,
                missingSkills: matchResult.missingSkills
            };
        });

        // Sort by match score (highest first)
        recommendations.sort((a, b) => b.matchScore - a.matchScore);

        return recommendations;
    }

    // Get skill improvement suggestions
    getSkillImprovementSuggestions(userSkills, targetJobs) {
        const allMissingSkills = new Set();
        const skillFrequency = {};

        targetJobs.forEach(job => {
            const matchResult = this.calculateMatchScore(userSkills, job.requirements || []);
            matchResult.missingSkills.forEach(skill => {
                allMissingSkills.add(skill);
                skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
            });
        });

        // Sort missing skills by frequency
        const sortedMissingSkills = Array.from(allMissingSkills)
            .sort((a, b) => (skillFrequency[b] || 0) - (skillFrequency[a] || 0));

        return {
            missingSkills: sortedMissingSkills,
            skillFrequency: skillFrequency,
            totalJobs: targetJobs.length
        };
    }
}

module.exports = new JobMatchingService();