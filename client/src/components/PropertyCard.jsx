import React from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaRuler, FaEthereum } from 'react-icons/fa';

const Card = styled.div`
    background: ${props => props.theme.colors.white};
    border-radius: ${props => props.theme.borderRadius.medium};
    box-shadow: ${props => props.theme.shadows.medium};
    padding: ${props => props.theme.spacing.lg};
    margin: ${props => props.theme.spacing.md} 0;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-4px);
    }
`;

const PropertyHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${props => props.theme.spacing.md};
`;

const PropertyTitle = styled.h3`
    color: ${props => props.theme.colors.navy};
    margin: 0;
`;

const StatusBadge = styled.span`
    background: ${props => {
        switch (props.status) {
            case 'Available':
                return props.theme.colors.green;
            case 'PendingTransfer':
                return props.theme.colors.orange;
            default:
                return props.theme.colors.darkGray;
        }
    }};
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.875rem;
`;

const PropertyInfo = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${props => props.theme.spacing.md};
    margin: ${props => props.theme.spacing.md} 0;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.xs};
    color: ${props => props.theme.colors.darkGray};
`;

const ActionButtons = styled.div`
    display: flex;
    gap: ${props => props.theme.spacing.sm};
    margin-top: ${props => props.theme.spacing.lg};
`;

const Button = styled.button`
    background: ${props => props.primary ? props.theme.colors.blue : props.theme.colors.white};
    color: ${props => props.primary ? props.theme.colors.white : props.theme.colors.blue};
    border: 1px solid ${props => props.theme.colors.blue};
    padding: 8px 16px;
    border-radius: ${props => props.theme.borderRadius.small};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${props => props.theme.shadows.small};
    }
`;

const PropertyCard = ({ property, onTransfer, onView }) => {
    const {
        location,
        area,
        value,
        status,
        isVerified,
    } = property;

    return (
        <Card>
            <PropertyHeader>
                <PropertyTitle>{location}</PropertyTitle>
                <StatusBadge status={status}>
                    {status}
                </StatusBadge>
            </PropertyHeader>

            <PropertyInfo>
                <InfoItem>
                    <FaMapMarkerAlt />
                    <span>{location}</span>
                </InfoItem>
                <InfoItem>
                    <FaRuler />
                    <span>{area} sq.m</span>
                </InfoItem>
                <InfoItem>
                    <FaEthereum />
                    <span>{value} ETH</span>
                </InfoItem>
            </PropertyInfo>

            {isVerified && (
                <div style={{ color: props => props.theme.colors.green }}>
                    ✓ Verified Property
                </div>
            )}

            <ActionButtons>
                <Button primary onClick={() => onView(property)}>
                    View Details
                </Button>
                {status === 'Available' && (
                    <Button onClick={() => onTransfer(property)}>
                        Transfer Property
                    </Button>
                )}
            </ActionButtons>
        </Card>
    );
};

export default PropertyCard;
