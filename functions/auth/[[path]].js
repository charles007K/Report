// functions/auth/[[path]].js
// functions/auth/[[path]].js
export async function onRequestPost({ request, env }) {
  try {
    const { report, password } = await request.json();

    if (!report || !password) {
      return new Response(
        JSON.stringify({ error: "报告名称或密码不能为空" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const reportKey = String(report).trim().toLowerCase();
    const inputPassword = String(password).trim();

    const passwords = {
      brandonaprilreport: env.PASS_brandonaprilreport || "123456",
      gpitavrenovationreport: env.PASS_gpitavrenovationreport || "123456",
    };

    console.log("收到报告名称:", reportKey);
    console.log("环境变量 PASS_brandonaprilreport =", env.PASS_brandonaprilreport ? "存在" : "不存在");
    console.log("环境变量 PASS_gpitavrenovationreport =", env.PASS_gpitavrenovationreport ? "存在" : "不存在");
    console.log("所有可用 key:", Object.keys(passwords));

    const correctPass = String(passwords[reportKey] || "").trim();

    if (!correctPass || inputPassword !== correctPass) {
      return new Response(
        JSON.stringify({ error: "密码错误，请重试" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const token = btoa(reportKey + ":" + Date.now() + ":" + Math.random().toString(36).slice(2));

    return new Response(
      JSON.stringify({
        success: true,
        redirect: `/report/${reportKey}.html`
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
