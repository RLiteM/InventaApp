package com.wave.gt.inventa.data.dto

import com.google.gson.annotations.SerializedName
import java.math.BigDecimal
import java.time.Instant

data class VentaResponseDTO(
    @SerializedName("ventaId")
    val ventaId: Int,
    @SerializedName("usuarioId")
    val usuarioId: Int,
    @SerializedName("clienteId")
    val clienteId: Int,
    @SerializedName("fechaVenta")
    val fechaVenta: Instant,
    @SerializedName("montoTotal")
    val montoTotal: BigDecimal,
    @SerializedName("metodoPago")
    val metodoPago: String,
    @SerializedName("detalles")
    val detalles: List<DetalleVentaItemDTO>
)

data class DetalleVentaItemDTO(
    @SerializedName("detalleId")
    val detalleId: Int?,
    @SerializedName("loteId")
    val loteId: Int,
    @SerializedName("cantidad")
    val cantidad: BigDecimal,
    @SerializedName("precioUnitarioVenta")
    val precioUnitarioVenta: BigDecimal,
    @SerializedName("subtotal")
    val subtotal: BigDecimal
)

data class VentaRequestDTO(
    @SerializedName("usuarioId")
    val usuarioId: Int,
    @SerializedName("clienteId")
    val clienteId: Int,
    @SerializedName("metodoPago")
    val metodoPago: String,
    @SerializedName("detalles")
    val detalles: List<DetalleVentaItemDTO>
)
