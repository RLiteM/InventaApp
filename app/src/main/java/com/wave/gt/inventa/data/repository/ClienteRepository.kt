package com.wave.gt.inventa.data.repository

import com.wave.gt.inventa.data.dto.ClienteRequestDTO
import com.wave.gt.inventa.data.dto.ClienteResponseDTO
import com.wave.gt.inventa.data.remote.ApiService
import com.wave.gt.inventa.util.NetworkResult
import com.wave.gt.inventa.util.executeSafely

class ClienteRepository(private val apiService: ApiService) {

    suspend fun getClientes(): NetworkResult<List<ClienteResponseDTO>> =
        executeSafely { apiService.getClientes() }

    suspend fun createCliente(request: ClienteRequestDTO): NetworkResult<ClienteResponseDTO> =
        executeSafely { apiService.createCliente(request) }
}
