import Compile from './compile'
import {
    observe
} from './observer'

class myVue {
    constructor(options) {
        this.data = options.data;
        this.methods = options.methods;

        Object.keys(this.data).forEach( (key)=> {
            this.proxyKeys(key);
        });
        
        // 重新定义this.data数据，用defineProperty重新定义数据
        observe(this.data);
        
        // 创建编译模板以及编译赋值
        new Compile(options.el, this);
        
        // 执行声明周期函数
        options.mounted.call(this); // 所有事情处理好后执行mounted函数
    }

    proxyKeys (key) {
        // 通过代理this可以直接访问data的数据
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get() {
                return this.data[key];
            },
            set(newVal) {
                this.data[key] = newVal;
            }
        });
    }
}

new myVue({
    el: '#app',
    data: {
        title: 'hello world',
        name: 'canfoo'
    },
    methods: {
        clickMe: function () {
            this.title = 'hello world';
        }
    },
    mounted: function () {
        window.setTimeout(() => {
            this.title = '你好';
        }, 1000);
    }
});