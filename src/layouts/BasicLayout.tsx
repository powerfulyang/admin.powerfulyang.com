import ProLayout, {
  BasicLayoutProps as ProLayoutProps,
  DefaultFooter,
  MenuDataItem,
  Settings,
} from '@ant-design/pro-layout';
import React from 'react';
import { connect, Dispatch, history, Link, useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { useRequest } from '@/hooks/useRequest';
import { HooksResponse } from '@/types/HooksResponse';
import { logo } from '../assets/images';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  return menuList.map((item) => {
    return {
      ...item,
      name: item.menuName,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
  });
};

export const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} Power by powerfulyang`}
    links={[
      {
        key: 'powerfulyang',
        title: `Styx's Home Page`,
        href: 'https://powerfulyang.com',
        blankTarget: true,
      },
      {
        key: 'Github',
        title: <GithubOutlined />,
        href: 'https://github.com/powerfulyang',
        blankTarget: true,
      },
      {
        key: 'Source Code',
        title: 'Source Code',
        href: 'https://github.com/powerfulyang/admin.powerfulyang.com',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { dispatch, children, settings } = props;
  /**
   * constructor
   */

  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const { formatMessage } = useIntl();

  const [, menus] = useRequest<HooksResponse<MenuDataItem[]>>('/menu/current');

  return (
    <>
      {menus?.data && (
        <ProLayout
          logo={logo}
          formatMessage={formatMessage}
          onCollapse={handleMenuCollapse}
          onMenuHeaderClick={() => history.push('/')}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl || !menuItemProps.path) {
              return defaultDom;
            }
            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          breadcrumbRender={(routers = []) => [
            {
              path: '/',
              breadcrumbName: formatMessage({ id: 'menu.home' }),
            },
            ...routers,
          ]}
          itemRender={(route, _params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          footerRender={() => defaultFooterDom}
          menuDataRender={() => menuDataRender(menus.data)}
          rightContentRender={() => <RightContent />}
          {...props}
          {...settings}
        >
          {children}
        </ProLayout>
      )}
    </>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
