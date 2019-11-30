// 引入模块
var COS = require('cos-nodejs-sdk-v5');
// 使用永久密钥创建实例
var cos = new COS({
    SecretId: 'AKIDPbXCbj5C1bz72i7F9oDMHxOaXEgsNX0E',
    SecretKey: '70e2B4g27wWr1wf9ON8ev1rWzC9rKYXH',
});
var version = 'test';
const args = process.argv.slice(2);
version = args[0];

var filepath = 'datizhuanqian-' + version + '.apk';
// 分片上传
cos.sliceUploadFile(
    {
        Bucket: 'dtzq-1251052432',
        Region: 'ap-shanghai',
        Key: filepath,
        FilePath: '../../android/app/build/outputs/apk/release/app-release.apk',
    },
    function(err, data) {
        console.log(err, data);
    },
);
