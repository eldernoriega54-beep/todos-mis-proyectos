package com.example.tls.tts

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.util.Log
import java.util.Locale

class SpeechTtsManager(
    private val context: Context,
    private val onSpeechRecognized: (String) -> Unit,
    private val onSpeechStatusChange: (Boolean, String) -> Unit
) : TextToSpeech.OnInitListener {

    companion object {
        private const val TAG = "SpeechTtsManager"
    }

    private var tts: TextToSpeech? = null
    private var isTtsReady = false

    private var speechRecognizer: SpeechRecognizer? = null
    private var isListening = false

    init {
        initTts()
        initSpeechRecognizer()
    }

    private fun initTts() {
        try {
            tts = TextToSpeech(context, this)
        } catch (e: Exception) {
            Log.e(TAG, "Error inicializando TextToSpeech", e)
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(Locale("es", "MX"))
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                // Fallback a español genérico
                tts?.setLanguage(Locale("es"))
            }
            isTtsReady = true
            Log.d(TAG, "TTS inicializado correctamente")
        } else {
            Log.e(TAG, "Fallo al inicializar TTS: status $status")
        }
    }

    fun speakText(text: String) {
        if (text.isBlank()) return
        if (isTtsReady && tts != null) {
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "TLS_SPEECH_ID")
            Log.d(TAG, "Reproduciendo por altavoz: $text")
        } else {
            Log.w(TAG, "TTS no está listo aún")
        }
    }

    private fun initSpeechRecognizer() {
        if (SpeechRecognizer.isRecognitionAvailable(context)) {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context)
            speechRecognizer?.setRecognitionListener(object : RecognitionListener {
                override fun onReadyForSpeech(params: Bundle?) {
                    isListening = true
                    onSpeechStatusChange(true, "Escuchando a la otra persona...")
                }

                override fun onBeginningOfSpeech() {
                    onSpeechStatusChange(true, "Detectando voz...")
                }

                override fun onRmsChanged(rmsdB: Float) {}
                override fun onBufferReceived(buffer: ByteArray?) {}

                override fun onEndOfSpeech() {
                    isListening = false
                    onSpeechStatusChange(false, "Procesando respuesta...")
                }

                override fun onError(error: Int) {
                    isListening = false
                    val errorMsg = when (error) {
                        SpeechRecognizer.ERROR_NO_MATCH -> "No se escuchó con claridad"
                        SpeechRecognizer.ERROR_NETWORK -> "Error de red"
                        SpeechRecognizer.ERROR_AUDIO -> "Error de audio"
                        else -> "Listo para escuchar"
                    }
                    onSpeechStatusChange(false, errorMsg)
                }

                override fun onResults(results: Bundle?) {
                    isListening = false
                    val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    if (!matches.isNullOrEmpty()) {
                        val spokenText = matches[0]
                        Log.d(TAG, "Texto reconocido: $spokenText")
                        onSpeechRecognized(spokenText)
                        onSpeechStatusChange(false, "Voz recibida: \"$spokenText\"")
                    } else {
                        onSpeechStatusChange(false, "No se detectó texto")
                    }
                }

                override fun onPartialResults(partialResults: Bundle?) {
                    val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    if (!matches.isNullOrEmpty()) {
                        onSpeechStatusChange(true, matches[0])
                    }
                }

                override fun onEvent(eventType: Int, params: Bundle?) {}
            })
        }
    }

    fun startListening() {
        if (speechRecognizer != null && !isListening) {
            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, "es-MX")
                putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
            }
            speechRecognizer?.startListening(intent)
            isListening = true
            onSpeechStatusChange(true, "Iniciando micrófono...")
        }
    }

    fun stopListening() {
        if (speechRecognizer != null && isListening) {
            speechRecognizer?.stopListening()
            isListening = false
            onSpeechStatusChange(false, "Micrófono en espera")
        }
    }

    fun release() {
        try {
            tts?.stop()
            tts?.shutdown()
            tts = null
            speechRecognizer?.destroy()
            speechRecognizer = null
        } catch (e: Exception) {
            Log.e(TAG, "Error liberando SpeechTtsManager", e)
        }
    }
}
