import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 引入前台客户端组件
import CreativeWorkshopClient from './CreativeWorkshopClient';

function buildWorkshopItem(fileName: string, data: any, content: string, typeName: string) {
  const realSlug = fileName.replace(/\.md$/, '');

  return {
    id: data.id || realSlug,
    slug: realSlug, // 🌟 强制保留真实的 slug 供路由跳转使用
    title: data.title || '',
    type: typeName,
    date: data.date || '2026-05-01',
    // 🌟 核心修复：把 cover（封面图）提取出来传给前台！如果写的是 image 也兼容
    cover: data.cover || data.image || null,
    // 把正文传给前台，去掉可能存在的换行符，限制长度防止卡片撑爆
    content: content.trim()
  };
}

function getPostItems() {
  const dirPath = path.join(process.cwd(), 'posts');
  try {
    if (!fs.existsSync(dirPath)) return [];

    return fs.readdirSync(dirPath).filter(f => f.endsWith('.md')).map(fileName => {
      const fullPath = path.join(process.cwd(), 'posts', fileName);
      const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
      return buildWorkshopItem(fileName, data, content, 'post');
    });
  } catch (error) {
    console.error('读取 posts 失败:', error);
    return [];
  }
}

function getChatterItems() {
  const dirPath = path.join(process.cwd(), 'chatters');
  try {
    if (!fs.existsSync(dirPath)) return [];

    return fs.readdirSync(dirPath).filter(f => f.endsWith('.md')).map(fileName => {
      const fullPath = path.join(process.cwd(), 'chatters', fileName);
      const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
      return buildWorkshopItem(fileName, data, content, 'chatter');
    });
  } catch (error) {
    console.error('读取 chatters 失败:', error);
    return [];
  }
}

function getMomentItems() {
  const dirPath = path.join(process.cwd(), 'moments');
  try {
    if (!fs.existsSync(dirPath)) return [];

    return fs.readdirSync(dirPath).filter(f => f.endsWith('.md')).map(fileName => {
      const fullPath = path.join(process.cwd(), 'moments', fileName);
      const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
      return buildWorkshopItem(fileName, data, content, 'moment');
    });
  } catch (error) {
    console.error('读取 moments 失败:', error);
    return [];
  }
}

export default function CreativeWorkshopPage() {
  const posts = getPostItems();
  const chatters = getChatterItems();
  const moments = getMomentItems();

  return (
    <CreativeWorkshopClient
      posts={posts}
      chatters={chatters}
      moments={moments}
    />
  );
}
