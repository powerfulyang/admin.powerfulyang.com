import { Effect, Reducer } from 'umi';
import { stringify } from 'qs';
import request from '@/utils/request';

export interface CurrentUser {
  avatar?: string;
  nickname?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  id?: string;
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent({ payload }, { put }) {
      let url = '/user/current';
      if (payload.authorization) {
        url += `?${stringify(payload)}`;
      }
      const res = yield request(url);
      yield put({
        type: 'saveCurrentUser',
        payload: res?.data,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};

export default UserModel;
