package com.wave.gt.inventa.data.repository

import com.wave.gt.inventa.data.dto.CategoriaRequestDTO
import com.wave.gt.inventa.data.dto.CategoriaResponseDTO
import com.wave.gt.inventa.data.remote.ApiService
import com.wave.gt.inventa.util.NetworkResult
import com.wave.gt.inventa.util.executeSafely

class CategoriaRepository(private val apiService: ApiService) {

    suspend fun getCategorias(): NetworkResult<List<CategoriaResponseDTO>> =
        executeSafely { apiService.getCategorias() }

    suspend fun getCategoria(id: Int): NetworkResult<CategoriaResponseDTO> =
        executeSafely { apiService.getCategoriaById(id) }

    suspend fun createCategoria(request: CategoriaRequestDTO): NetworkResult<CategoriaResponseDTO> =
        executeSafely { apiService.createCategoria(request) }

    suspend fun updateCategoria(id: Int, request: CategoriaRequestDTO): NetworkResult<CategoriaResponseDTO> =
        executeSafely { apiService.updateCategoria(id, request) }

    suspend fun deleteCategoria(id: Int): NetworkResult<Unit> = executeSafely {
        apiService.deleteCategoria(id)
        Unit
    }
}
