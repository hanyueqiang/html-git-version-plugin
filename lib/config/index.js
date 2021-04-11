import commit from "./commit";
import { resolve } from "path";

export default {
  ...commit,
  /**
   * 显示中文名称
   * Boolean | (command, cnName) => String
   * false 不显示
   */
  showCnName: true,
  /**
   * 将提交信息输出的任意文件中，暂时只能输出到html与js文件中
   */
  supportFiles: [ "index.html" ],
  dir: resolve(),
}