// 當網頁載入完成後執行
document.addEventListener('DOMContentLoaded', () => {
    // 取得 HTML 中的按鈕與訊息元素
    const button = document.getElementById('interactive-btn');
    const message = document.getElementById('response-message');
    
    // 追蹤按鈕點擊狀態的變數
    let clickCount = 0;

    // 監聽按鈕的點擊事件
    button.addEventListener('click', () => {
        clickCount++;
        
        // 在瀏覽器的開發者工具 (Console) 中印出訊息，方便初學者學習偵錯
        console.log(`按鈕被點擊了！目前累計次數：${clickCount}`);
        
        // 顯示回饋訊息
        message.classList.add('show');
        
        // 根據點擊次數更換不同的鼓勵文字
        if (clickCount === 1) {
            message.textContent = '恭喜！你成功觸發了 JavaScript 互動效果！🎉';
        } else if (clickCount === 3) {
            message.textContent = '哇！你點了 3 次！看來你對寫程式很有興趣呢！💡';
        } else if (clickCount === 5) {
            message.textContent = '太厲害了！你已經點了 5 次！程式大師就是你！🏆';
        }
        
        // 按鈕點擊時的微小震動/縮放效果 (透過 JS 動態加上類別，隨後移除)
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'none';
        }, 100);
    });
});
