const API_BASE_URL = 'http://127.0.0.1:8000/api/v1'

// Types based on backend schemas
export interface UserCreate {
  email: string
  name: string
  password: string
  remember_me: boolean
}

export interface UserLogin {
  email: string
  password: string
  remember_me: boolean
}

export interface UserResponse {
  id: string
  email: string
  name: string
  created_at: string
  updated_at?: string
  last_login?: string
}

export interface CompanyCreate {
  name: string
  greyt_hr_username: string
  greyt_hr_password: string
  description?: string
}

export interface CompanyUpdate {
  name?: string
  greyt_hr_username?: string
  greyt_hr_password?: string
  description?: string
}

export interface CompanyResponse {
  id: string
  name: string
  greyt_hr_username: string
  access_token?: string
  token_expiry?: string
  created_at: string
  updated_at?: string
}

export interface ImportEmployeesResponse {
  message: string
  company_name: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

class ApiService {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for cookie handling
      ...options,
    }

    // Debug: Log the request details
    console.log(`Debug: Making request to ${url}`)
    console.log(`Debug: Request options:`, defaultOptions)
    console.log(`Debug: Cookies in document:`, document.cookie)
    console.log(`Debug: All cookies available:`, document.cookie.split(';').map(c => c.trim()))
    
    // Check specifically for auth_data cookie
    const authDataCookie = document.cookie.split(';').find(c => c.trim().startsWith('auth_data='))
    console.log(`Debug: auth_data cookie found:`, authDataCookie)

    try {
      const response = await fetch(url, defaultOptions)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          error: errorData.detail || `HTTP error! status: ${response.status}`
        }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error occurred'
      }
    }
  }

  // Auth endpoints
  async register(userData: UserCreate): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(loginData: UserLogin): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    })
  }

  async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>('/auth/me')
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    })
  }

  // Company endpoints
  async createCompany(companyData: CompanyCreate): Promise<ApiResponse<CompanyResponse>> {
    return this.request<CompanyResponse>('/companies/', {
      method: 'POST',
      body: JSON.stringify(companyData),
    })
  }

  async getCompanies(): Promise<ApiResponse<CompanyResponse[]>> {
    return this.request<CompanyResponse[]>('/companies/')
  }

  async getCompany(companyName: string): Promise<ApiResponse<CompanyResponse>> {
    return this.request<CompanyResponse>(`/companies/${encodeURIComponent(companyName)}`)
  }

  async updateCompany(companyName: string, companyData: CompanyUpdate): Promise<ApiResponse<CompanyResponse>> {
    return this.request<CompanyResponse>(`/companies/${encodeURIComponent(companyName)}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    })
  }

  async importEmployees(companyName: string): Promise<ApiResponse<ImportEmployeesResponse>> {
    return this.request<ImportEmployeesResponse>(`/companies/${encodeURIComponent(companyName)}/import-employees`, {
      method: 'POST',
    })
  }

  async deleteCompany(companyName: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/companies/${encodeURIComponent(companyName)}`, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService() 