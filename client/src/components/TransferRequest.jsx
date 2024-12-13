import React from 'react';
import styled from 'styled-components';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const RequestCard = styled.div`
    background: ${props => props.theme.colors.white};
    border-radius: ${props => props.theme.borderRadius.medium};
    box-shadow: ${props => props.theme.shadows.medium};
    padding: ${props => props.theme.spacing.lg};
    margin: ${props => props.theme.spacing.md} 0;
`;

const RequestHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${props => props.theme.spacing.md};
`;

const PropertyInfo = styled.div`
    flex: 1;
`;

const PropertyTitle = styled.h3`
    color: ${props => props.theme.colors.navy};
    margin: 0;
    margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatusBadge = styled.span`
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.xs};
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    border-radius: 20px;
    font-size: 0.875rem;
    background: ${props => {
        switch (props.status) {
            case 'Pending':
                return props.theme.colors.orange;
            case 'Approved':
                return props.theme.colors.green;
            case 'Rejected':
                return 'red';
            case 'Completed':
                return props.theme.colors.blue;
            default:
                return props.theme.colors.darkGray;
        }
    }};
    color: white;
`;

const TransferDetails = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${props => props.theme.spacing.md};
    margin: ${props => props.theme.spacing.md} 0;
    padding: ${props => props.theme.spacing.md};
    background: ${props => props.theme.colors.lightGray};
    border-radius: ${props => props.theme.borderRadius.small};
`;

const DetailItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.spacing.xs};
`;

const Label = styled.span`
    color: ${props => props.theme.colors.darkGray};
    font-size: 0.875rem;
`;

const Value = styled.span`
    color: ${props => props.theme.colors.navy};
    font-weight: 500;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: ${props => props.theme.spacing.sm};
    margin-top: ${props => props.theme.spacing.lg};
`;

const Button = styled.button`
    background: ${props => {
        if (props.approve) return props.theme.colors.green;
        if (props.reject) return 'red';
        return props.theme.colors.blue;
    }};
    color: white;
    border: none;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.small};
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.xs};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${props => props.theme.shadows.small};
    }

    &:disabled {
        background: ${props => props.theme.colors.lightGray};
        cursor: not-allowed;
    }
`;

const TransferRequest = ({
    request,
    property,
    onApprove,
    onReject,
    onExecute,
    isInspector,
    currentTime
}) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return <FaClock />;
            case 'Approved':
                return <FaCheckCircle />;
            case 'Rejected':
                return <FaTimesCircle />;
            default:
                return null;
        }
    };

    const canExecute = request.status === 'Approved' && 
                      currentTime >= request.requestDate + (7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

    return (
        <RequestCard>
            <RequestHeader>
                <PropertyInfo>
                    <PropertyTitle>{property.location}</PropertyTitle>
                    <div>Property ID: {property.propertyId}</div>
                </PropertyInfo>
                <StatusBadge status={request.status}>
                    {getStatusIcon(request.status)} {request.status}
                </StatusBadge>
            </RequestHeader>

            <TransferDetails>
                <DetailItem>
                    <Label>From</Label>
                    <Value>{request.from.slice(0, 6)}...{request.from.slice(-4)}</Value>
                </DetailItem>
                <DetailItem>
                    <Label>To</Label>
                    <Value>{request.to.slice(0, 6)}...{request.to.slice(-4)}</Value>
                </DetailItem>
                <DetailItem>
                    <Label>Price</Label>
                    <Value>{request.price} ETH</Value>
                </DetailItem>
                <DetailItem>
                    <Label>Request Date</Label>
                    <Value>{new Date(request.requestDate).toLocaleDateString()}</Value>
                </DetailItem>
            </TransferDetails>

            {request.status === 'Pending' && isInspector && (
                <ActionButtons>
                    <Button approve onClick={() => onApprove(request.requestId)}>
                        <FaCheckCircle /> Approve
                    </Button>
                    <Button reject onClick={() => onReject(request.requestId)}>
                        <FaTimesCircle /> Reject
                    </Button>
                </ActionButtons>
            )}

            {canExecute && request.status === 'Approved' && (
                <ActionButtons>
                    <Button onClick={() => onExecute(request.requestId)}>
                        Execute Transfer
                    </Button>
                </ActionButtons>
            )}
        </RequestCard>
    );
};

export default TransferRequest;
