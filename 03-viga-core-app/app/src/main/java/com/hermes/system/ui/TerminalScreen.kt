package com.hermes.system.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Terminal
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TerminalScreen(
    rawLogsFlow: kotlinx.coroutines.flow.SharedFlow<String>,
    onSendCommand: (String) -> Unit,
    onBack: () -> Unit
) {
    val logs = remember { mutableStateListOf<String>() }
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()
    var inputText by remember { mutableStateOf("") }
    
    // Accumulate logs (up to 200 lines to prevent memory issues)
    LaunchedEffect(Unit) {
        rawLogsFlow.collect { raw ->
            val cleanStr = raw.replace("\r", "")
            if (cleanStr.isNotBlank()) {
                val lines = cleanStr.split("\n").filter { it.isNotBlank() }
                logs.addAll(lines)
                if (logs.size > 200) {
                    logs.removeRange(0, logs.size - 200)
                }
                listState.animateScrollToItem(logs.size - 1)
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0D1117)) // Estilo GitHub / Hacker
    ) {
        // Top Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF161B22))
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) { 
                Icon(Icons.AutoMirrored.Filled.ArrowBack, null, tint = Color.White) 
            }
            Spacer(Modifier.width(4.dp))
            Icon(Icons.Filled.Terminal, null, tint = Color(0xFF00E5FF))
            Spacer(Modifier.width(8.dp))
            Text("Terminal Serial BT", color = Color(0xFF00E5FF), fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }

        // Log Window
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(12.dp)
                .background(Color(0xFF000000), RoundedCornerShape(8.dp))
                .padding(8.dp)
        ) {
            LazyColumn(
                state = listState,
                modifier = Modifier.fillMaxSize()
            ) {
                items(logs) { log ->
                    val isCommand = log.startsWith(">")
                    Text(
                        text = log,
                        color = if (isCommand) Color.Yellow else Color(0xFF00FF00),
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp,
                        lineHeight = 16.sp
                    )
                }
            }
        }

        // Input Area
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Escribe un comando...", color = Color.Gray, fontSize = 12.sp) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = Color(0xFF00E5FF),
                    unfocusedBorderColor = Color.DarkGray,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                singleLine = true
            )
            Spacer(Modifier.width(8.dp))
            IconButton(
                onClick = {
                    if (inputText.isNotBlank()) {
                        val cmd = inputText
                        logs.add("> ")
                        onSendCommand(cmd)
                        inputText = ""
                        scope.launch { listState.animateScrollToItem(logs.size - 1) }
                    }
                },
                modifier = Modifier
                    .background(Color(0xFF00E5FF), RoundedCornerShape(8.dp))
                    .size(50.dp)
            ) {
                Icon(Icons.Filled.Send, null, tint = Color.Black)
            }
        }
    }
}
