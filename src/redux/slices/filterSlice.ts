import { FilterReduxState } from '@/types/index.ts';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



const initialState: FilterReduxState = {
  search: "",
  furnished: false,
  order: "default",
  parking: false,
  sort: "default",
  type: "all",
};


const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {

    resetFilter: () => {
      // state.search = initialState.search;
      // state.furnished = initialState.furnished;
      // state.order = initialState.order;
      // state.parking = initialState.parking;
      // state.sort = initialState.sort;
      // state.type = initialState.type;
      return initialState;
    },

    setFilters: (state, action: PayloadAction<FilterReduxState>) => {
      Object.assign(state, action.payload);
    },

    searchFilter: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    furnishedFilter: (state, action: PayloadAction<boolean>) => {
      state.furnished = action.payload;
    },

    parkingFilter: (state, action: PayloadAction<boolean>) => {
      state.parking = action.payload;
    },

    orderFilter: (state, action: PayloadAction<"default" | "asc" | "desc">) => {
      state.order = action.payload;
    },

    sortFilter: (state, action: PayloadAction<"default" | "createdAt" | "regularPrice">) => {
      state.sort = action.payload;
    },

    typeFilter: (state, action: PayloadAction<"all" | "rent" | "sale">) => {
      state.type = action.payload;
    },

  },
});

const filterReducer = filterSlice.reducer;

export const { resetFilter, setFilters, furnishedFilter, orderFilter, parkingFilter, searchFilter, sortFilter, typeFilter } = filterSlice.actions;

export default filterReducer;
