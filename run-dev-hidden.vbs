' Starts the CalenFlow dev server with no visible window, fully detached
' from any editor/agent session, so it survives restarts.
Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = "C:\Users\user\Dev\CalenFlow"
sh.Run "cmd /c npm run dev > dev-server.log 2>&1", 0, False
