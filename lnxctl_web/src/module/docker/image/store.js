import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  image: {},
  images: [],
  imageDetailVisible: false,
  imageJsonVisible: false,
  imageTableLoading: false,
};

const imageSlice = createSlice({
  name: 'dockerImage',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setImage: (state, action) => {state.image = action.payload;},
    setImages: (state, action) => {state.images = action.payload;},
    setImageDetailVisible: (state, action) => {state.imageDetailVisible = action.payload;},
    setImageJsonVisible: (state, action) => {state.imageJsonVisible = action.payload;},
    setImageTableLoading: (state, action) => {state.imageTableLoading = action.payload;},
  },
});

const getContext = (state) => state.dockerImage.context;
const getImage = (state) => state.dockerImage.image;
const getImages = (state) => state.dockerImage.images;
const getImageDetailVisible = (state) => state.dockerImage.imageDetailVisible;
const getImageJsonVisible = (state) => state.dockerImage.imageJsonVisible;
const getImageTableLoading = (state) => state.dockerImage.imageTableLoading;

const {setContext} = imageSlice.actions;
const {setImage} = imageSlice.actions;
const {setImages} = imageSlice.actions;
const {setImageDetailVisible} = imageSlice.actions;
const {setImageJsonVisible} = imageSlice.actions;
const {setImageTableLoading} = imageSlice.actions;

const store = {
  imageSlice,
  getContext,
  getImage,
  getImages,
  getImageDetailVisible,
  getImageJsonVisible,
  getImageTableLoading,
  setContext,
  setImage,
  setImages,
  setImageDetailVisible,
  setImageJsonVisible,
  setImageTableLoading,
};

export default store;
