package com.wave.gt.inventa.data.repository

import com.wave.gt.inventa.data.dto.VentaRequestDTO
import com.wave.gt.inventa.data.dto.VentaResponseDTO
import com.wave.gt.inventa.data.remote.ApiService
import com.wave.gt.inventa.util.NetworkResult
import com.wave.gt.inventa.util.executeSafely

class VentaRepository(private val apiService: ApiService) {

    suspend fun getVentas(): NetworkResult<List<VentaResponseDTO>> =
        executeSafely { apiService.getVentas() }

    suspend fun getVenta(id: Int): NetworkResult<VentaResponseDTO> =
        executeSafely { apiService.getVentaById(id) }

    suspend fun createVenta(request: VentaRequestDTO): NetworkResult<VentaResponseDTO> =
        executeSafely { apiService.createVenta(request) }
}
