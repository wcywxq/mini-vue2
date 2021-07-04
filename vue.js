import Observer from "./observer.js";
import Compiler from "./compiler.js";

/**
 * 包括 vue 构造函数，接收各种配置参数等
 */
export default class Vue {
  constructor(options = {}) {
    this.$options = options;
    this.$data = options.data;
    this.$methods = options.methods;

    this.initRootElement(options);
    this._proxyData(this.$data);

    // 实例化 Observer 对象，监听数据变化
    new Observer(this.$data);
    // 实例化 Compiler 对象，解析指令和模版表达式
    new Compiler(this);
  }

  /**
   * 获取根元素，并存储到 vue 实例，简单检查一下传入的 el 是否合规
   */
  initRootElement(options) {
    if (typeof options.el === "string") {
      // id / class
      this.$el = document.querySelector(options.el);
    } else if (options.el instanceof HTMLElement) {
      this.$el = options.el;
    }

    if (!this.$el) {
      throw new Error("传入的 el 不合法, 请传入 css selector 或 HTMLElement");
    }
  }

  /**
   * 利用 Object.defineProxy 将 data 的属性注入到 vue 实例中
   */
  _proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newVal) {
          if (data[key] === newVal) {
            return;
          }
          data[key] = newVal;
        }
      });
    });
  }
}
