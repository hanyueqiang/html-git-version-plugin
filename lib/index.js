import config from "./config";
import fs from "fs";
import {resolve} from "path";
import CommitInfo from "./utils/CommitInfo";

/**
 * 输出git信息到前端页面中
 * @params {
 *   showCnName: Boolean | (command, cnName) => String 默认 true  是否显示中文
 *   dir?: .git文件夹所在目录，默认获取命令执行当前目录
 *   supportFiles: [ "index.html" ], 将提交信息输出到文件中，暂时只能输出到html与js文件中 默认: ["index.html"]
 *    commit?: {
 *      desc: Boolean | (String) => String 默认 true 提交内容
 *      date: String | Boolean | (dayjs) => String 默认 true  提交时间
 *      user: Boolean | (userName) => String 默认 true 提交人
 *      hash: Boolean | (hash) => String 默认 true 提交id
 *      tag: Boolean | (tag) => String 默认 true 当前分支
 *      remote: Boolean | (remote) => String 默认 true 仓库地址
 *      gitUrl: Boolean | (gitUrl) => String 默认 true git链接
 *      branch: Boolean | (branch) => String 默认 true 当前分支
 *      email: Boolean | (email) => String 默认 true 提交用户的邮箱
 *    }
 * }
 */
export default class HtmlGitVersionPlugin extends CommitInfo {
  constructor(options = {}) {
    const opts = Object.assign(config, options)
    super(opts)
    this.supportFiles = opts.supportFiles
  }

  async apply(compiler) {
    const info = await this.getCommitInfo();
    let isTipFile = {};
    /**
     * 当文件写入到outputPath时，获取文件内容，将信息添加到文件中重新输出
     */
    compiler.hooks.assetEmitted.tap("HtmlGitVersionPlugin", (file, buffer) => {
      if (/\.html?$/.test(file) || /\.jsx?$/.test(file) || /\.tsx?$/.test(file) || /\.css$/.test(file)) {
        for (let confFile of this.supportFiles) {
          if (new RegExp(confFile).test(file)) {
            let res = ""
            if (confFile.indexOf("html") >= 0) {
              res =
                `<!--${
                  JSON
                    .stringify(info, null, 4)
                    .replace(/^\{/, "")
                    .replace(/\}$/, "")
                }-->\r\n${buffer.toString()}`
            } else if (/\.jsx?$/.test(confFile) || /\.tsx?$/.test(confFile) || /\.css$/.test(confFile)) {
              res =
                `/**${
                  JSON
                    .stringify(info, null, 4)
                    .replace(/^\{/, "")
                    .replace(/\}$/, "")
                }*/\r\n${buffer.toString()}`
            } else {
              if (!isTipFile[`$${confFile}`]) {
                isTipFile[`$${confFile}`] = true;
                console.warn(`[${confFile}]类型的文件暂不支持输出提交信息, 只支持html、js、css文件的信息输出`)
              }
              continue;
            }
            fs.writeFileSync(resolve(compiler.outputPath, file), res)
          }
        }
      }
    });
  }
}
