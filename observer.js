import Dep from "./dep.js";

export default class Observer {
  constructor(data) {
    this.traverse(data);
  }

  /**
   * 递归遍历 data 里的所有属性
   */
  traverse(data) {
    if (!data || typeof data !== "object") return;
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    });
  }

  /**
   * 数据劫持，给传入的数据设置 getter/setter
   */
  defineReactive(obj, key, val) {
    // val 可能是 object
    this.traverse(val);

    const that = this;
    // Dep 在此处实例化, 因为要在 setter 中调用 dep.notify()
    const dep = new Dep();

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 获取的时候收集依赖
        Dep.target && dep.addSub(Dep.target); // Dep.target 就是为了在此处添加依赖收集用的，添加之后就可以删除了，所以为 null
        return val;
      },
      set(newValue) {
          if (newValue === val) {
              return;
          }
          val = newValue;
          // 设置的时候可能设置了一个对象，因此要递归
          that.traverse(newValue);
          // 最后发送通知
          dep.notify();
      }
    });
  }
}
