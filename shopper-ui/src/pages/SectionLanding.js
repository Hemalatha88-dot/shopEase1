import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const SectionLanding = () => {
  const { storeId, sectionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        await api.post('/analytics/qr-scan', { store_id: storeId, section_id: sectionId });
      } catch (e) {}
      navigate(`/offers/${storeId}/section/${sectionId}`, { replace: true });
    };
    run();
  }, [storeId, sectionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">Loading section...</div>
  );
};

export default SectionLanding; 