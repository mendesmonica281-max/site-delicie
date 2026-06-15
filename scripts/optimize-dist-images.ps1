Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$dist = Join-Path $root "dist"

function Get-Encoder($mimeType) {
  return [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq $mimeType } |
    Select-Object -First 1
}

function Save-Jpeg($image, $path, $quality) {
  $encoder = Get-Encoder "image/jpeg"
  $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    [int64]$quality
  )
  $image.Save($path, $encoder, $params)
}

function Resize-Image($relativePath, $maxWidth, $maxHeight, $quality) {
  $path = Join-Path $dist $relativePath
  if (-not (Test-Path $path)) {
    return
  }

  $source = [System.Drawing.Image]::FromFile($path)
  $tempPath = "$path.tmp"
  try {
    $scale = [Math]::Min($maxWidth / $source.Width, $maxHeight / $source.Height)
    if ($scale -gt 1) {
      $scale = 1
    }

    $width = [Math]::Max(1, [int][Math]::Round($source.Width * $scale))
    $height = [Math]::Max(1, [int][Math]::Round($source.Height * $scale))
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    try {
      $bitmap.SetResolution(72, 72)
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($source, 0, 0, $width, $height)
      }
      finally {
        $graphics.Dispose()
      }

      $extension = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
      if ($extension -eq ".jpg" -or $extension -eq ".jpeg") {
        Save-Jpeg $bitmap $tempPath $quality
      }
      else {
        $bitmap.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
      }
    }
    finally {
      $bitmap.Dispose()
    }
  }
  finally {
    $source.Dispose()
  }

  if (Test-Path $tempPath) {
    Remove-Item -LiteralPath $path -Force
    Move-Item -LiteralPath $tempPath -Destination $path
  }
}

$optimizations = @(
  @{ Path = "assets/favicon-delicie.png"; Width = 128; Height = 128; Quality = 90 },
  @{ Path = "assets/logo-delicie.png"; Width = 360; Height = 540; Quality = 90 },
  @{ Path = "assets/delicie-ganache-drip.png"; Width = 1400; Height = 768; Quality = 85 },
  @{ Path = "assets/delicie-hero-real-cake.jpg"; Width = 1280; Height = 900; Quality = 78 },
  @{ Path = "assets/proprietaria-delicie-confeiteira.jpg"; Width = 900; Height = 1100; Quality = 78 },
  @{ Path = "assets/bolo-piscina-cenoura.jpg"; Width = 900; Height = 900; Quality = 76 },
  @{ Path = "assets/bolo-chocolate-amendoim-crocante.jpg"; Width = 900; Height = 900; Quality = 76 },
  @{ Path = "assets/bolo-pudim-cremoso-doce-leite.jpg"; Width = 900; Height = 900; Quality = 76 },
  @{ Path = "assets/bolo-mole-cremoso.jpg"; Width = 900; Height = 900; Quality = 76 },
  @{ Path = "assets/bolo-matilda.jpg"; Width = 900; Height = 900; Quality = 76 },
  @{ Path = "assets/bolo-cenoura-calda-chocolate.jpg"; Width = 700; Height = 900; Quality = 76 },
  @{ Path = "assets/slice-sensacao.jpg"; Width = 700; Height = 900; Quality = 76 },
  @{ Path = "FOTOS-DELICIE/bolo-morango-especial.jpg"; Width = 900; Height = 900; Quality = 76 },
  @{ Path = "FOTOS-DELICIE/bolo-maracuja-premium.jpg"; Width = 900; Height = 900; Quality = 76 },
  @{ Path = "FOTOS-DELICIE/bolo-chocolate-trufado.jpg"; Width = 900; Height = 900; Quality = 76 },
  @{ Path = "FOTOS-DELICIE/bolo-brigadeiro-gourmet.jpg"; Width = 900; Height = 900; Quality = 76 },
  @{ Path = "FOTOS-DELICIE/hero-bolo-delicie-real.jpg"; Width = 1280; Height = 720; Quality = 78 }
)

foreach ($item in $optimizations) {
  Resize-Image $item.Path $item.Width $item.Height $item.Quality
}

Write-Host "Imagens da dist otimizadas."
