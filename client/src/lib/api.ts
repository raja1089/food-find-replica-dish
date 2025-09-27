// API service for Laravel backend integration
class ApiService {
  private baseURL: string;

  constructor() {
    // Set your Laravel backend URL here
    this.baseURL = process.env.REACT_APP_LARAVEL_API_URL || 'http://localhost:8000/api';
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    };

    // Add auth token if available
    const token = localStorage.getItem('chef_token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Chef Authentication APIs
  async sendOtp(phone: string) {
    return this.request('/send-otp', {
      method: 'POST',
      body: JSON.stringify({
        phone,
        user_type: 'cook'
      }),
    });
  }

  async verifyOtp(phone: string, otp: string) {
    return this.request('/verify-otp', {
      method: 'POST',
      body: JSON.stringify({
        phone,
        otp,
        user_type: 'cook'
      }),
    });
  }

  // Chef Dashboard APIs
  async getProfile() {
    return this.request('/cook/profile');
  }

  async getDashboard() {
    return this.request('/cook/analytics/' + this.getChefId());
  }

  async getDishes() {
    return this.request('/dishes');
  }

  async getOrders() {
    return this.request('/cook/orders/' + this.getChefId());
  }

  async addDish(dishData: any) {
    return this.request('/add-dishes', {
      method: 'POST',
      body: JSON.stringify(dishData),
    });
  }

  async updateDish(dishId: string, dishData: any) {
    return this.request(`/update-dish/${dishId}`, {
      method: 'PUT',
      body: JSON.stringify(dishData),
    });
  }

  async deleteDish(dishId: string) {
    return this.request(`/dishes/${dishId}`, {
      method: 'DELETE',
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  private getChefId(): string {
    try {
      const chefData = localStorage.getItem('chef_data');
      if (chefData) {
        const chef = JSON.parse(chefData);
        return chef.id || '1'; // Fallback to '1' if no ID found
      }
    } catch (error) {
      console.error('Error getting chef ID:', error);
    }
    return '1'; // Default fallback
  }
}

export const apiService = new ApiService();