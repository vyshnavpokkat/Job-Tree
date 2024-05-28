import React, { useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { ModalContext } from './JobCard';
import { useSelector } from 'react-redux';

interface ModalContentProps {
    showSuccessModal: { modal: boolean; jobId: number };
}
interface JobType {
    jobId: number;
    jobTitle: string;
    companyName: string;
    experienceRequired: number;
    skillsRequired: string[];
    jobDescription: string;
    logo: string;
    applicantDetails: {
        firstName: string;
        lastName:string;
        email: string;
    };
}

// internal styles for pdf layout
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 20,
        fontFamily: 'Helvetica',
    },
    header: {
        fontSize: 16,
        marginBottom: 5,
        marginTop: 25,
        textAlign: 'left',
        color: '#240750',
    },
    section: {
        margin: 2,
        padding: 15,
        flexGrow: 1,
        border: '1px solid #57A6A1',
    },
    title: {
        fontSize: 10,
        marginBottom: 3,
        color: '#577B8D',
    },
    text: {
        fontSize: 11,
        marginBottom: 13,
        color: '#344C64',
    },
    divider: {
        marginVertical: 8,
        borderBottomWidth: 0.3,
        borderBottomColor: '#240750',
    },
    job_title: {
        fontSize: 15,
        marginBottom: 2,
        color: '#344C64',
    },
    text_company: {
        fontSize: 12,
        marginBottom: 3,
        color: '#577B8D',
    },
    dFlex: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
});

// pdf content
const renderPdfToBlob = async (job: JobType, applicantSkills: string[]) => {
    const doc = (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <View style={styles.dFlex}>
                        <View>
                            <Text style={styles.job_title}>{job.jobTitle}</Text>
                            <Text style={styles.text_company}>{job.companyName}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <Text style={styles.title}>Name :</Text>
                    <Text style={styles.text}>{job.applicantDetails.firstName} {job.applicantDetails.lastName}</Text>
                    <Text style={styles.title}>Email :</Text>
                    <Text style={styles.text}>{job.applicantDetails.email}</Text>
                    <Text style={styles.title}>Skills:</Text>
                    <Text style={styles.text}>{applicantSkills.join(', ')}</Text>
                    <View style={styles.header}><Text>Job Details</Text></View>
                    <View style={styles.divider} />
                    <Text style={styles.title}>Experience Required:</Text>
                    <Text style={styles.text}>{job.experienceRequired} years</Text>
                    <Text style={styles.title}>Skills Required:</Text>
                    <Text style={styles.text}>{job.skillsRequired.join(', ')}</Text>
                    <Text style={styles.title}>Job Description:</Text>
                    <Text style={styles.text}>{job.jobDescription}</Text>
                </View>
            </Page>
        </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    return pdfBlob;
};


export const SuccessModal: React.FC<ModalContentProps> = ({ showSuccessModal }) => {
    const context = useContext(ModalContext);
    const appliedJobs = useSelector((state: any) => state.job.jobs);

    if (!context) {
        return null;
    }

    const { setShowSuccessModal } = context;
    const handleClose = () => setShowSuccessModal({ modal: false, jobId: 0 });

    // const handlePrint = () => {
    //     window.print();
    // };

    const handleDownload = async () => {
        if (job) {
            const applicantSkills = job.applicantDetails.skills.map((skill: any) => skill.label);
            const pdfBlob = await renderPdfToBlob(job, applicantSkills);
            saveAs(pdfBlob, `${job.jobTitle.replace(/ /g, '_')}_Details.pdf`);
        }
    };

    const job = appliedJobs.find((item: any) => item.jobId === showSuccessModal.jobId);

    return (
        <Modal
            show={showSuccessModal.modal}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="staticBackdropLabel">{job?.jobTitle}  <span className='success-badge'>APPLIED</span></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='d-flex align-items-center'>
                    <img src={job?.logo} alt={`${job?.companyName} logo`} className="mr-3" style={{ width: '80px' }} />
                    <h5 style={{ color: "#344C64" }}><strong>{job?.companyName}</strong></h5>
                </div>
                <p><strong>Experience Required:</strong> {job?.experienceRequired} years</p>
                <p><strong>Skills Required:</strong> {job?.skillsRequired.join(', ')}</p>
                <p>{job?.jobDescription}</p>
                <hr />
                <h5 style={{ color: "#344C64" }}><strong>Candidate Details</strong></h5>
                <p className='mb-0'><strong>Name : </strong>{job?.applicantDetails.firstName} {job?.applicantDetails.lastName}</p>
                <p><strong>Email : </strong>{job?.applicantDetails.email}</p>
                <p className='mb-0'>
                    <strong>Skills: </strong>
                    {job?.applicantDetails.skills.map((skill: any, index: number) => (
                        <span key={index} className="skill-tag">{skill.label}</span>
                    ))}
                </p>
                <hr/>
                <div dangerouslySetInnerHTML={{ __html: job?.applicantDetails.aboutMe }} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleDownload}>Download PDF</Button>
                {/* <Button variant="primary" onClick={handlePrint}>Print</Button> */}
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};
