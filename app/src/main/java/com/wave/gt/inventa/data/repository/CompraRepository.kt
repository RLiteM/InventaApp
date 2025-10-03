package com.wave.gt.inventa.data.repository

import com.wave.gt.inventa.data.dto.CompraRequestDTO
import com.wave.gt.inventa.data.dto.CompraResponseDTO
import com.wave.gt.inventa.data.dto.LoteResponseDTO
import com.wave.gt.inventa.data.remote.ApiService
import com.wave.gt.inventa.util.NetworkResult
import com.wave.gt.inventa.util.executeSafely

class CompraRepository(private val apiService: ApiService) {

    suspend fun getCompras(): NetworkResult<List<CompraResponseDTO>> =
        executeSafely { apiService.getCompras() }

    suspend fun getCompra(id: Int): NetworkResult<CompraResponseDTO> =
        executeSafely { apiService.getCompraById(id) }

    suspend fun createCompra(request: CompraRequestDTO): NetworkResult<CompraResponseDTO> =
        executeSafely { apiService.createCompra(request) }

    suspend fun getLotesByProducto(productoId: Int): NetworkResult<List<LoteResponseDTO>> =
        executeSafely { apiService.getLotesByProducto(productoId) }
}
