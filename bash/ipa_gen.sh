#!/bin/bash 
red=$'\e[1;31m'
grn=$'\e[1;32m'
yel=$'\e[1;33m'
blu=$'\e[1;34m'
mag=$'\e[1;35m'
cyn=$'\e[1;36m'
end=$'\e[0m'

app="datizhuanqian"

if [ ! -z $1 ]; then
    app=$1
fi

cd /data/app/$app/
sudo chmod -R 777 .

[ ! -d /data/build/app ] && mkdir -p /data/build/app

echo -e "\n${grn}clean $app ...${end}"
xcodebuild clean -UseModernBuildSystem=NO -project /data/app/$app/ios/$app.xcodeproj -configuration  Staging  -alltargets

echo -e "\n${grn}archive $app ...${end}"
xcodebuild archive -UseModernBuildSystem=NO -project "/data/app/$app/ios/$app.xcodeproj" -scheme "$app" -configuration Staging -archivePath "/data/build/app/$app"

echo -e "\n${grn}export ipa $app ...${end}"
xcodebuild -UseModernBuildSystem=NO -exportArchive -archivePath  /data/build/app/$app.xcarchive  -exportPath  /data/build/app/$app  -exportOptionsPlist /data/app/$app/bash/etc/exportOptions.plist

echo -e "\n${grn}最后一步，复制为 /data/build/app/damei.ipa 方便后面上传 ...${end}"
/bin/cp -f /data/build/app/$app/$app.ipa /data/build/app/damei.ipa
