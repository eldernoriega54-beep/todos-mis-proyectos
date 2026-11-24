package com.example.tls.dictionary

import android.content.Context
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File

data class SignItem(
    val id: String,
    val label: String,
    val type: String, // "vowel", "letter", "word"
    val fingerState: String,
    val svgPath: String,
    val description: String
)

data class LanguageDictionaryInfo(
    val code: String,
    val name: String,
    val repoName: String,
    val author: String,
    val totalSigns: Int,
    val isDownloaded: Boolean = false,
    val isBeta: Boolean = false,
    val countryCode: String = "MX"
)

class DictionaryRepository(private val context: Context) {

    companion object {
        private const val TAG = "DictionaryRepository"
    }

    private val localSigns = mutableListOf<SignItem>()

    init {
        loadLocalManifest()
    }

    private fun loadLocalManifest() {
        try {
            val jsonString = context.assets.open("dictionary/es-LSM/manifest.json").bufferedReader().use { it.readText() }
            val root = JSONObject(jsonString)
            val signsArray = root.getJSONArray("signs")

            localSigns.clear()
            for (i in 0 until signsArray.length()) {
                val obj = signsArray.getJSONObject(i)
                localSigns.add(
                    SignItem(
                        id = obj.getString("id"),
                        label = obj.getString("label"),
                        type = obj.getString("type"),
                        fingerState = obj.getString("fingerState"),
                        svgPath = obj.getString("svgPath"),
                        description = obj.getString("description")
                    )
                )
            }
            Log.d(TAG, "Cargadas ${localSigns.size} señas locales para es-LSM")
        } catch (e: Exception) {
            Log.e(TAG, "Error cargando manifest local", e)
        }
    }

    fun getAllSigns(): List<SignItem> = localSigns

    fun getVowels(): List<SignItem> = localSigns.filter { it.type == "vowel" }

    fun findSign(term: String): SignItem? {
        val clean = term.trim().uppercase()
        return localSigns.find { it.id.uppercase() == clean || it.label.uppercase() == clean }
    }

    /**
     * Convierte la frase dicha por la otra persona en deletreo dactilológico
     * LETRA POR LETRA con las señas SVG de las manos.
     */
    fun phraseToSignsSequence(phrase: String): List<SignItem> {
        val clean = phrase.trim().uppercase()
        val sequence = mutableListOf<SignItem>()

        for (char in clean) {
            if (char.isWhitespace()) continue
            val letterSign = findSign(char.toString())
            if (letterSign != null) {
                sequence.add(letterSign)
            }
        }
        return sequence
    }

    /**
     * Simula y consulta los repositorios de GitHub disponibles para el TLS
     */
    suspend fun fetchAvailableGithubDictionaries(): List<LanguageDictionaryInfo> = withContext(Dispatchers.IO) {
        // En una versión completa aquí se hace Retrofit/OkHttp GET a api.github.com/users/{user}/repos
        // Devolvemos los diccionarios del repo público con el estado real
        listOf(
            LanguageDictionaryInfo(
                code = "es-LSM",
                name = "Español - Lengua de Señas Mexicana",
                repoName = "tls-dictionary-es-lsm",
                author = "ElderNoriega/TLS",
                totalSigns = 14,
                isDownloaded = true,
                isBeta = true,
                countryCode = "MX"
            ),
            LanguageDictionaryInfo(
                code = "en-ASL",
                name = "English - American Sign Language",
                repoName = "tls-dictionary-en-asl",
                author = "ElderNoriega/TLS",
                totalSigns = 32,
                isDownloaded = false,
                isBeta = false,
                countryCode = "US"
            ),
            LanguageDictionaryInfo(
                code = "es-LSE",
                name = "Español - Lengua de Signos Española",
                repoName = "tls-dictionary-es-lse",
                author = "ElderNoriega/TLS",
                totalSigns = 28,
                isDownloaded = false,
                isBeta = false,
                countryCode = "ES"
            ),
            LanguageDictionaryInfo(
                code = "pt-LIBRAS",
                name = "Português - Língua Brasileira de Sinais",
                repoName = "tls-dictionary-pt-libras",
                author = "ElderNoriega/TLS",
                totalSigns = 30,
                isDownloaded = false,
                isBeta = false,
                countryCode = "BR"
            )
        )
    }
}
