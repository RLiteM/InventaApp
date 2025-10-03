package com.wave.gt.inventa.data.dto

import com.google.gson.annotations.SerializedName

data class ClienteResponseDTO(
    @SerializedName("clienteId")
    val clienteId: Int,
    @SerializedName("nombreCompleto")
    val nombreCompleto: String,
    @SerializedName("identificacionFiscal")
    val identificacionFiscal: String?,
    @SerializedName("telefono")
    val telefono: String?,
    @SerializedName("direccion")
    val direccion: String?,
    @SerializedName("tipoCliente")
    val tipoCliente: String
)

data class ClienteRequestDTO(
    @SerializedName("nombreCompleto")
    val nombreCompleto: String,
    @SerializedName("identificacionFiscal")
    val identificacionFiscal: String?,
    @SerializedName("telefono")
    val telefono: String?,
    @SerializedName("direccion")
    val direccion: String?,
    @SerializedName("tipoCliente")
    val tipoCliente: String
)
