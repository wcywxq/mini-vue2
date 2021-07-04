import Watcher from "./watcher.js";

export default class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.methods = vm.$methods;

    this.compile(vm.$el);
  }

  /** 编译模版  */
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        // 文本节点
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        // 元素节点
        this.compileElement(node);
      }
      // 有子节点，递归调用
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }

  compileText(node) {
    // {{ msg }}
    const reg = /\{\{(.+?)\}\}/;
    const value = node.textContent;

    if (reg.test(value)) {
      // 匹配 msg
      const key = RegExp.$1.trim();
      node.textContent = value.replace(reg, this.vm[key]);

      // 用来响应式的展示
      new Watcher(this.vm, key, newValue => {
        node.textContent = newValue;
      });
    }
  }

  compileElement(node) {
    if (node.attributes.length) {
      Array.from(node.attributes).forEach(attr => {
        // 遍历元素节点的所有属性
        const attrName = attr.name; // v-model v-html v-on:click
        if (this.isDirective(attrName)) {
          let directiveName = attrName.indexOf(":") > -1 ? attrName.substr(5) : attrName.substr(2);
          let key = attr.value;
          this.update(node, key, directiveName);
        }
      });
    }
  }

  /**
   * 更新元素节点
   * @param {*} node
   * @param {*} key
   * @param {*} directiveName 指令名
   */
  update(node, key, directiveName) {
    // v-model v-text v-html v-on:click
    const updateFn = this[directiveName + "Updater"];
    updateFn && updateFn.call(this, node, this.vm[key], key, directiveName);
  }

  /** 解析 v-text */
  textUpdater(node, value, key) {
    node.textContent = value;
    new Watcher(this.vm, key, newValue => {
      node.textContent = newValue;
    });
  }

  /** 解析 v-model */
  modelUpdater(node, value, key) {
    node.value = value;
    new Watcher(this.vm, key, newValue => {
      node.value = newValue;
    });

    // 更新值，双向绑定
    node.addEventListener("input", () => {
      this.vm[key] = node.value;
    });
  }

  /** 解析 v-html */
  htmlUpdater(node, value, key) {
    node.innerHTML = value;
    new Watcher(this.vm, key, newValue => {
      node.innerHTML = newValue;
    });
  }

  /** 解析 v-on */
  clickUpdater(node, value, key, directiveName) {
    node.addEventListener(directiveName, this.methods[key]);
  }

  /**
   * 判断元素属性是否是指令
   */
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }

  /**
   * 判断是否是文本节点
   */
  isTextNode(node) {
    return node.nodeType === 3;
  }

  /**
   * 判断是否是元素节点
   */
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
