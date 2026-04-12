import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  configmap: {},
  configmaps: [],
  configmapDetailVisible: false,
  configmapYamlVisible: false,
  configmapTableLoading: false,
};

const configmapSlice = createSlice({
  name: 'k8sConfigmap',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setConfigmap: (state, action) => {state.configmap = action.payload;},
    setConfigmaps: (state, action) => {state.configmaps = action.payload;},
    setConfigmapDetailVisible: (state, action) => {state.configmapDetailVisible = action.payload;},
    setConfigmapYamlVisible: (state, action) => {state.configmapYamlVisible = action.payload;},
    setConfigmapTableLoading: (state, action) => {state.configmapTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sConfigmap.context;
const getConfigmap = (state) => state.k8sConfigmap.configmap;
const getConfigmaps = (state) => state.k8sConfigmap.configmaps;
const getConfigmapDetailVisible = (state) => state.k8sConfigmap.configmapDetailVisible;
const getConfigmapYamlVisible = (state) => state.k8sConfigmap.configmapYamlVisible;
const getConfigmapTableLoading = (state) => state.k8sConfigmap.configmapTableLoading;

const {setContext} = configmapSlice.actions;
const {setConfigmap} = configmapSlice.actions;
const {setConfigmaps} = configmapSlice.actions;
const {setConfigmapDetailVisible} = configmapSlice.actions;
const {setConfigmapYamlVisible} = configmapSlice.actions;
const {setConfigmapTableLoading} = configmapSlice.actions;

const store = {
  configmapSlice,
  getContext,
  getConfigmap,
  getConfigmaps,
  getConfigmapDetailVisible,
  getConfigmapYamlVisible,
  getConfigmapTableLoading,
  setContext,
  setConfigmap,
  setConfigmaps,
  setConfigmapDetailVisible,
  setConfigmapYamlVisible,
  setConfigmapTableLoading,
};

export default store;
