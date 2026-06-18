const API_BASE_URL = "http://localhost:8000";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  age: number;
  created_at: string;
}

export interface PredictionHistoryItem {
  id: number;
  created_at: string;
  prediction: string;
  risk_level: string;
  glucose: number;
  probability: number;
  pregnancies: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree_function: number;
  age: number;
}

export interface UserProfileResponse extends User {
  predictions: PredictionHistoryItem[];
}

export interface PredictionRequest {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
}

export interface PredictionResponse {
  prediction: string;
  probability: number;
  risk_level: string;
  recommendations: string[];
}

export interface AdminPredictionItem extends PredictionHistoryItem {
  firstname: string;
  lastname: string;
}

export interface AdminStats {
  total_users: number;
  total_tests: number;
  positive_predictions: number;
  negative_predictions: number;
  model_accuracy: number;
  recent_predictions: AdminPredictionItem[];
}

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("diabcare_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = "An error occurred";
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // Fallback if not JSON
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

  async register(data: Omit<User, "id" | "created_at"> & { password: string }): Promise<User> {
    return this.request<User>("/api/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string): Promise<{ access_token: string; token_type: string; user_id: number }> {
    const res = await this.request<{ access_token: string; token_type: string; user_id: number }>("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("diabcare_token", res.access_token);
    localStorage.setItem("diabcare_user_id", res.user_id.toString());
    return res;
  }

  async getProfile(userId: number): Promise<UserProfileResponse> {
    const res = await this.request<UserProfileResponse>(`/api/profile/${userId}`);
    localStorage.setItem("diabcare_user", JSON.stringify(res));
    return res;
  }

  async predict(data: PredictionRequest): Promise<PredictionResponse> {
    return this.request<PredictionResponse>("/api/predict", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getAdminStats(): Promise<AdminStats> {
    return this.request<AdminStats>("/api/admin/stats");
  }

  logout() {
    localStorage.removeItem("diabcare_token");
    localStorage.removeItem("diabcare_user_id");
    localStorage.removeItem("diabcare_user");
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("diabcare_token");
  }

  getCurrentUserId(): number | null {
    const id = localStorage.getItem("diabcare_user_id");
    return id ? parseInt(id) : null;
  }

  getCurrentUserCached(): User | null {
    const user = localStorage.getItem("diabcare_user");
    return user ? JSON.parse(user) : null;
  }
}

export const api = new ApiClient();
