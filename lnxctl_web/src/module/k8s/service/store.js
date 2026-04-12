import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  service: {},
  services: [],
  serviceDetailVisible: false,
  serviceYamlVisible: false,
  serviceTableLoading: false,
};

const serviceSlice = createSlice({
  name: 'k8sService',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setService: (state, action) => {state.service = action.payload;},
    setServices: (state, action) => {state.services = action.payload;},
    setServiceDetailVisible: (state, action) => {state.serviceDetailVisible = action.payload;},
    setServiceYamlVisible: (state, action) => {state.serviceYamlVisible = action.payload;},
    setServiceTableLoading: (state, action) => {state.serviceTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sService.context;
const getService = (state) => state.k8sService.service;
const getServices = (state) => state.k8sService.services;
const getServiceDetailVisible = (state) => state.k8sService.serviceDetailVisible;
const getServiceYamlVisible = (state) => state.k8sService.serviceYamlVisible;
const getServiceTableLoading = (state) => state.k8sService.serviceTableLoading;

const {setContext} = serviceSlice.actions;
const {setService} = serviceSlice.actions;
const {setServices} = serviceSlice.actions;
const {setServiceDetailVisible} = serviceSlice.actions;
const {setServiceYamlVisible} = serviceSlice.actions;
const {setServiceTableLoading} = serviceSlice.actions;

const store = {
  serviceSlice,
  getContext,
  getService,
  getServices,
  getServiceDetailVisible,
  getServiceYamlVisible,
  getServiceTableLoading,
  setContext,
  setService,
  setServices,
  setServiceDetailVisible,
  setServiceYamlVisible,
  setServiceTableLoading,
};

export default store;
