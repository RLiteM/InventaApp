package com.wave.gt.inventa.data.dto

import com.google.gson.annotations.SerializedName
import java.math.BigDecimal
import java.time.LocalDate

data class CompraResponseDTO(
    @SerializedName("compraId")
    val compraId: Int,
    @SerializedName("proveedorId")
    val proveedorId: Int,
    @SerializedName("usuarioId")
    val usuarioId: Int,
    @SerializedName("fechaCompra")
    val fechaCompra: LocalDate,
    @SerializedName("numeroFactura")
    val numeroFactura: String?,
    @SerializedName("montoTotal")
    val montoTotal: BigDecimal,
    @SerializedName("detalles")
    val detalles: List<DetalleCompraItemDTO>
)

data class DetalleCompraItemDTO(
    @SerializedName("detalleCompraId")
    val detalleCompraId: Int?,
    @SerializedName("productoId")
    val productoId: Int,
    @SerializedName("cantidad")
    val cantidad: BigDecimal,
    @SerializedName("costoUnitarioCompra")
    val costoUnitarioCompra: BigDecimal,
    @SerializedName("subtotal")
    val subtotal: BigDecimal
)

data class LoteResponseDTO(
    @SerializedName("loteId")
    val loteId: Int,
    @SerializedName("productoId")
    val productoId: Int,
    @SerializedName("detalleCompraId")
    val detalleCompraId: Int,
    @SerializedName("fechaCaducidad")
    val fechaCaducidad: LocalDate,
    @SerializedName("cantidadInicial")
    val cantidadInicial: BigDecimal,
    @SerializedName("cantidadActual")
    val cantidadActual: BigDecimal
)

data class CompraRequestDTO(
    @SerializedName("proveedorId")
    val proveedorId: Int,
    @SerializedName("usuarioId")
    val usuarioId: Int,
    @SerializedName("fechaCompra")
    val fechaCompra: LocalDate,
    @SerializedName("numeroFactura")
    val numeroFactura: String?,
    @SerializedName("detalles")
    val detalles: List<DetalleCompraItemDTO>
)
