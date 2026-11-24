package com.hermes.system.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog

// ────────── Lista completa de países A-Z con código ──────────
private val COUNTRIES = listOf(
    "ðŸ‡¦ðŸ‡« Afganistán" to "+93",
    "ðŸ‡¦ðŸ‡± Albania" to "+355",
    "ðŸ‡©ðŸ‡¿ Algeria" to "+213",
    "ðŸ‡¦ðŸ‡© Andorra" to "+376",
    "ðŸ‡¦ðŸ‡´ Angola" to "+244",
    "ðŸ‡¦ðŸ‡¬ Antigua y Barbuda" to "+1-268",
    "ðŸ‡¸ðŸ‡¦ Arabia Saudita" to "+966",
    "ðŸ‡¦ðŸ‡· Argentina" to "+54",
    "ðŸ‡¦ðŸ‡² Armenia" to "+374",
    "ðŸ‡¦ðŸ‡º Australia" to "+61",
    "ðŸ‡¦ðŸ‡¹ Austria" to "+43",
    "ðŸ‡¦ðŸ‡¿ Azerbaiyán" to "+994",
    "ðŸ‡§ðŸ‡¸ Bahamas" to "+1-242",
    "ðŸ‡§ðŸ‡­ Baréin" to "+973",
    "ðŸ‡§ðŸ‡© Bangladesh" to "+880",
    "ðŸ‡§ðŸ‡§ Barbados" to "+1-246",
    "ðŸ‡§ðŸ‡ª Bélgica" to "+32",
    "ðŸ‡§ðŸ‡¿ Belice" to "+501",
    "ðŸ‡§ðŸ‡¯ Benín" to "+229",
    "ðŸ‡§ðŸ‡¾ Bielorrusia" to "+375",
    "ðŸ‡²ðŸ‡² Birmania (Myanmar)" to "+95",
    "ðŸ‡§ðŸ‡´ Bolivia" to "+591",
    "ðŸ‡§ðŸ‡¦ Bosnia y Herzegovina" to "+387",
    "ðŸ‡§ðŸ‡¼ Botsuana" to "+267",
    "ðŸ‡§ðŸ‡· Brasil" to "+55",
    "ðŸ‡§ðŸ‡³ Brunéi" to "+673",
    "ðŸ‡§ðŸ‡¬ Bulgaria" to "+359",
    "ðŸ‡§ðŸ‡« Burkina Faso" to "+226",
    "ðŸ‡§ðŸ‡® Burundi" to "+257",
    "ðŸ‡§ðŸ‡¹ Bután" to "+975",
    "ðŸ‡¨ðŸ‡» Cabo Verde" to "+238",
    "ðŸ‡°ðŸ‡­ Camboya" to "+855",
    "ðŸ‡¨ðŸ‡² Camerún" to "+237",
    "ðŸ‡¨ðŸ‡¦ Canadá" to "+1",
    "ðŸ‡¶ðŸ‡¦ Catar" to "+974",
    "ðŸ‡¹ðŸ‡© Chad" to "+235",
    "ðŸ‡¨ðŸ‡± Chile" to "+56",
    "ðŸ‡¨ðŸ‡³ China" to "+86",
    "ðŸ‡¨ðŸ‡¾ Chipre" to "+357",
    "ðŸ‡¨ðŸ‡´ Colombia" to "+57",
    "ðŸ‡°ðŸ‡² Comoras" to "+269",
    "ðŸ‡¨ðŸ‡¬ Congo" to "+242",
    "ðŸ‡°ðŸ‡µ Corea del Norte" to "+850",
    "ðŸ‡°ðŸ‡· Corea del Sur" to "+82",
    "ðŸ‡¨ðŸ‡· Costa Rica" to "+506",
    "ðŸ‡¨ðŸ‡® Costa de Marfil" to "+225",
    "ðŸ‡­ðŸ‡· Croacia" to "+385",
    "ðŸ‡¨ðŸ‡º Cuba" to "+53",
    "ðŸ‡©ðŸ‡° Dinamarca" to "+45",
    "ðŸ‡©ðŸ‡¯ Djibouti" to "+253",
    "ðŸ‡©ðŸ‡² Dominica" to "+1-767",
    "ðŸ‡ªðŸ‡¨ Ecuador" to "+593",
    "ðŸ‡ªðŸ‡¬ Egipto" to "+20",
    "ðŸ‡¸ðŸ‡» El Salvador" to "+503",
    "ðŸ‡¦ðŸ‡ª Emiratos Ãrabes Unidos" to "+971",
    "ðŸ‡ªðŸ‡· Eritrea" to "+291",
    "ðŸ‡¸ðŸ‡° Eslovaquia" to "+421",
    "ðŸ‡¸ðŸ‡® Eslovenia" to "+386",
    "ðŸ‡ªðŸ‡¸ España" to "+34",
    "ðŸ‡ºðŸ‡¸ Estados Unidos" to "+1",
    "ðŸ‡ªðŸ‡ª Estonia" to "+372",
    "ðŸ‡¸ðŸ‡¿ Esuatini" to "+268",
    "ðŸ‡ªðŸ‡¹ Etiopía" to "+251",
    "ðŸ‡µðŸ‡­ Filipinas" to "+63",
    "ðŸ‡«ðŸ‡® Finlandia" to "+358",
    "ðŸ‡«ðŸ‡¯ Fiyi" to "+679",
    "ðŸ‡«ðŸ‡· Francia" to "+33",
    "ðŸ‡¬ðŸ‡¦ Gabón" to "+241",
    "ðŸ‡¬ðŸ‡² Gambia" to "+220",
    "ðŸ‡¬ðŸ‡ª Georgia" to "+995",
    "ðŸ‡¬ðŸ‡­ Ghana" to "+233",
    "ðŸ‡¬ðŸ‡© Granada" to "+1-473",
    "ðŸ‡¬ðŸ‡· Grecia" to "+30",
    "ðŸ‡¬ðŸ‡¹ Guatemala" to "+502",
    "ðŸ‡¬ðŸ‡³ Guinea" to "+224",
    "ðŸ‡¬ðŸ‡¼ Guinea-Bisáu" to "+245",
    "ðŸ‡¬ðŸ‡¶ Guinea Ecuatorial" to "+240",
    "ðŸ‡¬ðŸ‡¾ Guyana" to "+592",
    "ðŸ‡­ðŸ‡¹ Haití" to "+509",
    "ðŸ‡­ðŸ‡³ Honduras" to "+504",
    "ðŸ‡­ðŸ‡º Hungría" to "+36",
    "ðŸ‡®ðŸ‡³ India" to "+91",
    "ðŸ‡®ðŸ‡© Indonesia" to "+62",
    "ðŸ‡®ðŸ‡¶ Irak" to "+964",
    "ðŸ‡®ðŸ‡· Irán" to "+98",
    "ðŸ‡®ðŸ‡ª Irlanda" to "+353",
    "ðŸ‡®ðŸ‡¸ Islandia" to "+354",
    "ðŸ‡®ðŸ‡± Israel" to "+972",
    "ðŸ‡®ðŸ‡¹ Italia" to "+39",
    "ðŸ‡¯ðŸ‡² Jamaica" to "+1-876",
    "ðŸ‡¯ðŸ‡µ Japón" to "+81",
    "ðŸ‡¯ðŸ‡´ Jordania" to "+962",
    "ðŸ‡°ðŸ‡¿ Kazajistán" to "+7",
    "ðŸ‡°ðŸ‡ª Kenia" to "+254",
    "ðŸ‡°ðŸ‡¬ Kirguistán" to "+996",
    "ðŸ‡°ðŸ‡® Kiribati" to "+686",
    "ðŸ‡½ðŸ‡° Kosovo" to "+383",
    "ðŸ‡°ðŸ‡¼ Kuwait" to "+965",
    "ðŸ‡±ðŸ‡¦ Laos" to "+856",
    "ðŸ‡±ðŸ‡¸ Lesoto" to "+266",
    "ðŸ‡±ðŸ‡» Letonia" to "+371",
    "ðŸ‡±ðŸ‡§ Líbano" to "+961",
    "ðŸ‡±ðŸ‡· Liberia" to "+231",
    "ðŸ‡±ðŸ‡¾ Libia" to "+218",
    "ðŸ‡±ðŸ‡® Liechtenstein" to "+423",
    "ðŸ‡±ðŸ‡¹ Lituania" to "+370",
    "ðŸ‡±ðŸ‡º Luxemburgo" to "+352",
    "ðŸ‡²ðŸ‡° Macedonia del Norte" to "+389",
    "ðŸ‡²ðŸ‡¬ Madagascar" to "+261",
    "ðŸ‡²ðŸ‡¾ Malasia" to "+60",
    "ðŸ‡²ðŸ‡¼ Malaui" to "+265",
    "ðŸ‡²ðŸ‡» Maldivas" to "+960",
    "ðŸ‡²ðŸ‡± Malí" to "+223",
    "ðŸ‡²ðŸ‡¹ Malta" to "+356",
    "ðŸ‡²ðŸ‡¦ Marruecos" to "+212",
    "ðŸ‡²ðŸ‡º Mauricio" to "+230",
    "ðŸ‡²ðŸ‡· Mauritania" to "+222",
    "ðŸ‡²ðŸ‡½ México" to "+52",
    "ðŸ‡«ðŸ‡² Micronesia" to "+691",
    "ðŸ‡²ðŸ‡© Moldavia" to "+373",
    "ðŸ‡²ðŸ‡¨ Mónaco" to "+377",
    "ðŸ‡²ðŸ‡³ Mongolia" to "+976",
    "ðŸ‡²ðŸ‡ª Montenegro" to "+382",
    "ðŸ‡²ðŸ‡¿ Mozambique" to "+258",
    "ðŸ‡³ðŸ‡¦ Namibia" to "+264",
    "ðŸ‡³ðŸ‡· Nauru" to "+674",
    "ðŸ‡³ðŸ‡µ Nepal" to "+977",
    "ðŸ‡³ðŸ‡® Nicaragua" to "+505",
    "ðŸ‡³ðŸ‡ª Níger" to "+227",
    "ðŸ‡³ðŸ‡¬ Nigeria" to "+234",
    "ðŸ‡³ðŸ‡´ Noruega" to "+47",
    "ðŸ‡³ðŸ‡¿ Nueva Zelanda" to "+64",
    "ðŸ‡´ðŸ‡² Omán" to "+968",
    "ðŸ‡µðŸ‡° Pakistán" to "+92",
    "ðŸ‡µðŸ‡¼ Palaos" to "+680",
    "ðŸ‡µðŸ‡¸ Palestina" to "+970",
    "ðŸ‡µðŸ‡¦ Panamá" to "+507",
    "ðŸ‡µðŸ‡¬ Papúa Nueva Guinea" to "+675",
    "ðŸ‡µðŸ‡¾ Paraguay" to "+595",
    "ðŸ‡µðŸ‡ª Perú" to "+51",
    "ðŸ‡µðŸ‡± Polonia" to "+48",
    "ðŸ‡µðŸ‡¹ Portugal" to "+351",
    "ðŸ‡¬ðŸ‡§ Reino Unido" to "+44",
    "ðŸ‡¨ðŸ‡« República Centroafricana" to "+236",
    "ðŸ‡¨ðŸ‡¿ República Checa" to "+420",
    "ðŸ‡¨ðŸ‡© República Democrática del Congo" to "+243",
    "ðŸ‡©ðŸ‡´ República Dominicana" to "+1-809",
    "ðŸ‡·ðŸ‡¼ Ruanda" to "+250",
    "ðŸ‡·ðŸ‡´ Rumanía" to "+40",
    "ðŸ‡·ðŸ‡º Rusia" to "+7",
    "ðŸ‡¼ðŸ‡¸ Samoa" to "+685",
    "ðŸ‡°ðŸ‡³ San Cristóbal y Nieves" to "+1-869",
    "ðŸ‡¸ðŸ‡² San Marino" to "+378",
    "ðŸ‡»ðŸ‡¨ San Vicente y las Granadinas" to "+1-784",
    "ðŸ‡¸ðŸ‡¹ Santo Tomé y Príncipe" to "+239",
    "ðŸ‡¸ðŸ‡³ Senegal" to "+221",
    "ðŸ‡·ðŸ‡¸ Serbia" to "+381",
    "ðŸ‡¸ðŸ‡¨ Seychelles" to "+248",
    "ðŸ‡¸ðŸ‡± Sierra Leona" to "+232",
    "ðŸ‡¸ðŸ‡¬ Singapur" to "+65",
    "ðŸ‡¸ðŸ‡¾ Siria" to "+963",
    "ðŸ‡¸ðŸ‡´ Somalia" to "+252",
    "ðŸ‡±ðŸ‡° Sri Lanka" to "+94",
    "ðŸ‡¿ðŸ‡¦ Sudáfrica" to "+27",
    "ðŸ‡¸ðŸ‡© Sudán" to "+249",
    "ðŸ‡¸ðŸ‡¸ Sudán del Sur" to "+211",
    "ðŸ‡¸ðŸ‡ª Suecia" to "+46",
    "ðŸ‡¨ðŸ‡­ Suiza" to "+41",
    "ðŸ‡¸ðŸ‡· Surinam" to "+597",
    "ðŸ‡¹ðŸ‡­ Tailandia" to "+66",
    "ðŸ‡¹ðŸ‡¿ Tanzania" to "+255",
    "ðŸ‡¹ðŸ‡¯ Tayikistán" to "+992",
    "ðŸ‡¹ðŸ‡± Timor Oriental" to "+670",
    "ðŸ‡¹ðŸ‡¬ Togo" to "+228",
    "ðŸ‡¹ðŸ‡´ Tonga" to "+676",
    "ðŸ‡¹ðŸ‡¹ Trinidad y Tobago" to "+1-868",
    "ðŸ‡¹ðŸ‡³ Túnez" to "+216",
    "ðŸ‡¹ðŸ‡² Turkmenistán" to "+993",
    "ðŸ‡¹ðŸ‡· Turquía" to "+90",
    "ðŸ‡¹ðŸ‡» Tuvalu" to "+688",
    "ðŸ‡ºðŸ‡¦ Ucrania" to "+380",
    "ðŸ‡ºðŸ‡¬ Uganda" to "+256",
    "ðŸ‡ºðŸ‡¾ Uruguay" to "+598",
    "ðŸ‡ºðŸ‡¿ Uzbekistán" to "+998",
    "ðŸ‡»ðŸ‡º Vanuatu" to "+678",
    "ðŸ‡»ðŸ‡¦ Vaticano" to "+379",
    "ðŸ‡»ðŸ‡ª Venezuela" to "+58",
    "ðŸ‡»ðŸ‡³ Vietnam" to "+84",
    "ðŸ‡¾ðŸ‡ª Yemen" to "+967",
    "ðŸ‡¿ðŸ‡² Zambia" to "+260",
    "ðŸ‡¿ðŸ‡¼ Zimbabue" to "+263"
).sortedBy { it.first.drop(4) }

private val DEFAULT_COUNTRY = COUNTRIES.find { it.first.contains("Guatemala") } ?: COUNTRIES.first()

// Parsear string de contactos guardados â†’ lista de (código, número local)
private fun parseContacts(raw: String): List<Pair<String, String>> {
    if (raw.isBlank()) return listOf(Pair(DEFAULT_COUNTRY.second, ""))
    return raw.split(",").mapNotNull { fullNum ->
        val trimmed = fullNum.trim()
        if (trimmed.isEmpty()) return@mapNotNull null
        val country = COUNTRIES.sortedByDescending { it.second.length }.find { trimmed.startsWith(it.second) }
        val code = country?.second ?: DEFAULT_COUNTRY.second
        val local = trimmed.removePrefix(code)
        Pair(code, local)
    }.ifEmpty { listOf(Pair(DEFAULT_COUNTRY.second, "")) }
}

@Composable
fun CountryPickerDialog(
    selected: String, // código como "+502"
    onDismiss: () -> Unit,
    onSelected: (Pair<String, String>) -> Unit
) {
    var search by remember { mutableStateOf("") }
    val filtered = COUNTRIES.filter {
        it.first.contains(search, ignoreCase = true) || it.second.contains(search)
    }
    Dialog(onDismissRequest = onDismiss) {
        Surface(shape = RoundedCornerShape(16.dp), color = Color(0xFF1E1E1E)) {
            Column(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
                Text("Seleccionar País", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = search,
                    onValueChange = { search = it },
                    placeholder = { Text("Buscar...", color = Color.Gray) },
                    leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null, tint = Color.Gray) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White, unfocusedTextColor = Color.White,
                        focusedBorderColor = Color(0xFF00E5FF), unfocusedBorderColor = Color.Gray
                    ),
                    singleLine = true
                )
                Spacer(Modifier.height(8.dp))
                LazyColumn(modifier = Modifier.fillMaxWidth().heightIn(max = 300.dp)) {
                    items(filtered) { country ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { onSelected(country); onDismiss() }
                                .background(if (country.second == selected) Color(0xFF002233) else Color.Transparent)
                                .padding(horizontal = 12.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(country.first, color = Color.White, modifier = Modifier.weight(1f), fontSize = 14.sp)
                            Text(country.second, color = Color(0xFF00E5FF), fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MedicalDataScreen(
    language: String,
    initialName: String = "",
    initialAge: String = "",
    initialWeight: String = "",
    initialBlood: String = "",
    initialAllergies: String = "",
    initialContacts: String = "",
    initialContactsEnabled: String = "",
    initial911Enabled: Boolean = true,
    onSaveCompleted: (String, String, String, String, String, String, String, Boolean) -> Unit
) {
    val isSpanish = language == "es"
    
    // Alerta de desactivación 911
    var show911Warning by remember { mutableStateOf(false) }
    var emergency911Enabled by remember { mutableStateOf(initial911Enabled) }
    val bgColor = Color(0xFF121212)
    val panelColor = Color(0xFF1E1E1E)
    val accentColor = Color(0xFF00E5FF)

    var name by remember { mutableStateOf(initialName) }
    var age by remember { mutableStateOf(initialAge) }
    var weight by remember { mutableStateOf(initialWeight) }
    var bloodType by remember { mutableStateOf(initialBlood) }
    var allergies by remember { mutableStateOf(initialAllergies) }

    // Lista mutable de contactos: (código país, número local)
    var contactList by remember { mutableStateOf(parseContacts(initialContacts)) }
    
    // Lista de estados activo/inactivo por cada contacto personal
    val initEnabledList = initialContactsEnabled.split(",").map { it == "true" }
    var contactEnabledList by remember { 
        mutableStateOf(contactList.indices.map { i -> initEnabledList.getOrElse(i) { true } }) 
    }

    // Ãndice del contacto que está abriendo el picker, o -1 si ninguno
    var pickerOpenForIndex by remember { mutableStateOf(-1) }

    val isFormValid = name.isNotBlank() && age.isNotBlank() && bloodType.isNotBlank()
    val MAX_CONTACTS = 5

    // Diálogo de país
    if (pickerOpenForIndex >= 0 && pickerOpenForIndex < contactList.size) {
        CountryPickerDialog(
            selected = contactList[pickerOpenForIndex].first,
            onDismiss = { pickerOpenForIndex = -1 },
            onSelected = { country ->
                contactList = contactList.toMutableList().also {
                    it[pickerOpenForIndex] = Pair(country.second, it[pickerOpenForIndex].second)
                }
                pickerOpenForIndex = -1
            }
        )
    }

    Surface(modifier = Modifier.fillMaxSize(), color = bgColor) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = if (isSpanish) "Datos Médicos" else "Medical Data",
                color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold
            )
            Text(
                text = if (isSpanish) "Se enviarán con la alerta de emergencia."
                       else "Sent with the emergency alert.",
                color = Color.Gray, fontSize = 13.sp
            )

            // ─── Datos básicos ─────────────────────────────
            Surface(shape = RoundedCornerShape(14.dp), color = panelColor) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(if (isSpanish) "Información Personal" else "Personal Info", color = accentColor, fontWeight = FontWeight.Bold)
                    FieldInput(if (isSpanish) "Nombre completo" else "Full name", name, { name = it })
                    FieldInput(if (isSpanish) "Edad" else "Age", age, { age = it }, KeyboardType.Number)
                    FieldInput(if (isSpanish) "Peso (kg)" else "Weight (kg)", weight, { weight = it }, KeyboardType.Decimal)

                    val bloodOptions = listOf("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
                    Text(if (isSpanish) "Tipo de sangre" else "Blood type", color = Color.Gray, fontSize = 13.sp)
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp), modifier = Modifier.fillMaxWidth()) {
                        bloodOptions.forEach { opt ->
                            FilterChip(
                                selected = bloodType == opt,
                                onClick = { bloodType = opt },
                                label = { Text(opt, fontSize = 12.sp) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = accentColor,
                                    selectedLabelColor = Color.Black,
                                    labelColor = Color.White
                                )
                            )
                        }
                    }
                    FieldInput(if (isSpanish) "Alergias (o 'Ninguna')" else "Allergies (or 'None')", allergies, { allergies = it })
                }
            }

            // ─── Contactos de emergencia ────────────────────
            Surface(shape = RoundedCornerShape(14.dp), color = panelColor) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        if (isSpanish) "Contactos de Emergencia" else "Emergency Contacts",
                        color = accentColor, fontWeight = FontWeight.Bold
                    )
                    Text(
                        if (isSpanish) "SMS automático con tu ubicación (máx. $MAX_CONTACTS números)."
                        else "Auto SMS with your location (max $MAX_CONTACTS numbers).",
                        color = Color.LightGray, fontSize = 12.sp
                    )

                    // 1. SERVICIOS DE EMERGENCIA (Fijo - Simulado)
                    Surface(shape = RoundedCornerShape(10.dp), color = Color(0xFF2A2A2A)) {
                        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Servicios de Emergencia (911)", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Switch(
                                    checked = emergency911Enabled,
                                    onCheckedChange = { 
                                        emergency911Enabled = it
                                        if (!it) show911Warning = true 
                                    },
                                    colors = SwitchDefaults.colors(checkedThumbColor = accentColor, checkedTrackColor = accentColor.copy(alpha = 0.3f))
                                )
                            }
                            Text("ðŸ“ž +504 9758-0983", color = if (emergency911Enabled) Color.Green else Color.Gray, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            
                            if (show911Warning && !emergency911Enabled) {
                                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.background(Color(0x33FF0000), RoundedCornerShape(8.dp)).padding(8.dp)) {
                                    Icon(Icons.Filled.Warning, contentDescription = null, tint = Color.Red, modifier = Modifier.size(16.dp))
                                    Spacer(Modifier.width(6.dp))
                                    Text("ADVERTENCIA: Si desactivas esta función el sistema no podrá enviar una alerta a los servicios de emergencia en caso de accidente. Está bajo tu responsabilidad.", color = Color.Red, fontSize = 11.sp, lineHeight = 14.sp)
                                }
                            }
                        }
                    }

                    HorizontalDivider(color = Color.DarkGray, modifier = Modifier.padding(vertical = 4.dp))
                    Text(if (isSpanish) "Contactos Personales" else "Personal Contacts", color = Color.Gray, fontSize = 13.sp, fontWeight = FontWeight.Bold)

                    // 2. Lista de contactos personales
                    contactList.forEachIndexed { index, (code, local) ->
                        Surface(shape = RoundedCornerShape(10.dp), color = Color(0xFF2A2A2A)) {
                            Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        if (isSpanish) "Contacto ${index + 1}" else "Contact ${index + 1}",
                                        color = Color.Gray, fontSize = 12.sp,
                                        modifier = Modifier.weight(1f)
                                    )
                                    Switch(
                                        checked = contactEnabledList.getOrElse(index) { true },
                                        onCheckedChange = { isChecked ->
                                            contactEnabledList = contactEnabledList.toMutableList().also {
                                                if (index < it.size) it[index] = isChecked
                                                else it.add(isChecked)
                                            }
                                        },
                                        modifier = Modifier.scale(0.8f),
                                        colors = SwitchDefaults.colors(checkedThumbColor = accentColor, checkedTrackColor = accentColor.copy(alpha = 0.3f))
                                    )
                                    if (contactList.size > 1) {
                                        IconButton(
                                            onClick = {
                                                contactList = contactList.toMutableList().also { it.removeAt(index) }
                                                contactEnabledList = contactEnabledList.toMutableList().also { if (index < it.size) it.removeAt(index) }
                                            },
                                            modifier = Modifier.size(28.dp)
                                        ) {
                                            Icon(Icons.Filled.Delete, contentDescription = "Eliminar", tint = Color.Red, modifier = Modifier.size(18.dp))
                                        }
                                    }
                                }
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    // Botón de país
                                    val countryEntry = COUNTRIES.find { it.second == code }
                                    OutlinedButton(
                                        onClick = { pickerOpenForIndex = index },
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier.wrapContentWidth(),
                                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)
                                    ) {
                                        Text(
                                            "${countryEntry?.first?.take(2) ?: "ðŸŒ"} $code",
                                            color = Color.White, fontSize = 12.sp
                                        )
                                        Icon(Icons.Filled.ArrowDropDown, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(16.dp))
                                    }
                                    // Número local
                                    OutlinedTextField(
                                        value = local,
                                        onValueChange = { newLocal ->
                                            contactList = contactList.toMutableList().also {
                                                it[index] = Pair(code, newLocal)
                                            }
                                        },
                                        label = { Text(if (isSpanish) "Número" else "Number", fontSize = 12.sp) },
                                        modifier = Modifier.weight(1f),
                                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                                        singleLine = true,
                                        colors = OutlinedTextFieldDefaults.colors(
                                            focusedTextColor = Color.White, unfocusedTextColor = Color.White,
                                            focusedBorderColor = accentColor, unfocusedBorderColor = Color.Gray
                                        )
                                    )
                                }
                                if (local.isNotBlank()) {
                                    Text("ðŸ“ž $code$local", color = Color.Green, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }

                    // Botón para agregar contacto
                    if (contactList.size < MAX_CONTACTS) {
                        OutlinedButton(
                            onClick = { contactList = contactList + Pair(DEFAULT_COUNTRY.second, "") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = accentColor)
                        ) {
                            Icon(Icons.Filled.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(6.dp))
                            Text(if (isSpanish) "Agregar número" else "Add number", fontSize = 14.sp)
                        }
                    } else {
                        Text(
                            if (isSpanish) "Máximo $MAX_CONTACTS contactos alcanzado."
                            else "Maximum $MAX_CONTACTS contacts reached.",
                            color = Color.Yellow, fontSize = 12.sp
                        )
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Filled.Warning, contentDescription = null, tint = Color.Yellow, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            if (isSpanish) "Escribe solo el número local, sin el código de país."
                            else "Enter only the local number, without the country code.",
                            color = Color.Yellow, fontSize = 11.sp
                        )
                    }
                }
            }

            // ─── Botón Guardar ──────────────────────────────
            Button(
                onClick = {
                    val allNumbers = contactList
                        .filter { it.second.isNotBlank() }
                        .joinToString(",") { "${it.first}${it.second}" }
                    val allStates = contactEnabledList.joinToString(",") { it.toString() }
                    onSaveCompleted(name, age, weight, bloodType, allergies, allNumbers, allStates, emergency911Enabled)
                },
                enabled = isFormValid,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isFormValid) accentColor else Color.Gray
                )
            ) {
                Text(
                    text = if (isSpanish) "Guardar y continuar" else "Save and continue",
                    color = if (isFormValid) Color.Black else Color.DarkGray,
                    fontWeight = FontWeight.Bold, fontSize = 16.sp
                )
            }
            Spacer(Modifier.height(16.dp))
        }
    }
}

@Composable
private fun FieldInput(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    keyboardType: KeyboardType = KeyboardType.Text
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        modifier = Modifier.fillMaxWidth(),
        singleLine = true,
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        colors = OutlinedTextFieldDefaults.colors(
            focusedTextColor = Color.White, unfocusedTextColor = Color.White,
            focusedBorderColor = Color(0xFF00E5FF), unfocusedBorderColor = Color.Gray,
            focusedLabelColor = Color(0xFF00E5FF), unfocusedLabelColor = Color.Gray
        )
    )
}

