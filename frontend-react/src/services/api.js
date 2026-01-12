const API_BASE_URL = 'http://localhost:5000'

class ApiService {
  async fetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    
    const response = await fetch(url, { ...defaultOptions, ...options })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  // Roles API
  async getRoles() {
    return this.fetch('/api/roles')
  }

  async getRole(id) {
    return this.fetch(`/api/roles/${id}`)
  }

  async createRole(data) {
    return this.fetch('/api/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRole(id, data) {
    return this.fetch(`/api/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteRole(id) {
    return this.fetch(`/api/roles/${id}`, {
      method: 'DELETE',
    })
  }

  // Interview Questions API
  async getInterviewQuestions(role) {
    return this.fetch(`/api/interview?role=${encodeURIComponent(role)}`)
  }

  async createQuestion(data) {
    return this.fetch('/api/interview', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateQuestion(id, data) {
    return this.fetch(`/api/interview/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteQuestion(id) {
    return this.fetch(`/api/interview/${id}`, {
      method: 'DELETE',
    })
  }

  // Roadmap API
  async getRoadmap(goal, days = 30) {
    return this.fetch(`/api/roadmap?goal=${encodeURIComponent(goal)}&days=${days}`)
  }

  async getRoadmapGoals() {
    return this.fetch('/api/roadmap/goals')
  }

  // Study Topics API
  async getStudyTopics() {
    return this.fetch('/api/study')
  }

  async createStudyTopic(data) {
    return this.fetch('/api/study', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Career Insights API
  async getCareerInsights(category = null) {
    const url = category ? `/api/insights?category=${category}` : '/api/insights'
    return this.fetch(url)
  }

  async createInsight(data) {
    return this.fetch('/api/insights', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateInsight(id, data) {
    return this.fetch(`/api/insights/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteInsight(id) {
    return this.fetch(`/api/insights/${id}`, {
      method: 'DELETE',
    })
  }

  // Health Check
  async healthCheck() {
    return this.fetch('/health')
  }
}

export const api = new ApiService()
export default api
