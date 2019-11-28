#!/bin/bash

red=$'\e[1;31m'
grn=$'\e[1;32m'
yel=$'\e[1;33m'
blu=$'\e[1;34m'
mag=$'\e[1;35m'
cyn=$'\e[1;36m'
end=$'\e[0m'

app="datizhuanqian"
upload="no"
if [ ! -z $1 ]; then
    upload="yes"
fi

cd /data/app/$app/
sudo chmod -R 777 .
[ ! -d /data/build/app ] && mkdir -p /data/build/app

if [ $upload != "yes" ]; then
# echo -e "\n${grn}clean $app ...${end}"
# xcodebuild clean -UseModernBuildSystem=YES -workspace /data/app/$app/ios/$app.xcworkspace -scheme "$app"

echo -e "\n${mag}archive $app ...${end}"
xcodebuild archive -UseModernBuildSystem=YES -workspace "/data/app/$app/ios/$app.xcworkspace" -scheme "$app" -archivePath "/data/build/app/$app"

echo -e "\n${grn}export ipa $app ...${end}"
xcodebuild -UseModernBuildSystem=YES -exportArchive -archivePath  /data/build/app/$app.xcarchive  -exportPath  /data/build/app/$app  -exportOptionsPlist /data/app/$app/bash/etc/exportOptions.plist

echo -e "\n${grn}最后一步，复制为 /data/build/app/$app.ipa 方便后面上传 ...${end}"
/bin/cp -f /data/build/app/$app/$app.ipa /data/build/app/$app.ipa
fi 

if [ $upload = "yes" ]; then
echo -e "\n${yel}上传 $app.ipa 到蒲公英...${end}"
curl -F "file=@/data/build/app/$app.ipa" -F "uKey=886ce154bbec732cfb657fd24968fb75" -F "_api_key=7ddece27311d35a058f29e66a8ddccd6" https://qiniu-storage.pgyer.com/apiv1/app/upload
fi