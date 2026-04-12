import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  service: {},
  services: [],
  serviceDetailVisible: false,
  serviceFormAddVisible: false,
  serviceFormUpdateVisible: false,
  serviceTerminalVisible: false,
  serviceTableLoading: false,
};

const serviceSlice = createSlice({
  name: 'linuxService',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setService: (state, action) => {state.service = action.payload;},
    setServices: (state, action) => {state.services = action.payload;},
    setServiceDetailVisible: (state, action) => {state.serviceDetailVisible = action.payload;},
    setServiceFormAddVisible: (state, action) => {state.serviceFormAddVisible = action.payload;},
    setServiceFormUpdateVisible: (state, action) => {state.serviceFormUpdateVisible = action.payload;},
    setServiceTerminalVisible: (state, action) => {state.serviceTerminalVisible = action.payload;},
    setServiceTableLoading: (state, action) => {state.serviceTableLoading = action.payload;},
  },
});

const getContext = (state) => state.linuxService.context;
const getService = (state) => state.linuxService.service;
const getServices = (state) => state.linuxService.services;
const getServiceDetailVisible = (state) => state.linuxService.serviceDetailVisible;
const getServiceFormAddVisible = (state) => state.linuxService.serviceFormAddVisible;
const getServiceFormUpdateVisible = (state) => state.linuxService.serviceFormUpdateVisible;
const getServiceTerminalVisible = (state) => state.linuxService.serviceTerminalVisible;
const getServiceTableLoading = (state) => state.linuxService.serviceTableLoading;

const {setContext} = serviceSlice.actions;
const {setService} = serviceSlice.actions;
const {setServices} = serviceSlice.actions;
const {setServiceDetailVisible} = serviceSlice.actions;
const {setServiceFormAddVisible} = serviceSlice.actions;
const {setServiceFormUpdateVisible} = serviceSlice.actions;
const {setServiceTerminalVisible} = serviceSlice.actions;
const {setServiceTableLoading} = serviceSlice.actions;

const store = {
  serviceSlice,
  getContext,
  getService,
  getServices,
  getServiceDetailVisible,
  getServiceFormAddVisible,
  getServiceFormUpdateVisible,
  getServiceTerminalVisible,
  getServiceTableLoading,
  setContext,
  setService,
  setServices,
  setServiceDetailVisible,
  setServiceFormAddVisible,
  setServiceFormUpdateVisible,
  setServiceTerminalVisible,
  setServiceTableLoading,
};

export default store;
