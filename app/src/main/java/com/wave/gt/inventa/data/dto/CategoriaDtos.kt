package com.wave.gt.inventa.data.dto

import com.google.gson.annotations.SerializedName

data class CategoriaResponseDTO(
    @SerializedName("categoriaId")
    val categoriaId: Int,
    @SerializedName("nombre")
    val nombre: String,
    @SerializedName("descripcion")
    val descripcion: String?
)

data class CategoriaRequestDTO(
    @SerializedName("nombre")
    val nombre: String,
    @SerializedName("descripcion")
    val descripcion: String?
)
