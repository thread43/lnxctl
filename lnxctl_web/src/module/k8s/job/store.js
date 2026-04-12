import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  job: {},
  jobs: [],
  jobDetailVisible: false,
  jobYamlVisible: false,
  jobTableLoading: false,
};

const jobSlice = createSlice({
  name: 'k8sJob',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setJob: (state, action) => {state.job = action.payload;},
    setJobs: (state, action) => {state.jobs = action.payload;},
    setJobDetailVisible: (state, action) => {state.jobDetailVisible = action.payload;},
    setJobYamlVisible: (state, action) => {state.jobYamlVisible = action.payload;},
    setJobTableLoading: (state, action) => {state.jobTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sJob.context;
const getJob = (state) => state.k8sJob.job;
const getJobs = (state) => state.k8sJob.jobs;
const getJobDetailVisible = (state) => state.k8sJob.jobDetailVisible;
const getJobYamlVisible = (state) => state.k8sJob.jobYamlVisible;
const getJobTableLoading = (state) => state.k8sJob.jobTableLoading;

const {setContext} = jobSlice.actions;
const {setJob} = jobSlice.actions;
const {setJobs} = jobSlice.actions;
const {setJobDetailVisible} = jobSlice.actions;
const {setJobYamlVisible} = jobSlice.actions;
const {setJobTableLoading} = jobSlice.actions;

const store = {
  jobSlice,
  getContext,
  getJob,
  getJobs,
  getJobDetailVisible,
  getJobYamlVisible,
  getJobTableLoading,
  setContext,
  setJob,
  setJobs,
  setJobDetailVisible,
  setJobYamlVisible,
  setJobTableLoading,
};

export default store;
