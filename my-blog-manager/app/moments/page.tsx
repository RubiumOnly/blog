import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Navbar from '../../components/Navbar';
import PageTransition from '../../components/PageTransition';
import MomentList from './MomentList';
import { siteConfig } from '../../siteConfig';

export const metadata = {
  title: "说说 | " + siteConfig.title,
  description: "生活动态与瞬间记录",
};

function buildMomentItem(fileName: string, data: any, content: string) {
  return {
    id: fileName.replace(/\.md$/, ''),
    date: data.date || '1970-01-01',
    location: data.location || '',
    images: data.images || [],
    content: content.trim()
  };
}

function getLegacyMomentItems() {
  const dirPath = path.join(process.cwd(), 'posts', 'moments');
  if (!fs.existsSync(dirPath)) return [];

  return fs.readdirSync(dirPath).filter(f => f.endsWith('.md')).map(fileName => {
    const fullPath = path.join(process.cwd(), 'posts', 'moments', fileName);
    const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
    return buildMomentItem(fileName, data, content);
  });
}

function getMomentItems() {
  const dirPath = path.join(process.cwd(), 'moments');
  if (!fs.existsSync(dirPath)) return [];

  return fs.readdirSync(dirPath).filter(f => f.endsWith('.md')).map(fileName => {
    const fullPath = path.join(process.cwd(), 'moments', fileName);
    const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
    return buildMomentItem(fileName, data, content);
  });
}

export default function MomentsPage() {
  let allMoments: any[] = [];

  try {
    allMoments = [...getLegacyMomentItems(), ...getMomentItems()];
    // 去重，防止你在两个文件夹放了同名文件
    allMoments = Array.from(new Map(allMoments.map(item => [item.id, item])).values());

  } catch (e) {
    console.error("读取说说数据失败:", e);
  }

  return (
    <div className="min-h-screen relative pb-10 flex flex-col">
      <Navbar />
      <PageTransition className="flex-1 flex flex-col">
        <MomentList
          moments={allMoments}
          authorName={siteConfig.authorName}
          avatarUrl={siteConfig.avatarUrl}
        />
      </PageTransition>
    </div>
  );
}
