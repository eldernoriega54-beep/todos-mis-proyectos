import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;

public class FixEmojis {
    public static void main(String[] args) throws Exception {
        String dir = "d:/viga core app/app/src/main/java/com/hermes/system/ui/";
        String[] files = {"SettingsScreen.kt", "LanguageScreen.kt", "TermsScreen.kt"};

        for (String file : files) {
            Path path = Paths.get(dir + file);
            if (Files.exists(path)) {
                String content = new String(Files.readAllBytes(path), StandardCharsets.UTF_8);
                content = content.replace("ðŸ“‹", "📋");
                content = content.replace("â€¢", "•");
                content = content.replace("ðŸ› ", "🛠");
                content = content.replace("¿Olvidar dispositivo??", "¿Olvidar dispositivo?");
                content = content.replace("ðŸš—", "🚗");
                content = content.replace("ðŸ”‹", "🔋");
                content = content.replace("ðŸ“¡", "📡");
                content = content.replace("ðŸ›¡", "🛡");
                content = content.replace("âš ", "⚠");
                
                Files.write(path, content.getBytes(StandardCharsets.UTF_8));
                System.out.println("Fixed " + file);
            }
        }
    }
}
