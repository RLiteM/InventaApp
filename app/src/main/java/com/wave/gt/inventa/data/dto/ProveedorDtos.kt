package com.wave.gt.inventa.data.dto

import com.google.gson.annotations.SerializedName

data class ProveedorResponseDTO(
    @SerializedName("proveedorId")
    val proveedorId: Int,
    @SerializedName("nombreEmpresa")
    val nombreEmpresa: String,
    @SerializedName("telefono")
    val telefono: String?,
    @SerializedName("direccion")
    val direccion: String?
)

data class ProveedorRequestDTO(
    @SerializedName("nombreEmpresa")
    val nombreEmpresa: String,
    @SerializedName("telefono")
    val telefono: String?,
    @SerializedName("direccion")
    val direccion: String?
)
