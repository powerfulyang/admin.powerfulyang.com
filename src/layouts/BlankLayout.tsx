import React from 'react';
import { useEffectOnce } from '@powerfulyang/hooks';
import request from '@/utils/request';

const BlankLayout: React.FC = ({ children }) => {
  useEffectOnce(() => {
    request('/hello');
  });
  return <>{children}</>;
};

export default BlankLayout;
