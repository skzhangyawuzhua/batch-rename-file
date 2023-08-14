// const process = require("process");
// const readline = require("node:readline");

import * as fs from "node:fs";
import * as path from "node:path";

import { input, confirm } from "@inquirer/prompts";

const rulesList = [
  // 剧名.E13.2008.DVDRip.x264.AC3-CMCT.mkv
  /E(\d{2})/,
  // 40 - 40、剧名.flv
  /^(\d+)*/,
];

const extensionRule = /\w+$/;

const main = async () => {
  try {
    let customRule: RegExp | undefined;
    let subRule: 0 | 1 = 1;

    const _in = await input({ message: "请输入/拖入文件夹路径\n" });

    if (!_in) {
      throw new Error("请输入有效路径");
    }

    const ifCustomRule = await confirm({
      message: "是否使用自定义正则以匹配编号/集数\n",
      default: false,
    });

    if (ifCustomRule) {
      let ruleInput = await input({
        message:
          "请输入有效的正则表达式\n 例如 【高清电影】46.mp4 -> \\d+\\w+ \n",
      });

      customRule = new RegExp(ruleInput);

      const subRuleInput = await confirm({
        message: "该正则是否通过小括号提取表达式\n",
      });

      if (!subRuleInput) {
        subRule = 0;
      }
    }

    const basename = await input({ message: "请输入重命名后的文件名\n" });

    if (!basename) {
      throw new Error("请输入有效重命名后的文件名");
    }

    const dir = _in.trim();

    const files = fs.readdirSync(path.resolve(dir));

    const reg = customRule || rulesList[0];

    console.log("\x1B[31m%s\x1B[0m", `使用的正则为 ${reg}`);

    files.forEach(file => {
      const filePath = path.resolve(dir, file);

      //通过输入的自定义正则或ruleList的匹配模式来匹配集数
      const match = file.match(reg);

      if (match) {
        console.log(`匹配到的集数: ${match[subRule]}`);

        const extension = file.match(extensionRule);

        console.log(`匹配到的扩展名: ${extension}`);

        fs.renameSync(
          filePath,
          path.resolve(dir, `${basename}.${match[subRule]}.${extension}`)
        );

        return;
      }

      console.log("\x1B[31m%s\x1B[0m", `${file} 没有被匹配到编号/集数\n`);
    });
  } catch (e) {
    console.log((e as Error).message);
  }
};

main();
