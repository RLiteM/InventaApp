package com.wave.gt.inventa.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wave.gt.inventa.data.dto.ProveedorRequestDTO
import com.wave.gt.inventa.data.dto.ProveedorResponseDTO
import com.wave.gt.inventa.data.repository.ProveedorRepository
import com.wave.gt.inventa.util.NetworkResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class ProveedorUiState(
    val isLoading: Boolean = false,
    val proveedores: List<ProveedorResponseDTO> = emptyList(),
    val error: String? = null
)

class ProveedorViewModel(private val repository: ProveedorRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(ProveedorUiState())
    val uiState: StateFlow<ProveedorUiState> = _uiState

    fun loadProveedores() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.getProveedores()) {
                is NetworkResult.Success -> _uiState.update {
                    it.copy(isLoading = false, proveedores = result.data)
                }

                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }

    fun createProveedor(requestDTO: ProveedorRequestDTO) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.createProveedor(requestDTO)) {
                is NetworkResult.Success -> loadProveedores()
                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }
}
