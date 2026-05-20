// functions/auth/[[path]].js
export async function onRequestPost({ request, env }) {
  try {
    const { report, password } = await request.json();
    console.log("收到报告名称:", report);
    console.log("环境变量 PASS_brandonaprilreport =", env.PASS_brandonaprilreport ? "存在" : "不存在");
    console.log("环境变量 PASS_gpitavrenovationreport =", env.PASS_gpitavrenovationreport ? "存在" : "不存在");
    };

    console.log("所有可用 key:", Object.keys(passwords));

    if (!report || !password) {
      return new Response(
        JSON.stringify({ error: "报告名称或密码不能为空" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ====================== 你的报告密码配置 ======================
    // 注意：报告名称必须是小写
    const passwords = {
      brandonaprilreport: env.PASS_brandonaprilreport || "123456",     // ABCD.html 对应的密码
      gpitavrenovationreport: env.PASS_gpitavrenovationreport || "123456",     // QWER.html 对应的密码
      // 如果以后还有其他报告，继续在这里添加，例如：
      // aa: env.PASS_AA || "password_for_aa",
    };

    const correctPass = passwords[report];

    // 密码验证
    if (!correctPass || password !== correctPass) {
      return new Response(
        JSON.stringify({ error: "密码错误，请重试" }), 
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // 验证通过，生成简单 Token 并设置 Cookie
    const token = btoa(report + ":" + Date.now() + ":" + Math.random().toString(36).slice(2));

    return new Response(
      JSON.stringify({
        success: true,
        redirect: `/report/${report}.html`
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `report_auth=${token}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Strict`
        }
      }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "服务器错误" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
