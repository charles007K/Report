// functions/_middleware.js
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  
  // 只保护 /report/ 目录下的页面
  if (!url.pathname.startsWith('/report/')) {
    return next();
  }

  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.match(/report_auth=([^;]+)/);

  if (!match) {
    return Response.redirect(url.origin, 302);
  }

  const token = match[1];
  try {
    const decoded = atob(token);
    const [report] = decoded.split(':');

    // 检查当前访问的页面是否和授权的报告一致
    if (!report || !url.pathname.toLowerCase().includes(report)) {
      return Response.redirect(url.origin, 302);
    }
  } catch (e) {
    return Response.redirect(url.origin, 302);
  }

  return next();
}
