import React from 'react';
import { useEffectOnce } from '@powerfulyang/hooks';
import request from '@/utils/request';

const CsrfLayout: React.FC = ({ children }) => {
  useEffectOnce(() => {
    request('/public/hello').then();
  });
  return <>{children}</>;
};

export default CsrfLayout;
