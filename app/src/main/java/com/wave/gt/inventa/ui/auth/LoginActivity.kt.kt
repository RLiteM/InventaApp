// ui/auth/LoginActivity.kt
package com.wave.gt.inventa.ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.lifecycle.ViewModelProvider
import com.wave.gt.inventa.R
import com.wave.gt.inventa.ui.main.MainActivity
import com.wave.gt.inventa.viewmodel.LoginViewModel

class LoginActivity : ComponentActivity() {
    private lateinit var viewModel: LoginViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val edtUsuario = findViewById<EditText>(R.id.edtUsuario)
        val edtContrasena = findViewById<EditText>(R.id.edtContrasena)
        val btnLogin = findViewById<Button>(R.id.btnLogin)

        viewModel = ViewModelProvider(this)[LoginViewModel::class.java]

        btnLogin.setOnClickListener {
            val usuario = edtUsuario.text.toString()
            val contrasena = edtContrasena.text.toString()
            viewModel.login(usuario, contrasena)
        }

        viewModel.loginResult.observe(this) { result ->
            result.onSuccess {
                Toast.makeText(this, "Bienvenido ${it.nombreCompleto}", Toast.LENGTH_LONG).show()
                // TODO: reemplazar por navegación real al menú principal
                startActivity(Intent(this, MainActivity::class.java))
                finish()
            }
            result.onFailure {
                Toast.makeText(this, "Error: ${it.message}", Toast.LENGTH_LONG).show()
            }
        }
    }
}