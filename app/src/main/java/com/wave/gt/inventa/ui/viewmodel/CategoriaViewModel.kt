package com.wave.gt.inventa.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.wave.gt.inventa.data.dto.CategoriaRequestDTO
import com.wave.gt.inventa.data.dto.CategoriaResponseDTO
import com.wave.gt.inventa.data.repository.CategoriaRepository
import com.wave.gt.inventa.util.NetworkResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class CategoriaUiState(
    val isLoading: Boolean = false,
    val categorias: List<CategoriaResponseDTO> = emptyList(),
    val error: String? = null,
    val successMessage: String? = null
)

class CategoriaViewModel(private val repository: CategoriaRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(CategoriaUiState())
    val uiState: StateFlow<CategoriaUiState> = _uiState

    fun loadCategorias() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.getCategorias()) {
                is NetworkResult.Success -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            categorias = result.data,
                            error = null
                        )
                    }
                }

                is NetworkResult.Error -> {
                    _uiState.update {
                        it.copy(isLoading = false, error = result.message)
                    }
                }
            }
        }
    }

    fun createCategoria(nombre: String, descripcion: String?) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, successMessage = null) }
            val request = CategoriaRequestDTO(nombre = nombre, descripcion = descripcion)
            when (val result = repository.createCategoria(request)) {
                is NetworkResult.Success -> {
                    loadCategorias()
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            successMessage = "Categoría creada: ${result.data.nombre}"
                        )
                    }
                }

                is NetworkResult.Error -> {
                    _uiState.update { it.copy(isLoading = false, error = result.message) }
                }
            }
        }
    }

    fun clearMessages() {
        _uiState.update { it.copy(error = null, successMessage = null) }
    }
}

class CategoriaViewModelFactory(private val repository: CategoriaRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(CategoriaViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return CategoriaViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
