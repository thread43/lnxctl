import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  daemonset: {},
  daemonsets: [],
  daemonsetDetailVisible: false,
  daemonsetYamlVisible: false,
  daemonsetTableLoading: false,
};

const daemonsetSlice = createSlice({
  name: 'k8sDaemonset',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setDaemonset: (state, action) => {state.daemonset = action.payload;},
    setDaemonsets: (state, action) => {state.daemonsets = action.payload;},
    setDaemonsetDetailVisible: (state, action) => {state.daemonsetDetailVisible = action.payload;},
    setDaemonsetYamlVisible: (state, action) => {state.daemonsetYamlVisible = action.payload;},
    setDaemonsetTableLoading: (state, action) => {state.daemonsetTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sDaemonset.context;
const getDaemonset = (state) => state.k8sDaemonset.daemonset;
const getDaemonsets = (state) => state.k8sDaemonset.daemonsets;
const getDaemonsetDetailVisible = (state) => state.k8sDaemonset.daemonsetDetailVisible;
const getDaemonsetYamlVisible = (state) => state.k8sDaemonset.daemonsetYamlVisible;
const getDaemonsetTableLoading = (state) => state.k8sDaemonset.daemonsetTableLoading;

const {setContext} = daemonsetSlice.actions;
const {setDaemonset} = daemonsetSlice.actions;
const {setDaemonsets} = daemonsetSlice.actions;
const {setDaemonsetDetailVisible} = daemonsetSlice.actions;
const {setDaemonsetYamlVisible} = daemonsetSlice.actions;
const {setDaemonsetTableLoading} = daemonsetSlice.actions;

const store = {
  daemonsetSlice,
  getContext,
  getDaemonset,
  getDaemonsets,
  getDaemonsetDetailVisible,
  getDaemonsetYamlVisible,
  getDaemonsetTableLoading,
  setContext,
  setDaemonset,
  setDaemonsets,
  setDaemonsetDetailVisible,
  setDaemonsetYamlVisible,
  setDaemonsetTableLoading,
};

export default store;
