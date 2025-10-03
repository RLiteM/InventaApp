package com.wave.gt.inventa.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wave.gt.inventa.data.dto.VentaRequestDTO
import com.wave.gt.inventa.data.dto.VentaResponseDTO
import com.wave.gt.inventa.data.repository.VentaRepository
import com.wave.gt.inventa.util.NetworkResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class VentaUiState(
    val isLoading: Boolean = false,
    val ventas: List<VentaResponseDTO> = emptyList(),
    val ventaSeleccionada: VentaResponseDTO? = null,
    val error: String? = null
)

class VentaViewModel(private val repository: VentaRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(VentaUiState())
    val uiState: StateFlow<VentaUiState> = _uiState

    fun loadVentas() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.getVentas()) {
                is NetworkResult.Success -> _uiState.update {
                    it.copy(isLoading = false, ventas = result.data)
                }

                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }

    fun loadVenta(id: Int) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.getVenta(id)) {
                is NetworkResult.Success -> _uiState.update {
                    it.copy(isLoading = false, ventaSeleccionada = result.data)
                }

                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }

    fun createVenta(requestDTO: VentaRequestDTO) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.createVenta(requestDTO)) {
                is NetworkResult.Success -> loadVentas()
                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }
}
