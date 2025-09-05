<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <img src="/assets/logos/logo-principal.png" alt="Arauca Noticias" class="login-logo">
          <h1>Panel de Administración</h1>
          <p>Inicia sesión para gestionar las noticias</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              required
              class="form-input"
              :class="{ 'error': errors.email }"
              placeholder="admin@araucanoticias.com"
            >
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              required
              class="form-input"
              :class="{ 'error': errors.password }"
              placeholder="••••••••"
            >
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <button 
            type="submit" 
            class="login-btn"
            :disabled="loading"
          >
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

          <div v-if="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>
        </form>

        <div class="login-footer">
          <p>¿No tienes acceso? Contacta al administrador del sistema.</p>
          <a href="/" class="back-link">← Volver al sitio principal</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api.js'

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const errorMessage = ref('')
    const errors = ref({})

    const form = reactive({
      email: '',
      password: ''
    })

    const validateForm = () => {
      errors.value = {}
      
      if (!form.email) {
        errors.value.email = 'El correo electrónico es requerido'
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.value.email = 'El correo electrónico no es válido'
      }

      if (!form.password) {
        errors.value.password = 'La contraseña es requerida'
      } else if (form.password.length < 6) {
        errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
      }

      return Object.keys(errors.value).length === 0
    }

    const handleLogin = async () => {
      if (!validateForm()) return

      loading.value = true
      errorMessage.value = ''

      try {
        console.log('Intentando login con:', form)
        const response = await authService.login(form)
        console.log('Respuesta del servidor:', response)
        
        if (response.success) {
          // Redirigir al dashboard
          router.push('/admin/dashboard')
        } else {
          errorMessage.value = response.message || 'Error al iniciar sesión'
        }
      } catch (error) {
        console.error('Error de login:', error)
        console.error('Error response:', error.response)
        console.error('Error request:', error.request)
        
        if (error.response) {
          // El servidor respondió con un código de error
          errorMessage.value = error.response.data?.message || `Error del servidor: ${error.response.status}`
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          errorMessage.value = 'No se pudo conectar con el servidor. Verifica que esté ejecutándose.'
        } else {
          // Algo más pasó
          errorMessage.value = 'Error inesperado. Intenta nuevamente.'
        }
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      errors,
      loading,
      errorMessage,
      handleLogin
    }
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
  text-align: center;
}

.login-header {
  margin-bottom: 2rem;
}

.login-logo {
  height: 60px;
  width: auto;
  margin-bottom: 1rem;
}

.login-header h1 {
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #666;
  font-size: 0.9rem;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #e53e3e;
}

.error-message {
  color: #e53e3e;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-alert {
  background: #fed7d7;
  color: #c53030;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  font-size: 0.9rem;
  border: 1px solid #feb2b2;
}

.login-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e1e5e9;
}

.login-footer p {
  color: #666;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #764ba2;
}

@media (max-width: 480px) {
  .admin-login {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
  }
  
  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
