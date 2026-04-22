#!/usr/bin/env pwsh
# LP_AI Project - NPM Helper PowerShell Script
# This script sets up the NODE.JS environment and runs npm commands

param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Arguments
)

$NodePath = "C:\Program Files\nodejs"
$ProjectPath = "F:\My projects\Life-Pilot-AI\LP_AI\LP_AI"

# Check if Node.js is installed
if (-not (Test-Path "$NodePath\node.exe")) {
    Write-Error "Node.js not found at $NodePath"
    Write-Host "Please install Node.js from https://nodejs.org/"
    exit 1
}

# Set environment variable
$env:PATH = "$NodePath;$env:PATH"

# Change to project directory
Set-Location $ProjectPath

# Show Node/npm versions
Write-Host "==============================================="
Write-Host "Node.js and npm setup for LP_AI"
Write-Host "==============================================="
& "$NodePath\node.exe" --version
& "$NodePath\npm.cmd" --version
Write-Host ""

# Run npm command
if ($Arguments.Count -eq 0) {
    Write-Host "Usage: .\npm-helper.ps1 [command]"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\npm-helper.ps1 install"
    Write-Host "  .\npm-helper.ps1 run build"
    Write-Host "  .\npm-helper.ps1 run dev"
    Write-Host "  .\npm-helper.ps1 audit fix"
    Write-Host ""
} else {
    Write-Host "Running: npm $($Arguments -join ' ')"
    & "$NodePath\npm.cmd" @Arguments
}
