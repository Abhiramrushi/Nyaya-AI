import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getJudgments, uploadJudgment } from '../api';

const Dashboard = () => {
  const [judgments, setJudgments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchJudgments();
  }, []);

  const fetchJudgments = async () => {
    try {
      const data = await getJudgments();
      setJudgments(data);
    } catch (error) {
      console.error('Failed to fetch judgments', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      await uploadJudgment(file);
      await fetchJudgments();
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed. Ensure backend is running.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div className="file-upload" onClick={() => document.getElementById('fileInput').click()}>
          <input type="file" id="fileInput" accept=".pdf" onChange={handleFileUpload} />
          {uploading ? (
            <div>
              <div className="loader"></div>
              <p style={{ marginTop: '1rem' }}>Analyzing Judgment with AI...</p>
            </div>
          ) : (
            <div>
              <Upload size={48} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
              <h3>Upload Court Judgment</h3>
              <p>PDF documents only. AI will extract directives and evaluate risks.</p>
              <button className="btn btn-primary">Select File</button>
            </div>
          )}
        </div>
      </div>

      <h2>Recent Judgments</h2>
      
      {loading ? (
        <div className="loader"></div>
      ) : judgments.length === 0 ? (
        <p>No judgments processed yet.</p>
      ) : (
        <div className="dashboard-grid">
          {judgments.map((j) => (
            <Link to={`/judgment/${j.id}`} key={j.id} style={{ textDecoration: 'none' }}>
              <div className="glass-panel card-hover" style={{ height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className={`badge badge-${j.risk_level?.toLowerCase() || 'low'}`}>
                    Risk: {j.risk_level || 'N/A'}
                  </span>
                  <span className="badge" style={{ backgroundColor: j.status === 'Verified' ? 'var(--success-color)' : 'var(--surface-border)', color: 'white' }}>
                    {j.status}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  {j.case_title || j.filename}
                </h3>
                
                <p style={{ fontSize: '0.85rem' }}>
                  <Clock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  {j.judgment_date || 'Date unknown'}
                </p>
                <p style={{ fontSize: '0.85rem' }}>
                  {j.court_name || 'Court unknown'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
