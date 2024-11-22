# Array of ports to check
$ports = @(3000, 5001, 5002, 5173)

# Function to check if a process is using a specific port
function IsProcessUsingPort($port) {
    $processes = Get-NetTCPConnection | Where-Object {$_.LocalPort -eq $port}
    return $processes.Count -gt 0
}

# Function to terminate processes using a specific port
function TerminateProcessesOnPort($port) {
    # Get all processes using the specified port
    $processes = Get-NetTCPConnection | Where-Object {$_.LocalPort -eq $port} | Select-Object OwningProcess

    # Loop through each process and terminate it
    foreach ($process in $processes.OwningProcess) {
        try {
            Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
            Write-Host "Terminated process ID: $($process.ToString()) on port $port"
        }
        catch {
            Write-Host "Failed to terminate process ID: $($process.ToString()) on port $port" -ForegroundColor Red
        }
    }
}

# Check and terminate processes for each port in the array
foreach ($port in $ports) {
    if (IsProcessUsingPort $port) {
        Write-Host "Processes found on port $port. Terminating..."
        TerminateProcessesOnPort $port
    } else {
        Write-Host "No processes are currently using port $port."
    }
}
