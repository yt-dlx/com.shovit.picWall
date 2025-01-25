searchAreaX := 1440
searchAreaYStart := 500
searchAreaYEnd := 2000
secondClickX := 885
secondClickY := 881
clickCount := 0
SetDefaultMouseSpeed, 0
Sleep, 4000
MouseMove, %secondClickX%, %secondClickY%
Sleep, 100
Click
Sleep, 2000
Loop {
    PixelSearch, foundX, foundY, %searchAreaX%, %searchAreaYStart%, %searchAreaX%, %searchAreaYEnd%, 0xFEFEFE, 70, Fast RGB
    if (ErrorLevel = 0) {
        MouseMove, %foundX%, %foundY%
        Sleep, 100
        Click
        Sleep, 2000
        MouseMove, %secondClickX%, %secondClickY%
        Sleep, 100
        Click
        clickCount++
        Sleep, 2000
        if (clickCount >= 39) {
            MsgBox, Downloaded 40 Files. Exiting.
            break
        }
    } else {
        MsgBox, White button not found in the specified area. Exiting.
        break
    }
    if GetKeyState("Esc", "P")
        break
}
