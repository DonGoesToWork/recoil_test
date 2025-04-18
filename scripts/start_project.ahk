#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

F2::main()
F3::reload
return

create_tab(title, create_tab) {
	Send, cd "E:\Web Dev\loot_quest\scripts"{Enter}
	Sleep 100
	; requires powershell hotkey to be set to rename tabs via ctrl+shift+r
	Send, ^+r
	Sleep 100
	Send, %title%
	Sleep 100
	
	if (create_tab) {
		Send, ^+t
		Sleep 100
	}
}

main() {
	; Open 4 ps tabs and run relevant programs
	Run, powershell.exe
	WinWaitActive, ahk_class CASCADIA_HOSTING_WINDOW_CLASS

	create_tab("Git", true)
	create_tab("Main Backend", true)
	create_tab("Main Frontend", true)
	create_tab("Zero Backend", true)
	create_tab("Zero Frontend", false)
	
	Sleep 100
	Send ^{Tab}
	
	Send, cd "E:\Web Dev\loot_quest\"
	Sleep 10
	Send, {Enter}
	Sleep 100
	Send, git status
	Sleep 10
	Send, {Enter}
	Sleep 10
	Send, ^{Tab}
	Sleep 100

	Send, .\start_main_backend.ps1
	Sleep 10
	Send, {Enter}
	Sleep 10
	Send, ^{Tab}
	Sleep 100

	Send, .\start_main_frontend.ps1
	Sleep 10
	Send, {Enter}
	Sleep 10
	Send, ^{Tab}
	Sleep 100

	Send, .\start_project_zero_backend.ps1
	Sleep 10
	Send, {Enter}
	Sleep 10
	Send, ^{Tab}
	Sleep 100

	Send, .\start_project_zero_frontend.ps1
	Sleep 10
	Send, {Enter}
	
	; Open vs code instances
	Run, open_vs_code_windows.ps1
}
