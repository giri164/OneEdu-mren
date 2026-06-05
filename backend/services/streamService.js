const Stream = require('../models/Stream');
const SubDomain = require('../models/SubDomain');

class StreamService {
    // Get all streams with populated subdomains
    async getAllStreams() {
        return await Stream.find().populate('subDomains');
    }

    // Get stream by ID with subdomains
    async getStreamById(id) {
        return await Stream.findById(id).populate('subDomains');
    }

    // Get career path for a stream
    async getCareerPath(streamId) {
        const stream = await Stream.findById(streamId).populate({
            path: 'subDomains',
            populate: {
                path: 'roles',
                populate: 'courses'
            }
        });

        if (!stream) {
            throw new Error('Stream not found');
        }

        return stream;
    }

    // Create new stream
    async createStream(streamData) {
        return await Stream.create(streamData);
    }

    // Update stream
    async updateStream(id, updateData) {
        return await Stream.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });
    }

    // Delete stream
    async deleteStream(id) {
        return await Stream.findByIdAndDelete(id);
    }
}

module.exports = new StreamService();