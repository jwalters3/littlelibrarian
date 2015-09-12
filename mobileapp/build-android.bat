@ECHO OFF
:: Keep variables local
SETLOCAL

IF "%1"=="?" GOTO Syntax
IF "%1"=="-?" GOTO Syntax
IF "%1"=="-h" GOTO Syntax
IF "%1"=="/?" GOTO Syntax

ECHO ------------- COMPILING JS -------------
sencha app build -e package
ECHO ------------- COPYING SENCHA FILES -------------

rmdir /s /q  .\cordova\www\
mkdir .\cordova\www
xcopy /s /y .\build\package\App .\cordova\www\
copy resources\data.json .\cordova\www\resources\

ECHO ------------- COPYING CORDOVA FILES -------------
pushd .\cordova\
REM call cordova -d prepare android
ECHO ------------- BUILDING APK -------------
call cordova build android
IF "%1"=="/d" (  
  ECHO ------------- DEPLOYING -------------
  call adb -d install -r .\platforms\android\build\outputs\apk\android-debug.apk
  popd
)
popd
GOTO End

:Syntax
:: Display help screen
CLS
ECHO BUILD-ANDROID.BAT, Version 0.1
ECHO Written by Jeff Walters
ECHO.
ECHO Usage:  BUILD-ANDROID [ /d ]
ECHO.
ECHO /d	  builds and deploys android package to attached device

:End
ENDLOCAL

