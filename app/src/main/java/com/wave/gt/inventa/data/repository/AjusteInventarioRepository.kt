package com.wave.gt.inventa.data.repository

import com.wave.gt.inventa.data.dto.AjusteInventarioRequestDTO
import com.wave.gt.inventa.data.dto.AjusteInventarioResponseDTO
import com.wave.gt.inventa.data.remote.ApiService
import com.wave.gt.inventa.util.NetworkResult
import com.wave.gt.inventa.util.executeSafely

class AjusteInventarioRepository(private val apiService: ApiService) {

    suspend fun getAjustes(): NetworkResult<List<AjusteInventarioResponseDTO>> =
        executeSafely { apiService.getAjustesInventario() }

    suspend fun createAjuste(request: AjusteInventarioRequestDTO): NetworkResult<AjusteInventarioResponseDTO> =
        executeSafely { apiService.createAjusteInventario(request) }
}
