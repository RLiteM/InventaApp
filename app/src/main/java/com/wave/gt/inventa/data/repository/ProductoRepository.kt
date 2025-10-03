package com.wave.gt.inventa.data.repository

import com.wave.gt.inventa.data.dto.ProductoRequestDTO
import com.wave.gt.inventa.data.dto.ProductoResponseDTO
import com.wave.gt.inventa.data.remote.ApiService
import com.wave.gt.inventa.util.NetworkResult
import com.wave.gt.inventa.util.executeSafely

class ProductoRepository(private val apiService: ApiService) {

    suspend fun getProductos(): NetworkResult<List<ProductoResponseDTO>> =
        executeSafely { apiService.getProductos() }

    suspend fun getProducto(id: Int): NetworkResult<ProductoResponseDTO> =
        executeSafely { apiService.getProductoById(id) }

    suspend fun createProducto(request: ProductoRequestDTO): NetworkResult<ProductoResponseDTO> =
        executeSafely { apiService.createProducto(request) }

    suspend fun updateProducto(id: Int, request: ProductoRequestDTO): NetworkResult<ProductoResponseDTO> =
        executeSafely { apiService.updateProducto(id, request) }

    suspend fun deleteProducto(id: Int): NetworkResult<Unit> = executeSafely {
        apiService.deleteProducto(id)
        Unit
    }
}
