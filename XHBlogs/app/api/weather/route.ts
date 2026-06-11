import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = process.env.QWEATHER_KEY;
  let city = req.headers.get('x-vercel-ip-city') || '';
  let lon = req.headers.get('x-vercel-ip-longitude');
  let lat = req.headers.get('x-vercel-ip-latitude');
  
  if (!city) city = "北京市";
  
  // QWeather v7 /weather/now API strictly requires Coordinates (lon,lat) or LocationID, NOT IP string.
  const locationId = (lon && lat) ? `${lon},${lat}` : "101010100";

  if (!token) {
    console.error("❌ 环境变量 QWEATHER_KEY (Token) 未找到");
    return NextResponse.json({ code: "500", message: "Token missing" }, { status: 500 });
  }

  const apiHosts = [
    'https://devapi.qweather.com/v7/weather/now',
    'https://api.qweather.com/v7/weather/now'
  ];

  for (const host of apiHosts) {
    try {
      const url = `${host}?location=${locationId}&key=${token}`;
      console.log(`📡 尝试请求: ${url.replace(token, '***')}`);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept-Encoding': 'gzip'
        },
        cache: 'no-store'
      });

      const data = await res.json();

      if (data.code === "200" || res.status === 200) {
        console.log(`✅ 认证通过! 来源: ${host}`);
        data.cityName = decodeURIComponent(city);
        return NextResponse.json(data);
      }

      console.warn(`⚠️ ${host} 认证未通过:`, data);

    } catch (err: any) {
      console.error(`🔥 请求 ${host} 出错:`, err.message);
      continue;
    }
  }

  return NextResponse.json({
    code: "500",
    message: "认证协议对接失败，请检查是否在 Vercel 填写了正确的 Token"
  }, { status: 500 });
}