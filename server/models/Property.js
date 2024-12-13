const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    propertyId: {
        type: Number,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    coordinates: {
        type: String,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Available', 'PendingTransfer', 'Locked'],
        default: 'Available'
    },
    ipfsHash: {
        type: String,
        required: true
    },
    documents: [{
        type: String,
        description: String,
        uploadDate: Date
    }],
    transferHistory: [{
        from: String,
        to: String,
        date: Date,
        price: Number,
        transactionHash: String
    }],
    metadata: {
        propertyType: String,
        yearBuilt: Number,
        amenities: [String],
        zoning: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
PropertySchema.index({ propertyId: 1 });
PropertySchema.index({ owner: 1 });
PropertySchema.index({ location: 'text' });
PropertySchema.index({ status: 1 });

module.exports = mongoose.model('Property', PropertySchema);
