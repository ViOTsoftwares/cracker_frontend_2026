import React, { createContext, useContext, useEffect, useState } from "react";
import { userAPI } from "../api/axios";
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

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  sendOTP: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  googleLogin: (idToken: string) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (name: string, phone: string, profileImage?: File | null) => Promise<boolean>;
  addAddress: (address: Omit<Address, "_id">) => Promise<boolean>;
  updateAddress: (addressId: string, address: Partial<Address>) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  placeOrder: (orderData: { items: { product: string; quantity: number }[]; shippingAddress: any; paymentMethod: string }) => Promise<any>;
  fetchOrders: () => Promise<Order[]>;
  fetchOrderDetails: (id: string) => Promise<Order | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load token and user profile on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("userToken");
      if (savedToken) {
        setToken(savedToken);
        try {
          const { data } = await userAPI.get("/profile");
          if (data.success) {
            setUser(data.result);
          } else {
            // Clean invalid token
            localStorage.removeItem("userToken");
            setToken(null);
          }
        } catch (error) {
          console.error("Failed to load user profile", error);
          localStorage.removeItem("userToken");
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const refreshProfile = async () => {
    try {
      const { data } = await userAPI.get("/profile");
      if (data.success) {
        setUser(data.result);
      }
    } catch (error) {
      console.error("Failed to refresh user profile", error);
    }
  };

  const sendOTP = async (email: string): Promise<boolean> => {
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
      return false;
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      const { data } = await userAPI.post("/auth/verify-otp", { email, otp });
      if (data.success) {
        localStorage.setItem("userToken", data.token);
        setToken(data.token);
        setUser(data.result);
        toast.success("Successfully logged in! 🎉");
        return true;
      }
      toast.error(data.message || "Invalid OTP code");
      return false;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Invalid or expired OTP";
      toast.error(msg);
      return false;
    }
  };

  const googleLogin = async (idToken: string): Promise<boolean> => {
    try {
      const { data } = await userAPI.post("/auth/google", { idToken });
      if (data.success) {
        localStorage.setItem("userToken", data.token);
        setToken(data.token);
        setUser(data.result);
        toast.success("Successfully signed in with Google! 🚀");
        return true;
      }
      toast.error(data.message || "Google sign-in failed");
      return false;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Google sign-in failed";
      toast.error(msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (name: string, phone: string, profileImage?: File | null): Promise<boolean> => {
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
        setUser(data.result);
        toast.success("Profile updated successfully! ✨");
        return true;
      }
      toast.error(data.message || "Profile update failed");
      return false;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update profile";
      toast.error(msg);
      return false;
    }
  };

  const addAddress = async (address: Omit<Address, "_id">): Promise<boolean> => {
    try {
      const { data } = await userAPI.post("/address", address);
      if (data.success) {
        await refreshProfile();
        toast.success("Address added successfully! 📍");
        return true;
      }
      toast.error(data.message || "Failed to add address");
      return false;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to add address";
      toast.error(msg);
      return false;
    }
  };

  const updateAddress = async (addressId: string, address: Partial<Address>): Promise<boolean> => {
    try {
      const { data } = await userAPI.put(`/address/${addressId}`, address);
      if (data.success) {
        await refreshProfile();
        toast.success("Address updated successfully! ✏️");
        return true;
      }
      toast.error(data.message || "Failed to update address");
      return false;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to update address";
      toast.error(msg);
      return false;
    }
  };

  const deleteAddress = async (addressId: string): Promise<boolean> => {
    try {
      const { data } = await userAPI.delete(`/address/${addressId}`);
      if (data.success) {
        await refreshProfile();
        toast.success("Address deleted successfully!");
        return true;
      }
      toast.error(data.message || "Failed to delete address");
      return false;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to delete address";
      toast.error(msg);
      return false;
    }
  };

  const placeOrder = async (orderData: { items: { product: string; quantity: number }[]; shippingAddress: any; paymentMethod: string }): Promise<any> => {
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
  };

  const fetchOrders = async (): Promise<Order[]> => {
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
  };

  const fetchOrderDetails = async (id: string): Promise<Order | null> => {
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
  };

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
