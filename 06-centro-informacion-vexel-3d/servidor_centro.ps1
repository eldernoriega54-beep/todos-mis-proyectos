# Servidor HTTP para "Centro de Informacion"
# Sirve la raíz del workspace en http://localhost:8001

$AppPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "Servidor CENTRO iniciado en:" -ForegroundColor Green
Write-Host "http://localhost:8001" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Abre tu navegador y ve a: http://localhost:8001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Crear listener HTTP
$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:8001/")
$Listener.Start()

Write-Host "Esperando conexiones..." -ForegroundColor Cyan

try {
    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $RequestPath = $Request.Url.LocalPath
        if ($RequestPath -eq "/") {
            $RequestPath = "/index.html"
        }

        $FilePath = Join-Path $AppPath $RequestPath
        $FilePath = $FilePath.Replace("/", "\")

        Write-Host "Solicitado: $RequestPath" -ForegroundColor Gray

        if (Test-Path $FilePath -PathType Leaf) {
            $Response.StatusCode = 200
            $Content = [System.IO.File]::ReadAllBytes($FilePath)
            $Response.ContentLength64 = $Content.Length
            
            # Detectar tipo MIME
            $Extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
            switch ($Extension) {
                ".html" { $Response.ContentType = "text/html; charset=utf-8" }
                ".css" { $Response.ContentType = "text/css; charset=utf-8" }
                ".js" { $Response.ContentType = "application/javascript; charset=utf-8" }
                ".json" { $Response.ContentType = "application/json; charset=utf-8" }
                ".svg" { $Response.ContentType = "image/svg+xml; charset=utf-8" }
                ".png" { $Response.ContentType = "image/png" }
                ".jpg" { $Response.ContentType = "image/jpeg" }
                ".jpeg" { $Response.ContentType = "image/jpeg" }
                ".gif" { $Response.ContentType = "image/gif" }
                ".woff" { $Response.ContentType = "font/woff" }
                ".woff2" { $Response.ContentType = "font/woff2" }
                ".ttf" { $Response.ContentType = "font/ttf" }
                default { $Response.ContentType = "application/octet-stream" }
            }
            
            $Response.OutputStream.Write($Content, 0, $Content.Length)
        } else {
            $Response.StatusCode = 404
            $Response.ContentType = "text/html; charset=utf-8"
            $ErrorContent = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - Archivo no encontrado</h1><p>$FilePath</p>")
            $Response.ContentLength64 = $ErrorContent.Length
            $Response.OutputStream.Write($ErrorContent, 0, $ErrorContent.Length)
        }

        $Response.Close()
    }
}
finally {
    $Listener.Stop()
    Write-Host "Servidor detenido" -ForegroundColor Red
}
