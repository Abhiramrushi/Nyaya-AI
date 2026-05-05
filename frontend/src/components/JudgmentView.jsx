import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getJudgmentDetail, verifyJudgment } from '../api';

const JudgmentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [judgment, setJudgment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const data = await getJudgmentDetail(id);
      setJudgment(data);
    } catch (error) {
      console.error('Failed to fetch detail', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (status) => {
    setVerifying(true);
    try {
      await verifyJudgment(id, status, 'Current Officer'); // Hardcoded user for demo
      await fetchDetail();
    } catch (error) {
      console.error('Verification failed', error);
      alert('Verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!judgment) return <div>Judgment not found.</div>;

  return (
    <div>
      <Link to="/" className="btn" style={{ marginBottom: '2rem', padding: 0 }}>
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>{judgment.case_title || judgment.filename}</h1>
          <p>{judgment.court_name} | {judgment.judgment_date}</p>
        </div>
        <div>
          <span className={`badge badge-${judgment.risk_level?.toLowerCase() || 'low'}`} style={{ marginRight: '1rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            <AlertTriangle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Risk: {judgment.risk_level}
          </span>
          <span className="badge" style={{ backgroundColor: judgment.status === 'Verified' ? 'var(--success-color)' : 'var(--surface-border)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            Status: {judgment.status}
          </span>
        </div>
      </div>

      <div className="split-view">
        {/* Left Side: Extracted Text / Document View */}
        <div className="glass-panel">
          <h2>Document Text</h2>
          <div className="pdf-viewer">
            {judgment.extracted_text || 'No text extracted.'}
          </div>
        </div>

        {/* Right Side: AI Insights & Verification */}
        <div className="glass-panel" style={{ overflowY: 'auto', maxHeight: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
            <ShieldCheck size={24} color="var(--accent-color)" />
            <h2 style={{ margin: 0 }}>AI Decision Intelligence</h2>
          </div>

          <div className="insight-section">
            <h3>Directives & Deadlines</h3>
            {judgment.deadlines && judgment.deadlines.length > 0 ? (
              <ul style={{ listStyleType: 'none' }}>
                {judgment.deadlines.map((d, i) => (
                  <li key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '0.5rem', borderLeft: d.is_urgent ? '4px solid var(--danger-color)' : '4px solid var(--accent-color)' }}>
                    <strong>{d.task}</strong>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      Deadline: {d.deadline_date}
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p>No specific deadlines found.</p>}
          </div>

          <div className="insight-section">
            <h3>Responsible Authorities</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {judgment.responsible_authorities?.map((auth, i) => (
                <span key={i} style={{ background: 'var(--surface-border)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                  {auth}
                </span>
              ))}
            </div>
          </div>

          <div className="insight-section">
            <h3>Recommended Actions & Reasoning</h3>
            {judgment.explainable_reasoning && judgment.explainable_reasoning.length > 0 ? (
              <ul style={{ listStyleType: 'none' }}>
                {judgment.explainable_reasoning.map((r, i) => (
                  <li key={i} style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <strong>Action: {r.recommendation}</strong>
                    <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Reason: {r.reason}</p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: '0.5rem' }}>
                      "{r.source_quote}"
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p>No recommendations available.</p>}
          </div>

          {/* Human in the Loop Verification */}
          <div className="action-bar">
            {judgment.status !== 'Verified' ? (
              <>
                <button onClick={() => handleVerify('Verified')} className="btn btn-success" disabled={verifying}>
                  <CheckCircle size={18} /> Approve AI Assessment
                </button>
                <button onClick={() => handleVerify('Rejected')} className="btn btn-danger" disabled={verifying}>
                  <XCircle size={18} /> Reject
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)' }}>
                <CheckCircle size={24} />
                <strong>Verified by {judgment.verified_by}</strong>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default JudgmentView;
