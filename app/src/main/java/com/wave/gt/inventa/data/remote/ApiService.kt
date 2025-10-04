// data/remote/ApiService.kt
package com.wave.gt.inventa.data.remote

import com.wave.gt.inventa.data.model.LoginRequest
import com.wave.gt.inventa.data.model.LoginResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse
}
