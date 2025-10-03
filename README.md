# Inventa App (Módulo Android Nativo)

Cliente Android nativo en Kotlin para consumir la API REST de inventarios desplegada en Railway.

## Requisitos cumplidos
- Min SDK 21, arquitectura MVVM con ViewModel + Flow.
- UI construida con Jetpack Compose (pantalla de listado y creación de categorías).
- Retrofit 2 + OkHttp + Gson + Coroutines para llamadas HTTP.
- Manejo de errores HTTP con `try/catch` encapsulado en `executeSafely`.
- Estructura de paquetes organizada en `data`, `ui`, y `util`.

## Configuración
1. Ajusta la URL base si fuera necesario en [`ApiClient`](app/src/main/java/com/wave/gt/inventa/data/remote/ApiClient.kt). Actualmente apunta a:
   ```kotlin
   const val BASE_URL = "https://inventagt-production.up.railway.app/"
   ```
2. (Opcional) Habilita el header `Authorization` en el interceptor si tu backend requiere token.

## Compilación
```bash
./gradlew assembleDebug
```

## Pruebas rápidas con la API
### Listar categorías (`GET /api/categoria`)
La pantalla principal dispara la carga en `LaunchedEffect`, o puedes llamarla desde el `CategoriaViewModel`:
```kotlin
viewModel.loadCategorias()
```

### Crear categoría (`POST /api/categoria`)
Presiona el botón flotante `+`, completa el diálogo y confirma. Internamente se usa:
```kotlin
viewModel.createCategoria(nombre, descripcion)
```

Para probar sin UI puedes inyectar el repositorio y ejecutar:
```kotlin
val repository = CategoriaRepository(ApiClient.apiService)
repository.createCategoria(CategoriaRequestDTO("Bebidas", "Línea fría"))
```

Los mensajes de éxito y error se muestran mediante `Snackbar` en la `CategoriaScreen`.
