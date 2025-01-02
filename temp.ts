import * as fs from 'fs';

// 定義一個物件來儲存鍵值對
const data: { [key: string]: number } = {};

// 生成鍵從 "1" 到 "1000" 的 JSON 物件
for (let i = 1; i <= 1000; i++) {
    data[i.toString()] = 99;
}

// 將 JSON 物件寫入檔案
fs.writeFile('output.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
        console.error('寫入檔案時發生錯誤', err);
        return;
    }
    console.log('JSON 檔案已成功生成！');
});