"use client";

import { useState, useEffect } from "react";
import { siteConfig } from "../siteConfig";

export default function GlobalBackground() {
  const [index, setIndex] = useState(0);
  const [useGradient, setUseGradient] = useState<boolean>(
    siteConfig.useGradient !== undefined ? siteConfig.useGradient : false
  );
  const [bgImages, setBgImages] = useState<string[]>(siteConfig.bgImages || []);
  const [themeColors, setThemeColors] = useState<string[]>(
    siteConfig.themeColors || ["#0ea5e9", "#14b8a6", "#f59e0b", "#f43f5e"]
  );

  // 轮播定时器（仅当为壁纸模式且有多张图时启动）
  useEffect(() => {
    if (useGradient || bgImages.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % bgImages.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [useGradient, bgImages.length]);

  return (
    <>
      {!useGradient && bgImages.length > 0 ? (
        // 🖼️ 【壁纸模式】：高清壁纸轮播 + 轻透保护蒙层，绝不模糊壁纸
        <>
          <div className="absolute inset-0 z-[-10] overflow-hidden">
            {bgImages.map((img, i) => (
              <div
                key={img}
                className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out transform-gpu bg-cover bg-center"
                style={{
                  backgroundImage: `url("${img}")`,
                  opacity: i === index ? 1 : 0,
                  visibility:
                    Math.abs(i - index) <= 1 || (i === bgImages.length - 1 && index === 0)
                      ? "visible"
                      : "hidden",
                }}
              />
            ))}
          </div>
          {/* 轻透蒙层：保证前景文字与卡片易读，同时保持壁纸清晰纯净 */}
          <div className="absolute inset-0 z-[-5] bg-white/25 dark:bg-slate-950/45 transition-colors duration-1000 pointer-events-none" />
        </>
      ) : (
        // 🎨 【极光渐变模式】：色彩流动光斑
        <>
          <div className="absolute inset-0 z-[-9] bg-white/30 dark:bg-slate-900/40 backdrop-blur-md transition-colors duration-1000" />
          <div
            className="absolute inset-0 z-[-8] opacity-60 dark:opacity-20 mix-blend-color transition-opacity duration-1000 transform-gpu"
            style={{
              background: `linear-gradient(-45deg, ${themeColors.join(", ")})`,
              backgroundSize: "400% 400%",
              animation: "gradientMove 15s ease infinite",
            }}
          />
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/40 dark:bg-indigo-900/20 blur-[100px] rounded-full z-[-7] md:mix-blend-overlay" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/30 dark:bg-purple-900/30 blur-[100px] rounded-full z-[-7] md:mix-blend-overlay" />
        </>
      )}
    </>
  );
}
