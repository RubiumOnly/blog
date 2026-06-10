// 🛡️ 本文件由 RubiumOnly 控制台自动生成，请勿手动修改
export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = [
  {
    "id": "daily-notes",
    "title": "日常片段",
    "description": "这里将会收集 RubiumOnly 的照片与记录。",
    "cover": "/siamese-cat.png",
    "date": "2026.06",
    "photos": [
      {
        "url": "/siamese-cat.png",
        "caption": "等待替换为你的照片"
      }
    ]
  }
];
