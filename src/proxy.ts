import http from "http";
import https from "https";
import url from "url";

export default function (
  clientReq: http.IncomingMessage,
  clientRes: http.ServerResponse
) {
  try {
    const parsedUrl = url.parse(clientReq.url || "/", true);
    if (parsedUrl.query.target && !Array.isArray(parsedUrl.query.target)) {
      const lib = parsedUrl.query.target.startsWith("https") ? https : http;
      console.log(parsedUrl.query.target);
      lib
        .get(parsedUrl.query.target, (backendRes) => {
          let unsentBytes = "";
          clientRes.writeHead(200, { "content-type": "text/plain" });
          backendRes.on("data", (chunk) => {
            unsentBytes += chunk;
            const lengthToSend = Math.floor(unsentBytes.length / 3) * 3;
            const bytesToSend = unsentBytes.slice(0, lengthToSend);
            unsentBytes = unsentBytes.slice(lengthToSend);
            clientRes.write(Buffer.from(bytesToSend).toString("base64"));
            console.log(
              `  Sent ${lengthToSend} bytes, ${unsentBytes.length} remain`
            );
          });
          backendRes.on("end", () => {
            clientRes.end(Buffer.from(unsentBytes).toString("base64"));
            console.log(`  Sent final ${unsentBytes.length} bytes`);
          });
        })
        .on("error", (err) => {
          console.error("  Backend Error", err);
          clientRes.writeHead(502, { "content-type": "text/plain" });
          clientRes.end("502: Backend error");
        });
    } else {
      clientRes.writeHead(400, { "content-type": "text/plain" });
      clientRes.end("Provide single url in target query parameter");
    }
  } catch (err) {
    console.log("  Processing error", err);
    clientRes.writeHead(500, { "content-type": "text/plain" });
    clientRes.end("500: Processing error");
  }
}
