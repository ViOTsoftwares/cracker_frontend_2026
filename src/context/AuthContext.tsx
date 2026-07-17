import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  logout as logoutAction,
  refreshProfile as refreshProfileAction,
  sendOTP as sendOTPAction,
  verifyOTP as verifyOTPAction,
  googleLogin as googleLoginAction,
  updateProfile as updateProfileAction,
  addAddress as addAddressAction,
  updateAddress as updateAddressAction,
  deleteAddress as deleteAddressAction,
} from "../store/slices/authSlice";
import type { Address, User, OrderItem, Order } from "../store/slices/authSlice";
import { userAPI } from "../api/axios";
import toast from "react-hot-toast";

export type { Address, User, OrderItem, Order };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const loading = useAppSelector((state) => state.auth.loading);

  const sendOTP = useCallback(async (email: string): Promise<boolean> => {
    const result = await dispatch(sendOTPAction(email));
    if (sendOTPAction.fulfilled.match(result)) {
      return !!result.payload;
    }
    return false;
  }, [dispatch]);

  const verifyOTP = useCallback(async (email: string, otp: string): Promise<boolean> => {
    const result = await dispatch(verifyOTPAction({ email, otp }));
    return verifyOTPAction.fulfilled.match(result);
  }, [dispatch]);

  const googleLogin = useCallback(async (idToken: string): Promise<boolean> => {
    const result = await dispatch(googleLoginAction(idToken));
    return googleLoginAction.fulfilled.match(result);
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    await dispatch(refreshProfileAction());
  }, [dispatch]);

  const updateProfile = useCallback(async (
    name: string,
    phone: string,
    profileImage?: File | null
  ): Promise<boolean> => {
    const result = await dispatch(updateProfileAction({ name, phone, profileImage }));
    return updateProfileAction.fulfilled.match(result);
  }, [dispatch]);

  const addAddress = useCallback(async (address: Omit<Address, "_id">): Promise<boolean> => {
    const result = await dispatch(addAddressAction(address));
    if (addAddressAction.fulfilled.match(result)) {
      return !!result.payload;
    }
    return false;
  }, [dispatch]);

  const updateAddress = useCallback(async (addressId: string, address: Partial<Address>): Promise<boolean> => {
    const result = await dispatch(updateAddressAction({ addressId, address }));
    if (updateAddressAction.fulfilled.match(result)) {
      return !!result.payload;
    }
    return false;
  }, [dispatch]);

  const deleteAddress = useCallback(async (addressId: string): Promise<boolean> => {
    const result = await dispatch(deleteAddressAction(addressId));
    if (deleteAddressAction.fulfilled.match(result)) {
      return !!result.payload;
    }
    return false;
  }, [dispatch]);

  const placeOrder = useCallback(async (orderData: {
    items: { product: string; quantity: number }[];
    shippingAddress: any;
    paymentMethod: string;
  }): Promise<any> => {
    try {
      const { data } = await userAPI.post("/orders", orderData);
      if (data.success) {
        toast.success("Order placed successfully! 🎆");
        return data.result;
      }
      toast.error(data.message || "Failed to place order");
      return null;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to place order";
      toast.error(msg);
      return null;
    }
  }, []);

  const fetchOrders = useCallback(async (): Promise<Order[]> => {
    try {
      const { data } = await userAPI.get("/orders");
      if (data.success) {
        return data.result;
      }
      return [];
    } catch (error: any) {
      console.error("fetchOrders error:", error);
      return [];
    }
  }, []);

  const fetchOrderDetails = useCallback(async (id: string): Promise<Order | null> => {
    try {
      const { data } = await userAPI.get(`/orders/${id}`);
      if (data.success) {
        return data.result;
      }
      return null;
    } catch (error: any) {
      console.error("fetchOrderDetails error:", error);
      return null;
    }
  }, []);

  return {
    user,
    token,
    loading,
    sendOTP,
    verifyOTP,
    googleLogin,
    logout,
    refreshProfile,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    placeOrder,
    fetchOrders,
    fetchOrderDetails,
  };
};
