firstButtonX := 1137
firstButtonY := 1000
secondButtonX := 1269
secondButtonY := 557
clickCount := 0
SetDefaultMouseSpeed, 0
Sleep, 4000
Loop {
    if GetKeyState("Esc", "P") {
        MsgBox, Script stopped by user. Exiting.
        break
    }
    MouseMove, %firstButtonX%, %firstButtonY%
    Sleep, 50
    Click
    Sleep, 50
    MouseMove, %secondButtonX%, %secondButtonY%
    Sleep, 50
    Click
    clickCount++
    Sleep, 50
    if (clickCount >= 400) {
        MsgBox, Downloaded 400 Files. Exiting.
        break
    }
}