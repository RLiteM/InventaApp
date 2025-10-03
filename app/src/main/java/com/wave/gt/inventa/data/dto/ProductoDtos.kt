package com.wave.gt.inventa.data.dto

import com.google.gson.annotations.SerializedName
import java.math.BigDecimal

data class ProductoResponseDTO(
    @SerializedName("productoId")
    val productoId: Int,
    @SerializedName("sku")
    val sku: String,
    @SerializedName("nombre")
    val nombre: String,
    @SerializedName("descripcion")
    val descripcion: String?,
    // Idealmente usar BigDecimal para evitar errores de redondeo en montos monetarios
    @SerializedName("ultimoCosto")
    val ultimoCosto: BigDecimal,
    @SerializedName("precioMinorista")
    val precioMinorista: BigDecimal,
    @SerializedName("precioMayorista")
    val precioMayorista: BigDecimal,
    @SerializedName("stockActual")
    val stockActual: BigDecimal,
    @SerializedName("stockMinimo")
    val stockMinimo: BigDecimal,
    @SerializedName("unidadMedida")
    val unidadMedida: String,
    @SerializedName("categoriaId")
    val categoriaId: Int?
)

data class ProductoRequestDTO(
    @SerializedName("sku")
    val sku: String,
    @SerializedName("nombre")
    val nombre: String,
    @SerializedName("descripcion")
    val descripcion: String?,
    @SerializedName("ultimoCosto")
    val ultimoCosto: BigDecimal,
    @SerializedName("precioMinorista")
    val precioMinorista: BigDecimal,
    @SerializedName("precioMayorista")
    val precioMayorista: BigDecimal,
    @SerializedName("stockActual")
    val stockActual: BigDecimal,
    @SerializedName("stockMinimo")
    val stockMinimo: BigDecimal,
    @SerializedName("unidadMedida")
    val unidadMedida: String,
    @SerializedName("categoriaId")
    val categoriaId: Int?
)
