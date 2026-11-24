package com.hermes.system.ui

import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bluetooth
import androidx.compose.material.icons.filled.BluetoothConnected
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hermes.system.viewmodel.ConnectionViewModel

@Composable
fun WiFiScanScreen(
    connectionViewModel: ConnectionViewModel,
    savedSsid: String, // Kept for interface compatibility
    language: String,
    onNetworkProvisioned: (ssid: String) -> Unit
) {
    val isSpanish = language == "es"
    val bgColor = Color(0xFF121212)
    val panelColor = Color(0xFF1E1E1E)
    val accentColor = Color(0xFF00E5FF)

    val isConnected by connectionViewModel.isConnected.collectAsState()

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { }

    LaunchedEffect(Unit) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            permissionLauncher.launch(
                arrayOf(
                    Manifest.permission.BLUETOOTH_CONNECT,
                    Manifest.permission.BLUETOOTH_SCAN
                )
            )
        }
    }

    // Si ya se conectó mágicamente, saltar
    LaunchedEffect(isConnected) {
        if (isConnected) {
            onNetworkProvisioned("Bluetooth")
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(bgColor)
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = if (isConnected) Icons.Filled.BluetoothConnected else Icons.Filled.Bluetooth,
                contentDescription = null,
                tint = accentColor,
                modifier = Modifier.size(64.dp)
            )
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = if (isSpanish) "Conectar Casco por Bluetooth" else "Connect Helmet via Bluetooth",
                color = Color.White,
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Surface(shape = RoundedCornerShape(12.dp), color = panelColor) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = if (isSpanish) "1. Ve a los ajustes de Bluetooth de tu celular.\n2. Empareja el dispositivo llamado 'HermesSystem_Casco'.\n3. Regresa a esta pantalla." 
                               else "1. Go to your phone's Bluetooth settings.\n2. Pair with 'HermesSystem_Casco'.\n3. Return here.",
                        color = Color.LightGray,
                        fontSize = 15.sp,
                        lineHeight = 22.sp
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Button(
                onClick = {
                    connectionViewModel.startConnection("Bluetooth") // Fuerza el intento de conexión
                    onNetworkProvisioned("Bluetooth")
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(10.dp),
                colors = ButtonDefaults.buttonColors(containerColor = accentColor)
            ) {
                Text(
                    text = if (isSpanish) "Continuar al Panel" else "Continue to Dashboard",
                    color = Color.Black,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            }
        }
    }
}

