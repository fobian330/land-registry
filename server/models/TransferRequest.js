const mongoose = require('mongoose');

const TransferRequestSchema = new mongoose.Schema({
    requestId: {
        type: Number,
        required: true,
        unique: true
    },
    propertyId: {
        type: Number,
        required: true,
        ref: 'Property'
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    approvedBy: {
        type: String
    },
    approvalDate: {
        type: Date
    },
    reason: {
        type: String
    },
    documents: [{
        type: String,  // IPFS hash
        description: String,
        uploadDate: Date
    }],
    disputeDetails: {
        hasDispute: {
            type: Boolean,
            default: false
        },
        disputeDate: Date,
        disputeReason: String,
        resolution: String,
        resolvedDate: Date
    },
    completionDetails: {
        transactionHash: String,
        completionDate: Date,
        verifiedBy: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
TransferRequestSchema.index({ requestId: 1 });
TransferRequestSchema.index({ propertyId: 1 });
TransferRequestSchema.index({ from: 1 });
TransferRequestSchema.index({ to: 1 });
TransferRequestSchema.index({ status: 1 });
TransferRequestSchema.index({ requestDate: 1 });

// Virtual for checking if waiting period is over
TransferRequestSchema.virtual('waitingPeriodComplete').get(function() {
    if (this.status !== 'Approved') return false;
    const waitingPeriod = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    return Date.now() >= this.approvalDate.getTime() + waitingPeriod;
});

// Virtual for checking if in dispute period
TransferRequestSchema.virtual('inDisputePeriod').get(function() {
    if (this.status !== 'Approved') return false;
    const disputePeriod = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    return Date.now() <= this.approvalDate.getTime() + disputePeriod;
});

module.exports = mongoose.model('TransferRequest', TransferRequestSchema);
