# Function to check if a process is using a specific port
function IsProcessUsingPort($port) {
    $processes = Get-NetTCPConnection | Where-Object {$_.LocalPort -eq $port}
    return $processes.Count -gt 0
}

# Check if any process is using port 3000
if (IsProcessUsingPort 3000) {
    # Get all processes using port 3000
    $processes = Get-NetTCPConnection | Where-Object {$_.LocalPort -eq 3000} | Select-Object OwningProcess

    # Loop through each process and terminate it
    foreach ($process in $processes.OwningProcess) {
        try {
            Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
            Write-Host "Terminated process ID: $($process.ToString())"
        }
        catch {
            Write-Host "Failed to terminate process ID: $($process.ToString())" -ForegroundColor Red
        }
    }

    Write-Host "All processes using port 3000 have been terminated."
}
else {
    Write-Host "No processes are currently using port 3000."
}
