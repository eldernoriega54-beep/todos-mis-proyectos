package com.example.tls.ui.onboarding

import android.Manifest
import android.content.pm.PackageManager
import android.view.ViewGroup
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.CloudDownload
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Videocam
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.LocalLifecycleOwner
import coil.compose.AsyncImage
import com.example.tls.dictionary.DictionaryRepository
import com.example.tls.dictionary.LanguageDictionaryInfo
import com.example.tls.ml.HandGestureRecognizer
import com.example.tls.ml.NormalizedPoint
import com.example.tls.ui.components.SkeletonOverlay
import com.example.tls.ui.theme.TlsDarkBorder
import com.example.tls.ui.theme.TlsDarkOrange
import com.example.tls.ui.theme.TlsGreenActive
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

@Composable
fun OnboardingScreen(
    dictionaryRepo: DictionaryRepository,
    onOnboardingCompleted: (userName: String, selectedLang: String) -> Unit
) {
    var currentStep by remember { mutableIntStateOf(1) } // 1: Perfil, 2: Idioma, 3: Calibrar

    var userName by remember { mutableStateOf("Elder Noriega") }
    var handPreference by remember { mutableStateOf("Derecha") }

    var githubLangs by remember { mutableStateOf<List<LanguageDictionaryInfo>>(emptyList()) }
    var selectedLanguageCode by remember { mutableStateOf("es-LSM") }

    LaunchedEffect(Unit) {
        githubLangs = dictionaryRepo.fetchAvailableGithubDictionaries()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(20.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            StepIndicator(currentStep = currentStep)

            Spacer(modifier = Modifier.height(16.dp))

            when (currentStep) {
                1 -> {
                    ProfileSetupStep(
                        name = userName,
                        onNameChange = { userName = it },
                        handPreference = handPreference,
                        onHandPreferenceChange = { handPreference = it },
                        onNext = { currentStep = 2 }
                    )
                }
                2 -> {
                    LanguageSetupStep(
                        languages = githubLangs,
                        selectedCode = selectedLanguageCode,
                        onSelectLanguage = { selectedLanguageCode = it },
                        onNext = { currentStep = 3 }
                    )
                }
                3 -> {
                    CalibrationStep(
                        onCalibrationDone = {
                            onOnboardingCompleted(userName, selectedLanguageCode)
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun StepIndicator(currentStep: Int) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 16.dp, bottom = 8.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        val steps = listOf("Perfil", "Idioma", "Calibrar")
        steps.forEachIndexed { index, stepTitle ->
            val stepNumber = index + 1
            val isActive = stepNumber == currentStep
            val isDone = stepNumber < currentStep

            val circleColor by animateColorAsState(
                targetValue = when {
                    isDone -> TlsGreenActive
                    isActive -> TlsDarkOrange
                    else -> MaterialTheme.colorScheme.surfaceVariant
                }, label = "stepColor"
            )

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(circleColor)
                        .border(1.5.dp, TlsDarkOrange, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    if (isDone) {
                        Icon(Icons.Default.Check, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                    } else {
                        Text(
                            text = "$stepNumber",
                            fontWeight = FontWeight.Bold,
                            color = if (isActive) Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 14.sp
                        )
                    }
                }
                Text(
                    text = stepTitle,
                    fontSize = 11.sp,
                    color = if (isActive) TlsDarkOrange else MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = if (isActive) FontWeight.Bold else FontWeight.Normal,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }

            if (index < steps.size - 1) {
                Box(
                    modifier = Modifier
                        .width(44.dp)
                        .height(2.dp)
                        .padding(horizontal = 4.dp)
                        .background(if (stepNumber < currentStep) TlsGreenActive else MaterialTheme.colorScheme.outlineVariant)
                )
            }
        }
    }
}

@Composable
private fun ProfileSetupStep(
    name: String,
    onNameChange: (String) -> Unit,
    handPreference: String,
    onHandPreferenceChange: (String) -> Unit,
    onNext: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(vertical = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .border(2.dp, TlsDarkOrange, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Person,
                    contentDescription = null,
                    tint = TlsDarkOrange,
                    modifier = Modifier.size(54.dp)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = "Configura tu Perfil",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            Text(
                text = "Personaliza tu experiencia con el traductor",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 4.dp)
            )

            Spacer(modifier = Modifier.height(26.dp))

            OutlinedTextField(
                value = name,
                onValueChange = onNameChange,
                label = { Text("Tu nombre o apodo") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = TlsDarkOrange,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outline
                ),
                shape = RoundedCornerShape(14.dp)
            )

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "Mano dominante para señas:",
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onBackground,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                listOf("Derecha", "Izquierda").forEach { hand ->
                    val selected = handPreference == hand
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (selected) TlsDarkOrange.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surfaceVariant)
                            .border(1.5.dp, if (selected) TlsDarkOrange else Color.Transparent, RoundedCornerShape(12.dp))
                            .clickable { onHandPreferenceChange(hand) }
                            .padding(vertical = 12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = hand,
                            color = if (selected) TlsDarkOrange else MaterialTheme.colorScheme.onBackground,
                            fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                }
            }
        }

        Button(
            onClick = onNext,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = TlsDarkOrange),
            shape = RoundedCornerShape(16.dp)
        ) {
            Text("Siguiente: Configurar Idioma", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White)
        }
    }
}

@Composable
private fun LanguageSetupStep(
    languages: List<LanguageDictionaryInfo>,
    selectedCode: String,
    onSelectLanguage: (String) -> Unit,
    onNext: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(vertical = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Diccionarios en GitHub",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            Text(
                text = "Conectado al repositorio público. Selecciona o descarga:",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 4.dp, bottom = 16.dp)
            )

            LazyColumn(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(languages) { lang ->
                    val isSelected = lang.code == selectedCode

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (isSelected) TlsDarkOrange.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant)
                            .border(1.5.dp, if (isSelected) TlsDarkOrange else MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(16.dp))
                            .clickable { onSelectLanguage(lang.code) }
                            .padding(14.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                // Insignia de código de idioma (sin emojis)
                                Box(
                                    modifier = Modifier
                                        .size(38.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(TlsDarkOrange.copy(alpha = 0.25f))
                                        .border(1.dp, TlsDarkOrange, RoundedCornerShape(8.dp)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = lang.code.take(2).uppercase(),
                                        fontWeight = FontWeight.Black,
                                        fontSize = 13.sp,
                                        color = TlsDarkOrange
                                    )
                                }

                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = lang.name,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp,
                                            color = MaterialTheme.colorScheme.onBackground
                                        )
                                        if (lang.isBeta) {
                                            Box(
                                                modifier = Modifier
                                                    .padding(start = 6.dp)
                                                    .background(TlsDarkOrange, RoundedCornerShape(4.dp))
                                                    .padding(horizontal = 4.dp, vertical = 2.dp)
                                            ) {
                                                Text("BETA", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                            }
                                        }
                                    }
                                    Text(
                                        text = "${lang.repoName} · ${lang.totalSigns} señas SVGs",
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            if (lang.isDownloaded) {
                                Icon(Icons.Default.CheckCircle, contentDescription = null, tint = TlsGreenActive)
                            } else {
                                Icon(Icons.Default.CloudDownload, contentDescription = null, tint = TlsDarkOrange)
                            }
                        }
                    }
                }
            }
        }

        Button(
            onClick = onNext,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = TlsDarkOrange),
            shape = RoundedCornerShape(16.dp)
        ) {
            Text("Siguiente: Calibrar Dispositivo", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White)
        }
    }
}

@Composable
private fun CalibrationStep(
    onCalibrationDone: () -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    // GUÍA DE VOCALES CON ILUSTRACIÓN SVG (SIN EMOJIS COMO PIDIÓ EL USUARIO)
    val vowels = listOf(
        Triple("A", "dictionary/es-LSM/A.svg", "Puño cerrado con pulgar al costado"),
        Triple("E", "dictionary/es-LSM/E.svg", "Dedos doblados hacia la palma"),
        Triple("I", "dictionary/es-LSM/I.svg", "Solo dedo meñique levantado"),
        Triple("O", "dictionary/es-LSM/O.svg", "Dedos en círculo tocando pulgar"),
        Triple("U", "dictionary/es-LSM/U.svg", "Índice y medio juntos hacia arriba")
    )

    var currentVowelIndex by remember { mutableIntStateOf(0) }
    var detectedLetter by remember { mutableStateOf("") }
    var landmarksState by remember { mutableStateOf<List<NormalizedPoint>>(emptyList()) }
    var isCalibrated by remember { mutableStateOf(false) }

    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
        )
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasCameraPermission = granted
    }

    LaunchedEffect(Unit) {
        if (!hasCameraPermission) {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    val recognizer = remember { HandGestureRecognizer(context) }
    DisposableEffect(Unit) {
        onDispose { recognizer.close() }
    }

    val targetVowel = vowels.getOrNull(currentVowelIndex)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(vertical = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Calibración del Dispositivo",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            Text(
                text = "Realiza las vocales frente a la cámara trasera",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 2.dp, bottom = 8.dp)
            )

            // TARJETA GUÍA CON SVG DE LA PALMA (EN LUGAR DE EMOJIS)
            if (targetVowel != null && !isCalibrated) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .border(1.5.dp, TlsDarkOrange, RoundedCornerShape(16.dp))
                        .padding(10.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        // Renderizado de SVG de la mano
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .border(1.dp, TlsDarkOrange, RoundedCornerShape(10.dp))
                                .background(Color(0xFF140F0D)),
                            contentAlignment = Alignment.Center
                        ) {
                            AsyncImage(
                                model = "file:///android_asset/${targetVowel.second}",
                                contentDescription = targetVowel.first,
                                modifier = Modifier.size(54.dp)
                            )
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Vocal actual: ${targetVowel.first}",
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Black,
                                color = TlsDarkOrange
                            )
                            Text(
                                text = targetVowel.third,
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // VENTANILLA DE CÁMARA TRASERA CON OVERLAY ESQUELETO ALINEADO
            Box(
                modifier = Modifier
                    .size(260.dp)
                    .clip(RoundedCornerShape(22.dp))
                    .background(Color.Black)
                    .border(2.5.dp, TlsDarkOrange, RoundedCornerShape(22.dp)),
                contentAlignment = Alignment.Center
            ) {
                if (hasCameraPermission) {
                    val executor = remember { Executors.newSingleThreadExecutor() }
                    val isProcessing = remember { AtomicBoolean(false) }

                    AndroidView(
                        factory = { ctx ->
                            val previewView = PreviewView(ctx).apply {
                                layoutParams = ViewGroup.LayoutParams(
                                    ViewGroup.LayoutParams.MATCH_PARENT,
                                    ViewGroup.LayoutParams.MATCH_PARENT
                                )
                                scaleType = PreviewView.ScaleType.FILL_CENTER
                            }
                            val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
                            cameraProviderFuture.addListener({
                                val cameraProvider = cameraProviderFuture.get()
                                val preview = Preview.Builder().build().also {
                                    it.setSurfaceProvider(previewView.surfaceProvider)
                                }

                                val imageAnalysis = ImageAnalysis.Builder()
                                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                                    .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
                                    .build()

                                imageAnalysis.setAnalyzer(executor) { imageProxy ->
                                    // Evitar acumulación de frames para latencia cero (30+ FPS fluido)
                                    if (isProcessing.compareAndSet(false, true)) {
                                        try {
                                            val rotationDegrees = imageProxy.imageInfo.rotationDegrees
                                            val bitmap = imageProxy.toBitmap()
                                            val result = recognizer.processFrame(bitmap, rotationDegrees)

                                            if (result.detected) {
                                                landmarksState = result.landmarks
                                                detectedLetter = result.letterOrWord

                                                if (targetVowel != null && result.letterOrWord.equals(targetVowel.first, ignoreCase = true)) {
                                                    if (currentVowelIndex < vowels.size - 1) {
                                                        currentVowelIndex++
                                                    } else {
                                                        isCalibrated = true
                                                    }
                                                }
                                            } else {
                                                landmarksState = emptyList()
                                            }
                                        } finally {
                                            isProcessing.set(false)
                                            imageProxy.close()
                                        }
                                    } else {
                                        imageProxy.close()
                                    }
                                }

                                try {
                                    cameraProvider.unbindAll()
                                    cameraProvider.bindToLifecycle(
                                        lifecycleOwner,
                                        CameraSelector.DEFAULT_BACK_CAMERA,
                                        preview,
                                        imageAnalysis
                                    )
                                } catch (e: Exception) {
                                    e.printStackTrace()
                                }
                            }, ContextCompat.getMainExecutor(ctx))
                            previewView
                        },
                        modifier = Modifier.fillMaxSize()
                    )

                    // SUPERPOSICIÓN DE ESQUELETO ANATÓMICO ALINEADO
                    SkeletonOverlay(landmarks = landmarksState)
                } else {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.Videocam, contentDescription = null, tint = TlsDarkOrange, modifier = Modifier.size(40.dp))
                        Text("Requiere permiso de cámara trasera", fontSize = 12.sp, color = Color.White)
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            if (isCalibrated) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(TlsGreenActive.copy(alpha = 0.2f), RoundedCornerShape(12.dp))
                        .border(1.5.dp, TlsGreenActive, RoundedCornerShape(12.dp))
                        .padding(10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = TlsGreenActive, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "¡Dispositivo Calibrado Correctamente!",
                            fontWeight = FontWeight.Bold,
                            color = TlsGreenActive,
                            fontSize = 14.sp
                        )
                    }
                }
            } else {
                Text(
                    text = if (detectedLetter.isNotEmpty()) "Detectado: $detectedLetter" else "Coloca tu mano frente al lente",
                    fontSize = 14.sp,
                    color = TlsDarkOrange,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        Button(
            onClick = onCalibrationDone,
            enabled = true,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = TlsDarkOrange),
            shape = RoundedCornerShape(16.dp)
        ) {
            Text(
                text = if (isCalibrated) "Comenzar a Usar TLS" else "Omitir y Comenzar",
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp,
                color = Color.White
            )
        }
    }
}
