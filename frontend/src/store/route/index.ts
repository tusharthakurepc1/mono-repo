import { TRoutes } from "@/typings/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialValue: { route?: TRoutes; counter: number } = { counter: 0 };

export const routeSlice = createSlice({
  name: "route",
  initialState: initialValue,
  reducers: {
    setCurrentRoute: (state, action: PayloadAction<TRoutes>) => {
      if(state.counter === 0){
        state.route = action.payload;
        state.counter += 1;
      }
    },
  },
});

export const { setCurrentRoute } = routeSlice.actions;
export default routeSlice.reducer;
