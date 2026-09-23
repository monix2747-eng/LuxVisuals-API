export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response("LuxVisuals API is online");
    }

    if (url.pathname === "/register" && request.method === "POST") {
      const data = await request.json();

      if (!data.uuid || !data.name) {
        return new Response("Missing uuid or name", { status: 400 });
      }

      await env.LUX_USERS.put(
        "user:" + data.uuid,
        JSON.stringify({
          uuid: data.uuid,
          name: data.name,
          lastSeen: Date.now()
        })
      );

      return Response.json({ success: true });
    }

    if (url.pathname === "/users" && request.method === "GET") {
      const list = await env.LUX_USERS.list({ prefix: "user:" });
      const users = [];

      for (const key of list.keys) {
        const value = await env.LUX_USERS.get(key.name);

        if (value) {
          users.push(JSON.parse(value));
        }
      }

      return Response.json(users);
    }

    if (url.pathname === "/heartbeat" && request.method === "POST") {
      const data = await request.json();

      if (!data.uuid || !data.name) {
        return new Response("Missing uuid or name", { status: 400 });
      }

      await env.LUX_USERS.put(
        "user:" + data.uuid,
        JSON.stringify({
          uuid: data.uuid,
          name: data.name,
          lastSeen: Date.now()
        })
      );

      return Response.json({ success: true });
    }

    return new Response("Not Found", { status: 404 });
  }
};
