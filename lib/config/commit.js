export default {
  /**
   * 提交信息回显
   * Boolean | (commitDesc) => String
   * false不显示
   */
  desc: true,

  /**
   * 提交时间
   * Boolean | (commitDate) => Date
   * false 不显示
   */
  date: "YYYY-MM-DD",

  /**
   * 提交人
   * Boolean | (commonUser) => String
   * false 不显示
   */
  user: true,

  /**
   * 提交hash值
   * Boolean | (commitHash) => String
   * false 不显示
   */
  hash: true,

  /**
   * 显示标签
   * Boolean | (tag) => String
   * false 不显示
   */
  tag: true,

  /**
   * 仓库地址
   * Boolean | (remote) => String
   * false 不显示
   */
  remote: false,

  /**
   * 仓库链接
   * Boolean | (gitUrl) => String
   * false 不显示
   */
  gitUrl: false,

  /**
   * 分支
   * Boolean | (branch) => String
   * false 不显示
   */
  branch: false,

  /**
   * 提交人的email
   * Boolean | (email) => String
   * false 不显示
   */
  email: false,
}
