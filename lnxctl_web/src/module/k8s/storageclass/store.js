import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  storageclass: {},
  storageclasses: [],
  storageclassDetailVisible: false,
  storageclassYamlVisible: false,
  storageclassTableLoading: false,
};

const storageclassSlice = createSlice({
  name: 'k8sStorageclass',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setStorageclass: (state, action) => {state.storageclass = action.payload;},
    setStorageclasses: (state, action) => {state.storageclasses = action.payload;},
    setStorageclassDetailVisible: (state, action) => {state.storageclassDetailVisible = action.payload;},
    setStorageclassYamlVisible: (state, action) => {state.storageclassYamlVisible = action.payload;},
    setStorageclassTableLoading: (state, action) => {state.storageclassTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sStorageclass.context;
const getStorageclass = (state) => state.k8sStorageclass.storageclass;
const getStorageclasses = (state) => state.k8sStorageclass.storageclasses;
const getStorageclassDetailVisible = (state) => state.k8sStorageclass.storageclassDetailVisible;
const getStorageclassYamlVisible = (state) => state.k8sStorageclass.storageclassYamlVisible;
const getStorageclassTableLoading = (state) => state.k8sStorageclass.storageclassTableLoading;

const {setContext} = storageclassSlice.actions;
const {setStorageclass} = storageclassSlice.actions;
const {setStorageclasses} = storageclassSlice.actions;
const {setStorageclassDetailVisible} = storageclassSlice.actions;
const {setStorageclassYamlVisible} = storageclassSlice.actions;
const {setStorageclassTableLoading} = storageclassSlice.actions;

const store = {
  storageclassSlice,
  getContext,
  getStorageclass,
  getStorageclasses,
  getStorageclassDetailVisible,
  getStorageclassYamlVisible,
  getStorageclassTableLoading,
  setContext,
  setStorageclass,
  setStorageclasses,
  setStorageclassDetailVisible,
  setStorageclassYamlVisible,
  setStorageclassTableLoading,
};

export default store;
