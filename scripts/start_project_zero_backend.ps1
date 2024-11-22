$command = "npm run dev"

function GetRealPath() {
    $realPath = Get-Content -Path "project_path.txt" -First 1
    return $realPath.Trim()
}

$directory = Join-Path (GetRealPath) "\project_zero\backend"

if (Test-Path -Path $directory) {
    Push-Location $directory
    try {
        Invoke-Expression "$command"
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Error "Directory '$directory' does not exist."
}
