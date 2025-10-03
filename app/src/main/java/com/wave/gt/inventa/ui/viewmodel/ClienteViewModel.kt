package com.wave.gt.inventa.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.wave.gt.inventa.data.dto.ClienteRequestDTO
import com.wave.gt.inventa.data.dto.ClienteResponseDTO
import com.wave.gt.inventa.data.repository.ClienteRepository
import com.wave.gt.inventa.util.NetworkResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class ClienteUiState(
    val isLoading: Boolean = false,
    val clientes: List<ClienteResponseDTO> = emptyList(),
    val error: String? = null
)

class ClienteViewModel(private val repository: ClienteRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(ClienteUiState())
    val uiState: StateFlow<ClienteUiState> = _uiState

    fun loadClientes() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.getClientes()) {
                is NetworkResult.Success -> _uiState.update {
                    it.copy(isLoading = false, clientes = result.data)
                }

                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }

    fun createCliente(requestDTO: ClienteRequestDTO) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            when (val result = repository.createCliente(requestDTO)) {
                is NetworkResult.Success -> loadClientes()
                is NetworkResult.Error -> _uiState.update {
                    it.copy(isLoading = false, error = result.message)
                }
            }
        }
    }
}
