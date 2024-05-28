import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AsyncSelect from 'react-select/async';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import jobData from '../Jobs/dummyData';
import { skills } from '../Jobs/skills';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { jobapplication } from '../reducers/jobReducer';

const loadOptions = (inputValue: string, callback: (options: any) => void) => {
    setTimeout(() => {
        const filteredOptions = skills.filter((skill: any) =>
            skill.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
    }, 1000);
};

const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    aboutMe: Yup.string().required('About Me is required'),
    skills: Yup.array().min(1, 'At least one skill is required').required('Skills are required'),
});


const FormData: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedJob, setSelectedJob] = useState<any>(null);
    const reactQuillRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (id) {
            const filteredJob = jobData.find(job => job.jobId === parseInt(id));
            setSelectedJob(filteredJob);
        }
    }, [id]);

    if (!selectedJob) {
        return <div>No data found...</div>;
    }

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        aboutMe: '',
        skills: [],
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        const applicationData = {
            jobId: selectedJob.jobId,
            jobTitle: selectedJob.jobTitle,
            companyName: selectedJob.companyName,
            logo: selectedJob.logo,
            experienceRequired: selectedJob.experienceRequired,
            skillsRequired: selectedJob.skillsRequired,
            jobDescription: selectedJob.jobDescription,
            applicantDetails: values,
        };
        dispatch(jobapplication(applicationData));
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            navigate('/');
        }, 2000);
    };

    return (
        <div className='container-fluide card-body-main-2' >
            <Container>
                <Row className="justify-content-center pt-3">
                    <Col lg={5} className="form-col">
                        <div className="p-3 bg-light border rounded">
                            <h5 className="text-center mb-1">Apply for</h5>
                            <h4 className="text-center mb-1" style={{ color: "rgb(5, 22, 48)" }}>{selectedJob.jobTitle}</h4>
                            <h6 className="text-center mb-1" style={{ color: "rgb(67 62 86)" }}>{selectedJob.companyName}</h6>
                            <hr />
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ touched, errors, setFieldValue, values }) => (
                                    <FormikForm>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group controlId="firstName">
                                                    <Form.Label>First Name</Form.Label>
                                                    <Field
                                                        type="text"
                                                        name="firstName"
                                                        className={`form-control ${touched.firstName && errors.firstName ? 'is-invalid' : ''}`}
                                                        placeholder="Enter your first name"
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="firstName"
                                                        className="invalid-feedback"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group controlId="lastName">
                                                    <Form.Label>Last Name</Form.Label>
                                                    <Field
                                                        type="text"
                                                        name="lastName"
                                                        className={`form-control ${touched.lastName && errors.lastName ? 'is-invalid' : ''}`}
                                                        placeholder="Enter your last name"
                                                    />
                                                    <ErrorMessage
                                                        component="div"
                                                        name="lastName"
                                                        className="invalid-feedback"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <Field
                                                type="email"
                                                name="email"
                                                className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                                                placeholder="Enter your email"
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="email"
                                                className="invalid-feedback"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="skills">
                                            <Form.Label>Skills</Form.Label>
                                            <AsyncSelect
                                                cacheOptions
                                                loadOptions={loadOptions}
                                                defaultOptions={skills}
                                                isMulti
                                                onChange={(selectedOptions: any) =>
                                                    setFieldValue('skills', selectedOptions)
                                                }
                                                className={`react-select-container ${touched.skills && errors.skills ? 'is-invalid' : ''}`}
                                                classNamePrefix="react-select"
                                            />
                                            {touched.skills && errors.skills && (
                                                <div className="invalid-feedback d-block">{errors.skills}</div>
                                            )}
                                        </Form.Group>
                                        <Form.Group controlId="aboutMe">
                                            <Form.Label>About Me</Form.Label>
                                            <ReactQuill
                                                ref={reactQuillRef}
                                                value={values.aboutMe}
                                                onChange={(value: string) => setFieldValue('aboutMe', value)}
                                                className={`form-control ${touched.aboutMe && errors.aboutMe ? 'is-invalid' : ''}`}
                                            />
                                            <ErrorMessage
                                                component="div"
                                                name="aboutMe"
                                                className="invalid-feedback"
                                            />
                                        </Form.Group>
                                        {success ? (
                                            <Alert variant="success" className="mt-3">
                                                Application submitted successfully!
                                            </Alert>
                                        )
                                            :
                                            (
                                                <ButtonGroup className="mt-2 w-100">
                                                    <Button variant="warning" type="submit" disabled={loading}>
                                                        {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Submit Application'}
                                                    </Button>
                                                    <Button variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
                                                </ButtonGroup>
                                            )
                                        }

                                    </FormikForm>
                                )}
                            </Formik>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default FormData;
