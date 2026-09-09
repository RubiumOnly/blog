// 🛡️ 本文件由 RubiumOnly 控制台自动生成，请勿手动修改
export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title?: string; description?: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = [
  {
    "id": "album_1788932956563",
    "photos": [
      {
        "url": "https://cdn.jsdelivr.net/gh/RubiumOnly/blog-images@main/images/2026/09/09/cc2b673c-7350ec7c0d2a93777caefb89892f577e1955897084.jpg"
      },
      {
        "url": "https://cdn.jsdelivr.net/gh/RubiumOnly/blog-images@main/images/2026/09/09/61ca0d23-202566a0c68ab47bd613acd7bb744e6e1955897084.jpg"
      }
    ],
    "date": "2026-09-09",
    "cover": "https://cdn.jsdelivr.net/gh/RubiumOnly/blog-images@main/images/2026/09/09/3c3bcaba-202566a0c68ab47bd613acd7bb744e6e1955897084.jpg",
    "title": "游戏截图"
  },
  {
    "id": "daily-notes",
    "title": "日常片段",
    "description": "这里将会收集 RubiumOnly 的照片与记录。",
    "cover": "/siamese-cat.png",
    "date": "2026.06",
    "photos": []
  }
];