searchAreaX := 1442
searchAreaYStart := 500
searchAreaYEnd := 2000
secondClickX := 882
secondClickY := 385
clickCount := 0
SetDefaultMouseSpeed, 0
Sleep, 2000
Loop {
    PixelSearch, foundX, foundY, %searchAreaX%, %searchAreaYStart%, %searchAreaX%, %searchAreaYEnd%, 0xFEFEFE, 70, Fast RGB
    if (ErrorLevel = 0) {
        MouseMove, %foundX%, %foundY%
        Sleep, 500
        Click
        Sleep, 2000
        MouseMove, %secondClickX%, %secondClickY%
        Sleep, 500
        Click
        clickCount++
        Sleep, 2000
        if (clickCount >= 39) {
            MsgBox, Downloaded 39 Files. Exiting.
            break
        }
    } else {
        MsgBox, White button not found in the specified area. Exiting.
        break
    }
    if GetKeyState("Esc", "P")
        break
}