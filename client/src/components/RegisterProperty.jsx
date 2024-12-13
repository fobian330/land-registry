import React, { useState } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { create } from 'ipfs-http-client';

const FormContainer = styled.div`
    max-width: 800px;
    margin: 2rem auto;
    padding: ${props => props.theme.spacing.xl};
    background: ${props => props.theme.colors.white};
    border-radius: ${props => props.theme.borderRadius.large};
    box-shadow: ${props => props.theme.shadows.large};
`;

const Title = styled.h2`
    color: ${props => props.theme.colors.navy};
    margin-bottom: ${props => props.theme.spacing.lg};
`;

const Form = styled.form`
    display: grid;
    gap: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.spacing.xs};
`;

const Label = styled.label`
    color: ${props => props.theme.colors.darkGray};
    font-weight: 500;
`;

const Input = styled.input`
    padding: ${props => props.theme.spacing.sm};
    border: 1px solid ${props => props.theme.colors.lightGray};
    border-radius: ${props => props.theme.borderRadius.small};
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.blue};
    }
`;

const TextArea = styled.textarea`
    padding: ${props => props.theme.spacing.sm};
    border: 1px solid ${props => props.theme.colors.lightGray};
    border-radius: ${props => props.theme.borderRadius.small};
    font-size: 1rem;
    min-height: 100px;
    resize: vertical;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.blue};
    }
`;

const ErrorMessage = styled.div`
    color: red;
    font-size: 0.875rem;
`;

const SubmitButton = styled.button`
    background: ${props => props.theme.colors.blue};
    color: ${props => props.theme.colors.white};
    padding: ${props => props.theme.spacing.md};
    border: none;
    border-radius: ${props => props.theme.borderRadius.small};
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: ${props => props.theme.colors.navy};
        transform: translateY(-2px);
    }

    &:disabled {
        background: ${props => props.theme.colors.lightGray};
        cursor: not-allowed;
    }
`;

const FileUpload = styled.div`
    border: 2px dashed ${props => props.theme.colors.lightGray};
    padding: ${props => props.theme.spacing.lg};
    text-align: center;
    border-radius: ${props => props.theme.borderRadius.medium};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${props => props.theme.colors.blue};
    }
`;

const RegisterProperty = ({ onRegister }) => {
    const [uploading, setUploading] = useState(false);
    const [ipfsHash, setIpfsHash] = useState('');

    const formik = useFormik({
        initialValues: {
            location: '',
            coordinates: '',
            area: '',
            value: '',
            description: '',
            documents: null
        },
        validationSchema: Yup.object({
            location: Yup.string().required('Location is required'),
            coordinates: Yup.string().required('Coordinates are required'),
            area: Yup.number().required('Area is required').positive('Area must be positive'),
            value: Yup.number().required('Value is required').positive('Value must be positive'),
            description: Yup.string().required('Description is required')
        }),
        onSubmit: async (values) => {
            if (!ipfsHash) {
                alert('Please upload property documents');
                return;
            }

            try {
                await onRegister({
                    ...values,
                    ipfsHash
                });
            } catch (error) {
                console.error('Error registering property:', error);
                alert('Error registering property. Please try again.');
            }
        }
    });

    const handleFileUpload = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
            const added = await ipfs.add(file);
            setIpfsHash(added.path);
        } catch (error) {
            console.error('Error uploading to IPFS:', error);
            alert('Error uploading file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <FormContainer>
            <Title>Register New Property</Title>
            <Form onSubmit={formik.handleSubmit}>
                <FormGroup>
                    <Label>Location</Label>
                    <Input
                        type="text"
                        name="location"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.location}
                    />
                    {formik.touched.location && formik.errors.location && (
                        <ErrorMessage>{formik.errors.location}</ErrorMessage>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label>Coordinates</Label>
                    <Input
                        type="text"
                        name="coordinates"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.coordinates}
                    />
                    {formik.touched.coordinates && formik.errors.coordinates && (
                        <ErrorMessage>{formik.errors.coordinates}</ErrorMessage>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label>Area (in square meters)</Label>
                    <Input
                        type="number"
                        name="area"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.area}
                    />
                    {formik.touched.area && formik.errors.area && (
                        <ErrorMessage>{formik.errors.area}</ErrorMessage>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label>Value (in ETH)</Label>
                    <Input
                        type="number"
                        name="value"
                        step="0.001"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.value}
                    />
                    {formik.touched.value && formik.errors.value && (
                        <ErrorMessage>{formik.errors.value}</ErrorMessage>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label>Description</Label>
                    <TextArea
                        name="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                    />
                    {formik.touched.description && formik.errors.description && (
                        <ErrorMessage>{formik.errors.description}</ErrorMessage>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label>Property Documents</Label>
                    <FileUpload>
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            id="document-upload"
                        />
                        <label htmlFor="document-upload">
                            {uploading ? 'Uploading...' : 
                             ipfsHash ? 'Documents Uploaded ✓' : 
                             'Click to upload documents'}
                        </label>
                    </FileUpload>
                </FormGroup>

                <SubmitButton 
                    type="submit" 
                    disabled={formik.isSubmitting || uploading}
                >
                    {formik.isSubmitting ? 'Registering...' : 'Register Property'}
                </SubmitButton>
            </Form>
        </FormContainer>
    );
};

export default RegisterProperty;
