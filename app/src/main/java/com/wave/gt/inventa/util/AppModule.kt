package com.wave.gt.inventa.util

import com.wave.gt.inventa.data.remote.ApiClient
import com.wave.gt.inventa.data.repository.AjusteInventarioRepository
import com.wave.gt.inventa.data.repository.CategoriaRepository
import com.wave.gt.inventa.data.repository.ClienteRepository
import com.wave.gt.inventa.data.repository.CompraRepository
import com.wave.gt.inventa.data.repository.ProductoRepository
import com.wave.gt.inventa.data.repository.ProveedorRepository
import com.wave.gt.inventa.data.repository.VentaRepository

object AppModule {
    private val apiService = ApiClient.apiService

    val categoriaRepository by lazy { CategoriaRepository(apiService) }
    val productoRepository by lazy { ProductoRepository(apiService) }
    val clienteRepository by lazy { ClienteRepository(apiService) }
    val proveedorRepository by lazy { ProveedorRepository(apiService) }
    val compraRepository by lazy { CompraRepository(apiService) }
    val ventaRepository by lazy { VentaRepository(apiService) }
    val ajusteInventarioRepository by lazy { AjusteInventarioRepository(apiService) }
}
