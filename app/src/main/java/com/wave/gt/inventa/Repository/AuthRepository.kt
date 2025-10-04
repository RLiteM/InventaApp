// data/repository/AuthRepository.kt
package com.wave.gt.inventa.data.repository

import com.wave.gt.inventa.data.model.LoginRequest
import com.wave.gt.inventa.data.model.LoginResponse
import com.wave.gt.inventa.data.remote.RetrofitClient

class AuthRepository {
    private val api = RetrofitClient.api

    suspend fun login(usuario: String, contrasena: String): LoginResponse {
        return api.login(LoginRequest(usuario, contrasena))
    }
}
