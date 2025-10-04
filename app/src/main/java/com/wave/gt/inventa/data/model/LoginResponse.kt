// data/model/LoginResponse.kt
package com.wave.gt.inventa.data.model

data class LoginResponse(
    val usuarioId: Int,
    val nombreCompleto: String,
    val rol: String,
    val mensaje: String
)
