import java.io.File;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;

public class FixEnc2 {
    public static void main(String[] args) throws Exception {
        File dir = new File("d:/viga core app/app/src/main/java");
        fixFiles(dir);
        System.out.println("Done");
    }

    private static void fixFiles(File dir) throws Exception {
        for (File f : dir.listFiles()) {
            if (f.isDirectory()) fixFiles(f);
            else if (f.getName().endsWith(".kt")) {
                byte[] raw = Files.readAllBytes(f.toPath());
                String content = new String(raw, StandardCharsets.UTF_8);
                String original = content;
                
                // Decode double/triple encoding by converting to ISO-8859-1 bytes and reading as UTF-8
                // We'll apply it only to characters that look like they were mojibaked.
                // It's safer to just fix specific known corruptions using string replacement.
                
                content = content.replace("ÃƒÂ³", "ó")
                               .replace("ÃƒÂ¡", "á")
                               .replace("ÃƒÂ©", "é")
                               .replace("ÃƒÂ­", "í")
                               .replace("ÃƒÂº", "ú")
                               .replace("ÃƒÂ±", "ñ")
                               .replace("ÃƒÂ ", "Á")
                               .replace("ÃƒÂ‰", "É")
                               .replace("ÃƒÂ ", "Í")
                               .replace("ÃƒÂ“", "Ó")
                               .replace("ÃƒÂš", "Ú")
                               .replace("ÃƒÂ‘", "Ñ")
                               .replace("Ã‚Â¿", "¿")
                               .replace("Ã‚Â¡", "¡")
                               .replace("Ã¢â‚¬â€œ", "-")
                               .replace("Ã¢â€ â€™", "→")
                               .replace("AÃ¢â€\u00A0â€™B", "A→B")
                               .replace("AÃ¢â€\u0080\u0099B", "A→B")
                               .replace("AÃ¢â‚¬â„¢B", "A→B");
                
                content = content.replace("Ã³", "ó").replace("Ã¡", "á").replace("Ã©", "é").replace("Ã­", "í");

                if (!content.equals(original)) {
                    Files.write(f.toPath(), content.getBytes(StandardCharsets.UTF_8));
                    System.out.println("Fixed: " + f.getName());
                }
            }
        }
    }
}