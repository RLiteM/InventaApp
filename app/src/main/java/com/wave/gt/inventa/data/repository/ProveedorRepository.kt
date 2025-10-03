package com.wave.gt.inventa.data.repository

import com.wave.gt.inventa.data.dto.ProveedorRequestDTO
import com.wave.gt.inventa.data.dto.ProveedorResponseDTO
import com.wave.gt.inventa.data.remote.ApiService
import com.wave.gt.inventa.util.NetworkResult
import com.wave.gt.inventa.util.executeSafely

class ProveedorRepository(private val apiService: ApiService) {

    suspend fun getProveedores(): NetworkResult<List<ProveedorResponseDTO>> =
        executeSafely { apiService.getProveedores() }

    suspend fun createProveedor(request: ProveedorRequestDTO): NetworkResult<ProveedorResponseDTO> =
        executeSafely { apiService.createProveedor(request) }
}
