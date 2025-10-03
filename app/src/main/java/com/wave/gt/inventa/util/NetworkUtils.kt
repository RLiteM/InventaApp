package com.wave.gt.inventa.util

import retrofit2.HttpException
import java.io.IOException

fun getErrorMessage(throwable: Throwable): String = when (throwable) {
    is HttpException -> {
        val code = throwable.code()
        val message = throwable.response()?.errorBody()?.string()?.takeIf { it.isNotBlank() }
        "Error HTTP $code: ${message ?: throwable.message()}"
    }
    is IOException -> "Error de conexión. Verifica tu red."
    else -> throwable.message ?: "Error desconocido"
}

suspend fun <T> executeSafely(block: suspend () -> T): NetworkResult<T> = try {
    NetworkResult.Success(block())
} catch (throwable: Throwable) {
    NetworkResult.Error(getErrorMessage(throwable), throwable)
}
