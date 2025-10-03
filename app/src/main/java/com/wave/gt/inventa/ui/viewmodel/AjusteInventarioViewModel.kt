package com.wave.gt.inventa.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wave.gt.inventa.data.dto.AjusteInventarioRequestDTO
import com.wave.gt.inventa.data.dto.AjusteInventarioResponseDTO
import com.wave.gt.inventa.data.repository.AjusteInventarioRepository
import com.wave.gt.inventa.util.NetworkResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class AjusteInventarioUiState(
    val isLoading: Boolean = false,
    val ajustes: List<AjusteInventarioResponseDTO> = emptyList(),
    val error: String? = null
)

class AjusteInventarioViewModel(private val repository: AjusteInventarioRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(AjusteInventarioUiState())
    val uiState: StateFlow<AjusteInventarioUiState> = _uiState

    fun loadAjustes() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.getAjustes()) {
                is NetworkResult.Success -> _uiState.update {
                    it.copy(isLoading = false, ajustes = result.data)
                }

                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }

    fun createAjuste(requestDTO: AjusteInventarioRequestDTO) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.createAjuste(requestDTO)) {
                is NetworkResult.Success -> loadAjustes()
                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }
}
