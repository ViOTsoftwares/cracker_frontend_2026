import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseAPI from "../../api/axios";

export interface Setting {
  _id: string;
  title: string;
  address: string;
  project: string;
  client: string;
  phone: string;
  email: string;
  logo: string;
  xlink?: string;
  linkedinlink?: string;
  instagramlink?: string;
  facebooklink?: string;
  deliveryFee?: number;
  deliveryFeeType?: string;
}

export interface SettingsState {
  settings: Setting;
  loading: boolean;
}

export const defaultSettings: Setting = {
  _id: "",
  title: "CrackersSiva",
  project: "CrackersSiva",
  client: "Siva",
  phone: "+91 98765 43210",
  email: "info@crackerssiva.com",
  address: "Sivakasi, Tamil Nadu",
  logo: "",
  deliveryFee: 0,
  deliveryFeeType: "free",
};

const initialState: SettingsState = {
  settings: defaultSettings,
  loading: true,
};

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await baseAPI.get("/settings");
      if (response.data && response.data.success) {
        return response.data.result;
      }
      return rejectWithValue("Failed to load settings data");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load site settings");
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default settingsSlice.reducer;
