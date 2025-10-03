package com.wave.gt.inventa.data.dto

import com.google.gson.annotations.SerializedName
import java.math.BigDecimal
import java.time.Instant

data class AjusteInventarioResponseDTO(
    @SerializedName("ajusteId")
    val ajusteId: Int,
    @SerializedName("loteId")
    val loteId: Int,
    @SerializedName("usuarioId")
    val usuarioId: Int,
    @SerializedName("fechaAjuste")
    val fechaAjuste: Instant,
    @SerializedName("tipoAjuste")
    val tipoAjuste: String,
    @SerializedName("cantidad")
    val cantidad: BigDecimal,
    @SerializedName("motivo")
    val motivo: String?
)

data class AjusteInventarioRequestDTO(
    @SerializedName("loteId")
    val loteId: Int,
    @SerializedName("usuarioId")
    val usuarioId: Int,
    @SerializedName("tipoAjuste")
    val tipoAjuste: String,
    @SerializedName("cantidad")
    val cantidad: BigDecimal,
    @SerializedName("motivo")
    val motivo: String?
)
