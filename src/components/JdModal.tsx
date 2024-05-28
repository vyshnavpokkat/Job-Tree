import React, { useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { ModalContext } from './JobCard';
import jobData from '../Jobs/dummyData';
import { useNavigate } from 'react-router';

interface ModalContentProps {
  showJd: { modal: boolean; jobId: number };
}

export const ModalContent: React.FC<ModalContentProps> = ({ showJd }) => {

  const context = useContext(ModalContext);
  const navigate = useNavigate()

  if (!context) {
    return null;
  }

  const { setShowJd } = context;
  const handleClose = () => setShowJd({ modal: false, jobId: 0 });

  const job = jobData.find(item => item.jobId === showJd.jobId);

  return (
    <Modal
      show={showJd.modal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="staticBackdropLabel">{job?.jobTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex align-items-center'>
          <img src={job?.logo} alt={`${job?.companyName} logo`} className="mr-3" style={{ width: '80px' }} />
          <h5 style={{ color: "#344C64" }}><strong>{job?.companyName}</strong></h5>
        </div>
        <p><strong>Experience Required:</strong> {job?.experienceRequired} years</p>
        <p><strong>Skills Required:</strong> {job?.skillsRequired.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}</p>
        <p>{job?.jobDescription}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={() => navigate(`/form/${job?.jobId}`)}>Apply</Button>
      </Modal.Footer>
    </Modal>
  );
};
