package com.wave.gt.inventa.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wave.gt.inventa.data.dto.CompraRequestDTO
import com.wave.gt.inventa.data.dto.CompraResponseDTO
import com.wave.gt.inventa.data.dto.LoteResponseDTO
import com.wave.gt.inventa.data.repository.CompraRepository
import com.wave.gt.inventa.util.NetworkResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class CompraUiState(
    val isLoading: Boolean = false,
    val compras: List<CompraResponseDTO> = emptyList(),
    val compraSeleccionada: CompraResponseDTO? = null,
    val lotes: List<LoteResponseDTO> = emptyList(),
    val error: String? = null
)

class CompraViewModel(private val repository: CompraRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(CompraUiState())
    val uiState: StateFlow<CompraUiState> = _uiState

    fun loadCompras() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.getCompras()) {
                is NetworkResult.Success -> _uiState.update {
                    it.copy(isLoading = false, compras = result.data)
                }

                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }

    fun loadCompra(id: Int) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.getCompra(id)) {
                is NetworkResult.Success -> _uiState.update {
                    it.copy(isLoading = false, compraSeleccionada = result.data)
                }

                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }

    fun createCompra(requestDTO: CompraRequestDTO) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.createCompra(requestDTO)) {
                is NetworkResult.Success -> loadCompras()
                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }

    fun loadLotes(productoId: Int) {
        viewModelScope.launch {
            when (val result = repository.getLotesByProducto(productoId)) {
                is NetworkResult.Success -> _uiState.update {
                    it.copy(lotes = result.data)
                }

                is NetworkResult.Error -> _uiState.update {
                    it.copy(error = result.message)
                }
            }
        }
    }
}
