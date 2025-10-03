package com.wave.gt.inventa.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wave.gt.inventa.data.dto.ProductoRequestDTO
import com.wave.gt.inventa.data.dto.ProductoResponseDTO
import com.wave.gt.inventa.data.repository.ProductoRepository
import com.wave.gt.inventa.util.NetworkResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class ProductoUiState(
    val isLoading: Boolean = false,
    val productos: List<ProductoResponseDTO> = emptyList(),
    val error: String? = null
)

class ProductoViewModel(private val repository: ProductoRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(ProductoUiState())
    val uiState: StateFlow<ProductoUiState> = _uiState

    fun loadProductos() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.getProductos()) {
                is NetworkResult.Success -> _uiState.update {
                    it.copy(isLoading = false, productos = result.data)
                }

                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }

    fun createProducto(requestDTO: ProductoRequestDTO) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.createProducto(requestDTO)) {
                is NetworkResult.Success -> {
                    loadProductos()
                }

                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }
}
