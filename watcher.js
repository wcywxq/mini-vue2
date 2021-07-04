import Dep from './dep.js';

export default class Watcher {
  /**
   *
   * @param {*} vm Vue 实例
   * @param {*} key data 属性名
   * @param {*} cb 负责更新视图的回调
   */
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    // 同一时间只维持一个 Watcher
    Dep.target = this;

    // 触发 get 方法，在 get 方法里去做一些操作
    this.oldValue = vm[key];

    // 为了避免重复的添加 Watcher, 将其设置为 null
    Dep.target = null;
  }

  /** 当数据变化时，更新视图 */
  update() {
    // 需要判断新旧两个值的关系
    let newValue = this.vm[this.key];
    if (this.oldValue === newValue) {
      return;
    }
    this.cb(newValue);
  }
}
