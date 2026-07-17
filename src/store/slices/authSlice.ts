import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { userAPI } from "../../api/axios";
import toast from "react-hot-toast";

export interface Address {
  _id: string;
  title: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  isVerified: boolean;
  status: string;
  addresses: Address[];
}

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
    brand: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  shippingAddress: {
    title: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  subtotal: number;
  discount: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "cod" | "online";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  deliveryFee?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("userToken"),
  loading: true,
};

// Thunks
export const initAuth = createAsyncThunk(
  "auth/initAuth",
  async (_, { rejectWithValue }) => {
    const savedToken = localStorage.getItem("userToken");
    if (!savedToken) {
      return rejectWithValue("No token found");
    }
    try {
      const { data } = await userAPI.get("/profile");
      if (data.success) {
        return { token: savedToken, user: data.result };
      }
      localStorage.removeItem("userToken");
      return rejectWithValue("Invalid token");
    } catch (error) {
      localStorage.removeItem("userToken");
      return rejectWithValue("Token validation failed");
    }
  }
);

export const refreshProfile = createAsyncThunk(
  "auth/refreshProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.get("/profile");
      if (data.success) {
        return data.result;
      }
      return rejectWithValue("Failed to fetch profile");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to refresh profile");
    }
  }
);

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (email: string, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.post("/auth/send-otp", { email });
      if (data.success) {
        toast.success(data.message || "OTP sent successfully! 📧");
        return true;
      }
      toast.error(data.message || "Failed to send OTP");
      return false;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to send OTP";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.post("/auth/verify-otp", { email, otp });
      if (data.success) {
        localStorage.setItem("userToken", data.token);
        toast.success("Successfully logged in! 🎉");
        return { token: data.token, user: data.result };
      }
      toast.error(data.message || "Invalid OTP code");
      return rejectWithValue(data.message || "Invalid OTP code");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Invalid or expired OTP";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (idToken: string, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.post("/auth/google", { idToken });
      if (data.success) {
        localStorage.setItem("userToken", data.token);
        toast.success("Successfully signed in with Google! 🚀");
        return { token: data.token, user: data.result };
      }
      toast.error(data.message || "Google sign-in failed");
      return rejectWithValue(data.message || "Google sign-in failed");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Google sign-in failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    { name, phone, profileImage }: { name: string; phone: string; profileImage?: File | null },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const { data } = await userAPI.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success("Profile updated successfully! ✨");
        return data.result;
      }
      toast.error(data.message || "Profile update failed");
      return rejectWithValue(data.message || "Profile update failed");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update profile";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const addAddress = createAsyncThunk(
  "auth/addAddress",
  async (address: Omit<Address, "_id">, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await userAPI.post("/address", address);
      if (data.success) {
        await dispatch(refreshProfile());
        toast.success("Address added successfully! 📍");
        return true;
      }
      toast.error(data.message || "Failed to add address");
      return false;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to add address";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "auth/updateAddress",
  async (
    { addressId, address }: { addressId: string; address: Partial<Address> },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { data } = await userAPI.put(`/address/${addressId}`, address);
      if (data.success) {
        await dispatch(refreshProfile());
        toast.success("Address updated successfully! ✏️");
        return true;
      }
      toast.error(data.message || "Failed to update address");
      return false;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update address";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "auth/deleteAddress",
  async (addressId: string, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await userAPI.delete(`/address/${addressId}`);
      if (data.success) {
        await dispatch(refreshProfile());
        toast.success("Address deleted successfully!");
        return true;
      }
      toast.error(data.message || "Failed to delete address");
      return false;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to delete address";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userToken");
      state.token = null;
      state.user = null;
      state.loading = false;
      toast.success("Logged out successfully");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initAuth.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(initAuth.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
      })
      .addCase(refreshProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(verifyOTP.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(googleLogin.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
