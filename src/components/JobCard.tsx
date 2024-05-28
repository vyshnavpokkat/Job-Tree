import React, { useState, createContext, Dispatch, SetStateAction, useEffect } from 'react';
import { ModalContent } from './JdModal';
import jobData from '../Jobs/dummyData';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { SuccessModal } from './SuccessModal';
import AsyncSelect from 'react-select/async';

interface ModalContextType {
  setShowJd: Dispatch<SetStateAction<{ modal: boolean, jobId: number }>>;
  setShowSuccessModal: Dispatch<SetStateAction<{ modal: boolean, jobId: number }>>;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export const JobCard: React.FC = () => {

  const navigate = useNavigate();
  const appliedJobs = useSelector((state: any) => state.job.jobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(jobData);

  useEffect(() => {
    const filtered = jobData.filter(item => {
      return (
        item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredJobs(filtered);
  }, [searchTerm]);

  const handleSearch = (inputValue: string) => {
    setSearchTerm(inputValue);
  };

  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption) {
      setSearchTerm(selectedOption.value);
    }
  };

  const handleJobCardClick = (jobId: number, applied: boolean) => {
    if (applied) {
      setShowSuccessModal({ modal: true, jobId });
    } else {
      setShowJd({ modal: true, jobId });
    }
  };

  const AppliedjobIds = appliedJobs.map((job: any) => job.jobId);

  const loadOptions = (inputValue: any, callback: any) => {
    setTimeout(() => {
      const filteredOptions = jobData.filter(job =>
        job.jobTitle.toLowerCase().includes(inputValue.toLowerCase())
      ).map(job => ({ value: job.jobTitle, label: job.jobTitle }));
      callback(filteredOptions);
    }, 500);
  };

  const [showJd, setShowJd] = useState({ modal: false, jobId: 0 });
  const [showSuccessModal, setShowSuccessModal] = useState({ modal: false, jobId: 0 });


  return (
    <ModalContext.Provider value={{ setShowJd, setShowSuccessModal }}>
      <div className="container pb-5">
        <div className="col-12 py-3 w-75 mx-auto">
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            onInputChange={handleSearch}
            onChange={handleSelectChange}
            className="py-2"
            placeholder="Search your job here..."
            value={searchTerm ? { label: searchTerm, value: searchTerm } : null}
          />
        </div>
        {filteredJobs.length > 0 ? (
          filteredJobs.map(item => (
            <div key={item.jobId} className="card mb-2 card-body-sub">
              <div className="card-body pr-0 d-flex justify-content-between align-items-center">
                <div
                  className="w-100 cursor-pointer row"
                  onClick={() => handleJobCardClick(item.jobId, AppliedjobIds.includes(item.jobId))}
                >
                  <div className='d-flex flex-column flex-md-row align-items-center col-12 col-md-10'>
                    <img
                      src={item.logo}
                      alt={`${item.companyName} logo`}
                      className="mr-0 mr-md-3 mb-3 mb-md-0 d-none d-md-block"
                      style={{ width: '60px' }}
                    />
                    <div className='px-3 px-md-4 text-left'>
                      <h5 className="card-title">
                        {item.jobTitle}
                        {AppliedjobIds.includes(item.jobId) && <span className='success-badge-2 ml-2'>APPLIED</span>}
                      </h5>
                      <p className="card-text">{item.companyName}</p>
                    </div>
                  </div>
                </div>
                <div className="px-3 col-5 col-md-2 card-separator">
                  {AppliedjobIds.includes(item.jobId) ? (
                    <button className="btn btn-success w-100" onClick={() => handleJobCardClick(item.jobId, true)}>APPLIED</button>
                  ) : (
                    <button className="btn btn-secondary w-100" onClick={() => navigate(`/form/${item.jobId}`)}>APPLY</button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-4 d-flex align-items-center justify-content-center" style={{height:'60vh'}}>
            <h5>No data found</h5>
          </div>
        )}
      </div>
      <ModalContent showJd={showJd} />
      <SuccessModal showSuccessModal={showSuccessModal} />
    </ModalContext.Provider>
  );
};

export default JobCard;
