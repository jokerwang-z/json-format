# 简单的JSON格式化工具

例子：

```
var json = [
  {
    "name": "xiaoming",
    "age": 19
  },
  {
    "money": 44,
    "array": [
      1,2,3
    ]
  }
];
var jsonObject = JSON.parse(json);
this.jsonFormat = new JSONFormatter(document.body);
this.jsonFormat.format(jsonObject);
```

![markdown](https://www.mdeditor.com/images/logos/markdown.png "90")

