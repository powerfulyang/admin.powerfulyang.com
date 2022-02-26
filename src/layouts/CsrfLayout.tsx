import React, { useEffect } from 'react';
import request from '@/utils/request';

const CsrfLayout: React.FC = ({ children }) => {
  useEffect(() => {
    request('/public/hello').then();
  },[]);
  return <>{children}</>;
};

export default CsrfLayout;
