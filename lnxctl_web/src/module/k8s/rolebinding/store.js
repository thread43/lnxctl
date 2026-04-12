import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  rolebinding: {},
  rolebindings: [],
  rolebindingDetailVisible: false,
  rolebindingYamlVisible: false,
  rolebindingTableLoading: false,
};

const rolebindingSlice = createSlice({
  name: 'k8sRolebinding',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setRolebinding: (state, action) => {state.rolebinding = action.payload;},
    setRolebindings: (state, action) => {state.rolebindings = action.payload;},
    setRolebindingDetailVisible: (state, action) => {state.rolebindingDetailVisible = action.payload;},
    setRolebindingYamlVisible: (state, action) => {state.rolebindingYamlVisible = action.payload;},
    setRolebindingTableLoading: (state, action) => {state.rolebindingTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sRolebinding.context;
const getRolebinding = (state) => state.k8sRolebinding.rolebinding;
const getRolebindings = (state) => state.k8sRolebinding.rolebindings;
const getRolebindingDetailVisible = (state) => state.k8sRolebinding.rolebindingDetailVisible;
const getRolebindingYamlVisible = (state) => state.k8sRolebinding.rolebindingYamlVisible;
const getRolebindingTableLoading = (state) => state.k8sRolebinding.rolebindingTableLoading;

const {setContext} = rolebindingSlice.actions;
const {setRolebinding} = rolebindingSlice.actions;
const {setRolebindings} = rolebindingSlice.actions;
const {setRolebindingDetailVisible} = rolebindingSlice.actions;
const {setRolebindingYamlVisible} = rolebindingSlice.actions;
const {setRolebindingTableLoading} = rolebindingSlice.actions;

const store = {
  rolebindingSlice,
  getContext,
  getRolebinding,
  getRolebindings,
  getRolebindingDetailVisible,
  getRolebindingYamlVisible,
  getRolebindingTableLoading,
  setContext,
  setRolebinding,
  setRolebindings,
  setRolebindingDetailVisible,
  setRolebindingYamlVisible,
  setRolebindingTableLoading,
};

export default store;
