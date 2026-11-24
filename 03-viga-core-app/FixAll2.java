import java.io.File;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;

public class FixAll2 {
    public static void main(String[] args) throws Exception {
        File dir = new File("d:/viga core app/app/src/main/java");
        fixFiles(dir);
        System.out.println("Done");
    }

    private static String fix(String s, String from, String to) {
        return s.replace(from, to);
    }

    private static void fixFiles(File dir) throws Exception {
        for (File f : dir.listFiles()) {
            if (f.isDirectory()) fixFiles(f);
            else if (f.getName().endsWith(".kt")) {
                byte[] raw = Files.readAllBytes(f.toPath());
                String content = new String(raw, StandardCharsets.UTF_8);
                String original = content;

                // Fix corrupted UTF-8 (mojibake)
                content = fix(content, "\u00C3\u00A1", "á");
                content = fix(content, "\u00C3\u00A9", "é");
                content = fix(content, "\u00C3\u00AD", "í");
                content = fix(content, "\u00C3\u00B3", "ó");
                content = fix(content, "\u00C3\u00BA", "ú");
                content = fix(content, "\u00C3\u00B1", "ñ");
                content = fix(content, "\u00C3\u0089", "É");
                content = fix(content, "\u00C3\u0093", "Ó");
                content = fix(content, "\u00C2\u00BF", "¿");
                content = fix(content, "\u00C2\u00A1", "¡");
                content = fix(content, "\u00C3\u0083\u00C2\u00B3", "ó");
                content = fix(content, "\u00C3\u0083\u00C2\u00A1", "á");
                content = fix(content, "\u00C3\u0083\u00C2\u00A9", "é");
                content = fix(content, "\u00C3\u0083\u00C2\u00AD", "í");
                content = fix(content, "\u00C3\u0083\u00C2\u00BA", "ú");
                content = fix(content, "\u00C3\u0083\u00C2\u00B1", "ñ");

                // Replace Viga Core names
                content = fix(content, "VIGA CORE", "HERMES-V1");
                content = fix(content, "Viga Core", "HERMES-V1");
                content = fix(content, "VigaCoreApp", "HermesApp");
                content = fix(content, "VigaCoreTheme", "HermesTheme");
                content = fix(content, "VigaCore", "HermesSystem");
                content = fix(content, "vigacore", "hermessystem");

                if (!content.equals(original)) {
                    Files.write(f.toPath(), content.getBytes(StandardCharsets.UTF_8));
                    System.out.println("Fixed: " + f.getName());
                }
            }
        }
    }
}
