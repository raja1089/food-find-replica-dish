// API service for Laravel backend integration
class ApiService {
  private baseURL: string;

  constructor() {
    // Use local proxy endpoints that forward to Laravel backend
    this.baseURL = '/api';
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
      console.log('🔐 Adding Bearer token to request:', endpoint);
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    } else {
      console.log('⚠️ No token found in localStorage for request:', endpoint);
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

  // Chef Dashboard APIs - using proxy endpoints
  async getProfile() {
    return this.request('/chef/cook/profile');
  }

  async getDashboard() {
    return this.request('/chef/cook/analytics/' + this.getChefId());
  }

  async getDishes() {
    return this.request('/chef/dishes');
  }

  async getOrders() {
    return this.request('/chef/cook/orders/' + this.getChefId());
  }

  async addDish(dishData: any) {
    return this.request('/chef/add-dishes', {
      method: 'POST',
      body: JSON.stringify(dishData),
    });
  }

  async updateDish(dishId: string, dishData: any) {
    return this.request(`/chef/update-dish/${dishId}`, {
      method: 'PUT',
      body: JSON.stringify(dishData),
    });
  }

  async deleteDish(dishId: string) {
    return this.request(`/chef/dishes/${dishId}`, {
      method: 'DELETE',
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`/chef/orders/${orderId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  private getChefId(): string {
    try {
      const chefData = localStorage.getItem('chef_data');
      if (chefData) {
        const chef = JSON.parse(chefData);
        console.log('Chef data from localStorage:', chef);
        // Use cook_id first, then fallback to id
        const cookId = chef.cook_id || chef.id;
        console.log('Using cook_id:', cookId);
        return cookId ? String(cookId) : '1';
      }
    } catch (error) {
      console.error('Error getting chef ID:', error);
    }
    return '1'; // Default fallback
  }
}

export const apiService = new ApiService();