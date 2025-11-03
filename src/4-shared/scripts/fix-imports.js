const fs = require("fs");
const path = require("path");

const exts = [".ts", ".tsx", ".js", ".jsx"];
const targetRegex =
  /import\s+\{\s*supabase\s*\}\s+from\s+["'][.\/\\]+(?:[\w-]+\/)*4-shared\/api\/supabaseClient(\.ts|\.js)?["'];?/g;
const replacement = `import { supabase } from "@/4-shared/api/supabaseClient";`;

function walkAndFix(dir) {
  fs.readdirSync(dir).forEach((f) => {
    const join = path.join(dir, f);
    if (fs.lstatSync(join).isDirectory()) walkAndFix(join);
    else if (exts.includes(path.extname(f))) {
      let txt = fs.readFileSync(join, "utf8");
      if (targetRegex.test(txt)) {
        const fixed = txt.replace(targetRegex, replacement);
        fs.writeFileSync(join, fixed, "utf8");
        console.log(`Fixed imports in: ${join}`);
      }
    }
  });
}

walkAndFix(process.cwd());
