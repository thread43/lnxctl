import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  serviceaccount: {},
  serviceaccounts: [],
  serviceaccountDetailVisible: false,
  serviceaccountYamlVisible: false,
  serviceaccountTableLoading: false,
};

const serviceaccountSlice = createSlice({
  name: 'k8sServiceaccount',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setServiceaccount: (state, action) => {state.serviceaccount = action.payload;},
    setServiceaccounts: (state, action) => {state.serviceaccounts = action.payload;},
    setServiceaccountDetailVisible: (state, action) => {state.serviceaccountDetailVisible = action.payload;},
    setServiceaccountYamlVisible: (state, action) => {state.serviceaccountYamlVisible = action.payload;},
    setServiceaccountTableLoading: (state, action) => {state.serviceaccountTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sServiceaccount.context;
const getServiceaccount = (state) => state.k8sServiceaccount.serviceaccount;
const getServiceaccounts = (state) => state.k8sServiceaccount.serviceaccounts;
const getServiceaccountDetailVisible = (state) => state.k8sServiceaccount.serviceaccountDetailVisible;
const getServiceaccountYamlVisible = (state) => state.k8sServiceaccount.serviceaccountYamlVisible;
const getServiceaccountTableLoading = (state) => state.k8sServiceaccount.serviceaccountTableLoading;

const {setContext} = serviceaccountSlice.actions;
const {setServiceaccount} = serviceaccountSlice.actions;
const {setServiceaccounts} = serviceaccountSlice.actions;
const {setServiceaccountDetailVisible} = serviceaccountSlice.actions;
const {setServiceaccountYamlVisible} = serviceaccountSlice.actions;
const {setServiceaccountTableLoading} = serviceaccountSlice.actions;

const store = {
  serviceaccountSlice,
  getContext,
  getServiceaccount,
  getServiceaccounts,
  getServiceaccountDetailVisible,
  getServiceaccountYamlVisible,
  getServiceaccountTableLoading,
  setContext,
  setServiceaccount,
  setServiceaccounts,
  setServiceaccountDetailVisible,
  setServiceaccountYamlVisible,
  setServiceaccountTableLoading,
};

export default store;
