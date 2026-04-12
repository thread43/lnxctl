import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  cronjob: {},
  cronjobs: [],
  cronjobDetailVisible: false,
  cronjobYamlVisible: false,
  cronjobTableLoading: false,
};

const cronjobSlice = createSlice({
  name: 'k8sCronjob',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setCronjob: (state, action) => {state.cronjob = action.payload;},
    setCronjobs: (state, action) => {state.cronjobs = action.payload;},
    setCronjobDetailVisible: (state, action) => {state.cronjobDetailVisible = action.payload;},
    setCronjobYamlVisible: (state, action) => {state.cronjobYamlVisible = action.payload;},
    setCronjobTableLoading: (state, action) => {state.cronjobTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sCronjob.context;
const getCronjob = (state) => state.k8sCronjob.cronjob;
const getCronjobs = (state) => state.k8sCronjob.cronjobs;
const getCronjobDetailVisible = (state) => state.k8sCronjob.cronjobDetailVisible;
const getCronjobYamlVisible = (state) => state.k8sCronjob.cronjobYamlVisible;
const getCronjobTableLoading = (state) => state.k8sCronjob.cronjobTableLoading;

const {setContext} = cronjobSlice.actions;
const {setCronjob} = cronjobSlice.actions;
const {setCronjobs} = cronjobSlice.actions;
const {setCronjobDetailVisible} = cronjobSlice.actions;
const {setCronjobYamlVisible} = cronjobSlice.actions;
const {setCronjobTableLoading} = cronjobSlice.actions;

const store = {
  cronjobSlice,
  getContext,
  getCronjob,
  getCronjobs,
  getCronjobDetailVisible,
  getCronjobYamlVisible,
  getCronjobTableLoading,
  setContext,
  setCronjob,
  setCronjobs,
  setCronjobDetailVisible,
  setCronjobYamlVisible,
  setCronjobTableLoading,
};

export default store;
