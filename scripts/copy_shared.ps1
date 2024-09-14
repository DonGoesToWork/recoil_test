# Define source and destination directories

function GetRealPath() {
    $realPath = Get-Content -Path "project_path.txt" -First 1
    return $realPath.Trim()
}

$finalPath = GetRealPath
$source = Join-Path $finalPath "shared"
$frontendDest = Join-Path $finalPath "frontend\src\shared"
$backendDest = Join-Path $finalPath "backend\src\shared"

# Robocopy options (don't concatenate into a single string)
$options = @("/MIR", "/R:3", "/W:5", "/XO")

# Function to copy from source to destination
function Copy-Shared {
    param (
        [string]$source,
        [string]$destination
    )
    Write-Host "Copying $source to $destination"
    
    # Ensure destination exists
    if (!(Test-Path $destination)) {
        New-Item -Path $destination -ItemType Directory
    }

    # Execute robocopy with options passed as an array
    robocopy $source $destination $options
}

# Infinite loop to check for changes every second
while ($true) {
    # Copy to frontend
    Copy-Shared -source $source -destination $frontendDest

    # Copy to backend
    Copy-Shared -source $source -destination $backendDest

    Write-Host "Shared folder synced with frontend and backend."

    # Wait for 1 second before checking again
    Start-Sleep -Seconds 5 #60
    # Start-Sleep -Seconds 9999 #60
}
