import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;

public class FixEnc {
    public static void main(String[] args) throws Exception {
        File dir = new File("d:/viga core app/app/src/main/java");
        fixFiles(dir);
        System.out.println("Done");
    }

    private static void fixFiles(File dir) throws Exception {
        for (File f : dir.listFiles()) {
            if (f.isDirectory()) fixFiles(f);
            else if (f.getName().endsWith(".kt")) {
                String content = new String(Files.readAllBytes(f.toPath()), StandardCharsets.UTF_8);
                String original = content;
                
                content = content.replace("Ã¡", "á")
                               .replace("Ã©", "é")
                               .replace("Ã­", "í")
                               .replace("Ã³", "ó")
                               .replace("Ãº", "ú")
                               .replace("Ã±", "ñ")
                               .replace("Ã ", "Á")
                               .replace("Ã‰", "É")
                               .replace("Ã ", "Í")
                               .replace("Ã“", "Ó")
                               .replace("Ãš", "Ú")
                               .replace("Ã‘", "Ñ")
                               .replace("Â¿", "¿")
                               .replace("Â¡", "¡")
                               .replace("â”€", "─")
                               .replace("â–¶", "▶")
                               .replace("ðŸ  ", "🏁")
                               .replace("â†±", "↱")
                               .replace("â¬†", "⬆");

                // manual replacements for complex sequences
                content = content.replace("Ã¢â\u0080\u0099", "→");
                content = content.replace("Ã¢â\u00A0â\u0080\u0099", "→");
                content = content.replace("Ã\u0083Â³", "ó");

                if (!content.equals(original)) {
                    Files.write(f.toPath(), content.getBytes(StandardCharsets.UTF_8));
                    System.out.println("Fixed: " + f.getName());
                }
            }
        }
    }
}