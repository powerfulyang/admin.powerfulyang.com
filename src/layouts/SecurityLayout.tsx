import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { connect, ConnectProps, Redirect } from 'umi';
import { stringify } from 'querystring';
import { captureException } from '@sentry/react';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { getPageQuery } from '@/utils/utils';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    const query = getPageQuery();
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
        payload: query,
      });
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    captureException(error, { extra: errorInfo });
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    const isLogin = currentUser && currentUser.id;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
