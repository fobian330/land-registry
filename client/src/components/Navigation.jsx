import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaPlus, FaExchangeAlt, FaUserCircle } from 'react-icons/fa';

const Nav = styled.nav`
    background: ${props => props.theme.colors.navy};
    padding: ${props => props.theme.spacing.md};
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
`;

const NavContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled(Link)`
    color: ${props => props.theme.colors.white};
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};

    &:hover {
        color: ${props => props.theme.colors.peach};
    }
`;

const NavLinks = styled.div`
    display: flex;
    gap: ${props => props.theme.spacing.lg};
`;

const NavLink = styled(Link)`
    color: ${props => props.theme.colors.white};
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.xs};
    padding: ${props => props.theme.spacing.sm};
    border-radius: ${props => props.theme.borderRadius.small};
    transition: all 0.2s ease;

    &:hover, &.active {
        background: rgba(255, 255, 255, 0.1);
        color: ${props => props.theme.colors.peach};
    }
`;

const ConnectButton = styled.button`
    background: ${props => props.theme.colors.green};
    color: ${props => props.theme.colors.white};
    border: none;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.small};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: ${props => props.theme.colors.blue};
        transform: translateY(-2px);
    }
`;

const Navigation = ({ account, onConnect }) => {
    const location = useLocation();

    return (
        <Nav>
            <NavContainer>
                <Logo to="/">
                    <FaHome /> Land Registry
                </Logo>

                <NavLinks>
                    <NavLink 
                        to="/properties" 
                        className={location.pathname === '/properties' ? 'active' : ''}
                    >
                        <FaHome /> Properties
                    </NavLink>
                    <NavLink 
                        to="/register" 
                        className={location.pathname === '/register' ? 'active' : ''}
                    >
                        <FaPlus /> Register
                    </NavLink>
                    <NavLink 
                        to="/transfers" 
                        className={location.pathname === '/transfers' ? 'active' : ''}
                    >
                        <FaExchangeAlt /> Transfers
                    </NavLink>
                    <NavLink 
                        to="/profile" 
                        className={location.pathname === '/profile' ? 'active' : ''}
                    >
                        <FaUserCircle /> Profile
                    </NavLink>
                </NavLinks>

                {account ? (
                    <div style={{ color: props => props.theme.colors.white }}>
                        {`${account.slice(0, 6)}...${account.slice(-4)}`}
                    </div>
                ) : (
                    <ConnectButton onClick={onConnect}>
                        Connect Wallet
                    </ConnectButton>
                )}
            </NavContainer>
        </Nav>
    );
};

export default Navigation;
