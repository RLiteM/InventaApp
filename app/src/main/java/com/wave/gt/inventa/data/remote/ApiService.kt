package com.wave.gt.inventa.data.remote

import com.wave.gt.inventa.data.dto.AjusteInventarioRequestDTO
import com.wave.gt.inventa.data.dto.AjusteInventarioResponseDTO
import com.wave.gt.inventa.data.dto.CategoriaRequestDTO
import com.wave.gt.inventa.data.dto.CategoriaResponseDTO
import com.wave.gt.inventa.data.dto.ClienteRequestDTO
import com.wave.gt.inventa.data.dto.ClienteResponseDTO
import com.wave.gt.inventa.data.dto.CompraRequestDTO
import com.wave.gt.inventa.data.dto.CompraResponseDTO
import com.wave.gt.inventa.data.dto.LoteResponseDTO
import com.wave.gt.inventa.data.dto.ProductoRequestDTO
import com.wave.gt.inventa.data.dto.ProductoResponseDTO
import com.wave.gt.inventa.data.dto.ProveedorRequestDTO
import com.wave.gt.inventa.data.dto.ProveedorResponseDTO
import com.wave.gt.inventa.data.dto.VentaRequestDTO
import com.wave.gt.inventa.data.dto.VentaResponseDTO
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    // CATEGORIA
    @GET("api/categoria")
    suspend fun getCategorias(): List<CategoriaResponseDTO>

    @GET("api/categoria/{id}")
    suspend fun getCategoriaById(@Path("id") id: Int): CategoriaResponseDTO

    @POST("api/categoria")
    suspend fun createCategoria(@Body categoriaRequestDTO: CategoriaRequestDTO): CategoriaResponseDTO

    @PUT("api/categoria/{id}")
    suspend fun updateCategoria(
        @Path("id") id: Int,
        @Body categoriaRequestDTO: CategoriaRequestDTO
    ): CategoriaResponseDTO

    @DELETE("api/categoria/{id}")
    suspend fun deleteCategoria(@Path("id") id: Int): Response<Unit>

    // PRODUCTO
    @GET("api/productos")
    suspend fun getProductos(): List<ProductoResponseDTO>

    @GET("api/productos/{id}")
    suspend fun getProductoById(@Path("id") id: Int): ProductoResponseDTO

    @POST("api/productos")
    suspend fun createProducto(@Body productoRequestDTO: ProductoRequestDTO): ProductoResponseDTO

    @PUT("api/productos/{id}")
    suspend fun updateProducto(
        @Path("id") id: Int,
        @Body productoRequestDTO: ProductoRequestDTO
    ): ProductoResponseDTO

    @DELETE("api/productos/{id}")
    suspend fun deleteProducto(@Path("id") id: Int): Response<Unit>

    // CLIENTE
    @GET("api/clientes")
    suspend fun getClientes(): List<ClienteResponseDTO>

    @POST("api/clientes")
    suspend fun createCliente(@Body clienteRequestDTO: ClienteRequestDTO): ClienteResponseDTO

    // PROVEEDOR
    @GET("api/proveedores")
    suspend fun getProveedores(): List<ProveedorResponseDTO>

    @POST("api/proveedores")
    suspend fun createProveedor(@Body proveedorRequestDTO: ProveedorRequestDTO): ProveedorResponseDTO

    // COMPRA
    @GET("api/compras")
    suspend fun getCompras(): List<CompraResponseDTO>

    @GET("api/compras/{id}")
    suspend fun getCompraById(@Path("id") id: Int): CompraResponseDTO

    @POST("api/compras")
    suspend fun createCompra(@Body compraRequestDTO: CompraRequestDTO): CompraResponseDTO

    @GET("api/lotes")
    suspend fun getLotesByProducto(@Query("productoId") productoId: Int): List<LoteResponseDTO>

    // VENTA
    @GET("api/ventas")
    suspend fun getVentas(): List<VentaResponseDTO>

    @GET("api/ventas/{id}")
    suspend fun getVentaById(@Path("id") id: Int): VentaResponseDTO

    @POST("api/ventas")
    suspend fun createVenta(@Body ventaRequestDTO: VentaRequestDTO): VentaResponseDTO

    // AJUSTE INVENTARIO
    @GET("api/ajustes-inventario")
    suspend fun getAjustesInventario(): List<AjusteInventarioResponseDTO>

    @POST("api/ajustes-inventario")
    suspend fun createAjusteInventario(@Body ajusteInventarioRequestDTO: AjusteInventarioRequestDTO): AjusteInventarioResponseDTO
}
