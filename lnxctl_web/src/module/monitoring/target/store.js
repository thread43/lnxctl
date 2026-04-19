import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  target: {},
  targets: [],
  targetDetailVisible: false,
  targetFormAddVisible: false,
  targetFormUpdateVisible: false,
  targetTableLoading: false,
};

const targetSlice = createSlice({
  name: 'monitoringTarget',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setTarget: (state, action) => {state.target = action.payload;},
    setTargets: (state, action) => {state.targets = action.payload;},
    setTargetDetailVisible: (state, action) => {state.targetDetailVisible = action.payload;},
    setTargetFormAddVisible: (state, action) => {state.targetFormAddVisible = action.payload;},
    setTargetFormUpdateVisible: (state, action) => {state.targetFormUpdateVisible = action.payload;},
    setTargetTableLoading: (state, action) => {state.targetTableLoading = action.payload;},
  },
});

const getContext = (state) => state.monitoringTarget.context;
const getTarget = (state) => state.monitoringTarget.target;
const getTargets = (state) => state.monitoringTarget.targets;
const getTargetDetailVisible = (state) => state.monitoringTarget.targetDetailVisible;
const getTargetFormAddVisible = (state) => state.monitoringTarget.targetFormAddVisible;
const getTargetFormUpdateVisible = (state) => state.monitoringTarget.targetFormUpdateVisible;
const getTargetTableLoading = (state) => state.monitoringTarget.targetTableLoading;

const {setContext} = targetSlice.actions;
const {setTarget} = targetSlice.actions;
const {setTargets} = targetSlice.actions;
const {setTargetDetailVisible} = targetSlice.actions;
const {setTargetFormAddVisible} = targetSlice.actions;
const {setTargetFormUpdateVisible} = targetSlice.actions;
const {setTargetTableLoading} = targetSlice.actions;

const store = {
  targetSlice,
  getContext,
  getTarget,
  getTargets,
  getTargetDetailVisible,
  getTargetFormAddVisible,
  getTargetFormUpdateVisible,
  getTargetTableLoading,
  setContext,
  setTarget,
  setTargets,
  setTargetDetailVisible,
  setTargetFormAddVisible,
  setTargetFormUpdateVisible,
  setTargetTableLoading,
};

export default store;
