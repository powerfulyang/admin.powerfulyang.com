import { init } from '@sentry/react';
import { UseRequest } from '@powerfulyang/hooks';
import { __prod__ } from '@powerfulyang/utils';

init({ dsn: 'https://14bbeb7213424d60a25820cab31f0d3a@o417744.ingest.sentry.io/5319055' });

UseRequest.baseUrl = (__prod__ && 'https://api.powerfulyang.com/api') || '/api';
