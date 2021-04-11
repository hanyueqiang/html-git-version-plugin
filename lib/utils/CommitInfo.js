import {isBoolean, isFunction, isString} from "./validate";
import dayjs from "dayjs";

const LCL = require('last-commit-log');

/**
 * 映射参数到git提交内容
 * @type {{date: string, tag: string, remote: string, user: string, gitUrl: string, branch: string, hash: string, email: string, desc: string}}
 */
const mapCommand = {
  desc: { command: "subject", title: "提交信息" },
  date:  { command: "committer.date", title: "提交日期" },
  user:  { command: "committer.name", title: "提交人" },
  hash: { command: "shortHash", title: "提交ID" },
  tag:  { command: "gitTag", title: "当前分支" },
  remote: { command: "gitRemote", title: "仓库地址" },
  gitUrl: { command: "gitUrl", title: "仓库链接" },
  branch:  { command: "gitBranch", title: "当前分支" },
  email:  { command: "author.email", title: "邮箱地址" },
}

export default class CommitInfo extends LCL{
  constructor({ dir, commit, showCnName }) {
    super(dir);
    this.commitLog = commit || {}
    this.showCnName = showCnName;
  }

  getCnName(command, cnName) {
    if (this.showCnName) {
      if (isFunction(this.showCnName)) {
        return this.showCnName(command, cnName) || cnName
      }
      return cnName
    };
    return command
  }
  async getCommitInfo() {
    // 获取提交信息
    const info = await super.getLastCommit();
    let result = {};
    // 获取提交配置
    for (let com in this.commitLog) {
      // 从映射表里获取当前命令
      const { command, title = "" } = mapCommand[com];
      // 查不到命令时跳过循环
      if (!command) continue;
      // 定义结果内容
      let res = "";
      // 解析 xxx.xxx命令
      if (command.indexOf(".") >= 0) {
        const [ firstCommand, lastCommand ] = command.split(".");
        res = info[firstCommand][lastCommand];
      } else {
        res = info[command];
      }

      // 当参数为函数时，返回用户自定义内容
      // 当date为函数时，函数回调是dayjs对象
      // 回调必须有返回值，否则不显示
      if (isFunction(this.commitLog[com])) {
        const fnRes = this.commitLog[com](com === "date" ? dayjs(res * 1000) : res);
        if (fnRes) {
          result[this.getCnName(com, title)] = fnRes
        } else {
          console.warn(`由于[${com}]命令的回调函数没有返回值，所以不进行输出`)
        }
      }
      // 当参数为布尔值时，直接返回原始信息
      // 当date为字符串时，返回format后的内容
      // 当参数为字符串时，返回字符串内容
      else if (isBoolean(this.commitLog[com])) {
        if (this.commitLog[com]) {
          result[this.getCnName(com, title)] = res;
        }
      } else if (isString(this.commitLog[com]) && com === "date") {
        result[this.getCnName(com, title)] = dayjs(res * 1000).format(this.commitLog[com] || "YYYY-MM-DD");
      }
    }
    return result
  }

}
