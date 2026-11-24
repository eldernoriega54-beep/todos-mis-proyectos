package com.example.tls.ui.components

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.example.tls.ui.theme.TlsDarkBorder
import com.example.tls.ui.theme.TlsDarkOrange

enum class NavigationTab(val index: Int, val title: String, val icon: ImageVector) {
    PROFILE(0, "Perfil", Icons.Default.Person),
    HOME(1, "Inicio", Icons.Default.Home),
    SETTINGS(2, "Ajustes", Icons.Default.Settings)
}

@Composable
fun BubbleNavigationBar(
    selectedTab: NavigationTab,
    onTabSelected: (NavigationTab) -> Unit,
    modifier: Modifier = Modifier
) {
    val tabs = NavigationTab.values()

    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 14.dp)
            .height(72.dp)
            .shadow(18.dp, RoundedCornerShape(36.dp), spotColor = TlsDarkOrange)
            .clip(RoundedCornerShape(36.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .border(1.5.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(36.dp)),
        contentAlignment = Alignment.CenterStart
    ) {
        BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
            val totalWidth = maxWidth
            val tabWidth = totalWidth / tabs.size
            val bubbleSize = 58.dp

            // Posición horizontal animada de la burbuja (Desplazamiento suave)
            val targetOffset = (tabWidth * selectedTab.index) + (tabWidth - bubbleSize) / 2
            val animatedBubbleX by animateDpAsState(
                targetValue = targetOffset,
                animationSpec = spring(
                    dampingRatio = 0.72f,
                    stiffness = Spring.StiffnessMediumLow
                ),
                label = "bubbleX"
            )

            // 1. BURBUJA COLIMADORA CON EFECTO VIDRIO (GLASSMORPHISM) QUE SE DESPLAZA
            Box(
                modifier = Modifier
                    .offset(x = animatedBubbleX)
                    .size(bubbleSize)
                    .align(Alignment.CenterStart)
                    .shadow(12.dp, CircleShape, spotColor = TlsDarkOrange)
                    .clip(CircleShape)
                    // Efecto de vidrio translúcido con brillo
                    .background(
                        Brush.radialGradient(
                            colors = listOf(
                                Color(0x55FF7A18), // Tinte naranja translúcido
                                Color(0x22F7ECE1), // Reflejo blanco-beige de lente
                                Color(0x11140F0D)  // Base oscura
                            )
                        )
                    )
                    .border(2.2.dp, TlsDarkOrange, CircleShape)
            ) {
                // Marcas reticulares de colimador en los 4 extremos de la lente
                // Mira superior
                Box(
                    modifier = Modifier
                        .size(width = 2.dp, height = 7.dp)
                        .background(TlsDarkOrange)
                        .align(Alignment.TopCenter)
                )
                // Mira inferior
                Box(
                    modifier = Modifier
                        .size(width = 2.dp, height = 7.dp)
                        .background(TlsDarkOrange)
                        .align(Alignment.BottomCenter)
                )
                // Mira izquierda
                Box(
                    modifier = Modifier
                        .size(width = 7.dp, height = 2.dp)
                        .background(TlsDarkOrange)
                        .align(Alignment.CenterStart)
                )
                // Mira derecha
                Box(
                    modifier = Modifier
                        .size(width = 7.dp, height = 2.dp)
                        .background(TlsDarkOrange)
                        .align(Alignment.CenterEnd)
                )
            }

            // 2. FILA DE ICONOS: EL ICONO BAJO EL COLIMADOR AUMENTA DE TAMAÑO (ZOOM DE LENTE)
            Row(
                modifier = Modifier.fillMaxSize(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                tabs.forEach { tab ->
                    val isSelected = tab == selectedTab

                    // Efecto de aumento óptico bajo la lente (zoom 1.38x cuando está colimado)
                    val iconScale by animateFloatAsState(
                        targetValue = if (isSelected) 1.38f else 0.95f,
                        animationSpec = spring(
                            dampingRatio = 0.68f,
                            stiffness = Spring.StiffnessMediumLow
                        ),
                        label = "iconScale"
                    )

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxHeight()
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null
                            ) {
                                onTabSelected(tab)
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = tab.icon,
                            contentDescription = tab.title,
                            modifier = Modifier
                                .size(28.dp)
                                .scale(iconScale),
                            tint = if (isSelected) {
                                TlsDarkOrange
                            } else {
                                MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.55f)
                            }
                        )
                    }
                }
            }
        }
    }
}
