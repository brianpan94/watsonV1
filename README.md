# 說明
watson service for *node version v10.19.0*

## 設定
1. 複製configs.example並更改資料夾名稱。
   
2. 進入/configs設定assistant參數，設定內容如下：
```yaml
assistant:
  - name: 'name'                       # skill名稱
    url: https://example.com/          # skill URL
    apiKey: apiKey                     # skill APIKey
    workspaceID: workspaceID           # skill Workspace ID
```   
3. 複製.env.example並更改檔案名稱。 
   
4. 進入.env檔設定環境參數，設定內容如下：
```console
# PORT
PORT=                                  # PORT Number
```

## 使用
1. 在前述第五點之PORT參數指定埠口請求API，如：
```console
localhost:3001/assistant/conversation
```
2. req.body中需包含： userID, text, contextData
```json
{
    "userID": "使用者ID",
    "text": "你想說的話",
    "contextData": "conversationID 或 前次對話紀錄"
}
```
4. 最後可得到res範例：
```json
{
    "skill": "會計",
    "intents": [
        {
            "intent": "補助項目",
            "confidence": 1
        }
    ],
    "entities": [],
    "input": {
        "text": "補助"
    },
    "output": {
        "generic": [
            {
                "response_type": "text",
                "text": "{ \"ansId\": \"AA-01\" } "
            }
        ],
        "text": [
            "{ \"ansId\": \"AA-01\" } "
        ],
        "nodes_visited": [
            "node_1_123"
        ],
        "log_messages": []
    },
    "user_id": "1234"
}
```

## 其他
Watson Assistant詳細內容可參考[官方API文件](https://cloud.ibm.com/apidocs/assistant-v1)