package com.wave.gt.inventa

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.lifecycle.viewmodel.compose.viewModel
import com.wave.gt.inventa.ui.screen.CategoriaScreen
import com.wave.gt.inventa.ui.theme.InventaTheme
import com.wave.gt.inventa.ui.viewmodel.CategoriaViewModel
import com.wave.gt.inventa.ui.viewmodel.CategoriaViewModelFactory
import com.wave.gt.inventa.util.AppModule

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            InventaTheme {
                val categoriaViewModel: CategoriaViewModel = viewModel(
                    factory = CategoriaViewModelFactory(AppModule.categoriaRepository)
                )
                CategoriaScreen(viewModel = categoriaViewModel)
            }
        }
    }
}
