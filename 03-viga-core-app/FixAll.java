import java.io.File;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;

public class FixAll {
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

                // Fix corrupted UTF-8 characters (double-encoded)
                content = content.replace("Ã¡", "á").replace("Ã©", "é").replace("Ã­", "í")
                               .replace("Ã³", "ó").replace("Ãº", "ú").replace("Ã±", "ñ")
                               .replace("Ã ", "Á").replace("Ã‰", "É").replace("Ã"", "Ó")
                               .replace("Ãš", "Ú").replace("Ã'", "Ñ").replace("Â¿", "¿")
                               .replace("Â¡", "¡").replace("ÃƒÂ³", "ó").replace("ÃƒÂ¡", "á")
                               .replace("ÃƒÂ©", "é").replace("ÃƒÂ­", "í").replace("ÃƒÂº", "ú")
                               .replace("ÃƒÂ±", "ñ").replace("Ã‚Â¿", "¿").replace("Ã‚Â¡", "¡")
                               .replace("Ã¢â‚¬â€œ", "-").replace("â–¶", "▶").replace("â†±", "↱")
                               .replace("â¬†", "⬆").replace("ðŸ  ", "🏁").replace("Ã¢â€ â€™", "→")
                               // Fix garbled question marks and symbols
                               .replace("Ç§", "ú").replace("Ç¥", "ó").replace("ǟ", "á")
                               .replace("Ǧ", "ú").replace("Ǡ", "á").replace("Ç©", "é")
                               .replace("ǋ", "í").replace("Ç®", "ñ").replace("Ç¿", "¿")
                               .replace("Ǿ", "ó").replace("ǂ", "")
                               // Extra cleanup
                               .replace("&$/&$%", "").replace("\"?\"", "\"¿\"")
                               // Replace Viga Core / VigaCore with HERMES-V1
                               .replace("VIGA CORE", "HERMES-V1")
                               .replace("Viga Core", "HERMES-V1")
                               .replace("VigaCore", "HermesSystem")
                               .replace("vigacore", "hermessystem")
                               .replace("VigaCoreApp", "HermesApp")
                               .replace("VigaCoreTheme", "HermesTheme")
                               // Fix SMS alert message
                               .replace("El dispositivo VIGA CORE", "El sistema HERMES-V1")
                               .replace("The VigaCore device", "The HERMES-V1 system")
                               .replace("VIGA CORE y", "HERMES-V1 y")
                               .replace("VIGA CORE an", "HERMES-V1 an");

                if (!content.equals(original)) {
                    Files.write(f.toPath(), content.getBytes(StandardCharsets.UTF_8));
                    System.out.println("Fixed: " + f.getName());
                }
            }
        }
    }
}
