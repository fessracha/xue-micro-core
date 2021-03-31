var Xue = /** @class */ (function () {
    function Xue(elId, data) {
        var _this = this;
        var _a;
        this.$el = document.getElementById(elId);
        if (!this.$el) {
            throw new Error('Element not defined');
        }
        else {
            this.data = data.data;
            this.initReactive();
            this.renderDom();
        }
        // Demo двухстороннее связывание
        (_a = document.getElementById('test')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', function (e) {
            // @ts-ignore
            _this.data.someTitle = e.target.value;
        });
    }
    Xue.prototype.renderDom = function () {
        console.log('render DOM');
        // wtf typescript? i am already checked $el
        // @ts-ignore
        this.eachNodes(this.$el);
    };
    Xue.prototype.eachNodes = function (node) {
        if ((node).nodeType === 1 && node.children) {
            for (var i = 0; i < node.children.length; i++) {
                this.initDirectives(node.children[i]);
                this.eachNodes(node.children[i]);
            }
        }
    };
    Xue.prototype.initDirectives = function (node) {
        var attributes = node.attributes;
        for (var i = 0; i < attributes.length; i++) {
            var name_1 = attributes[i].name;
            // wtf typescript?? tsc error
            if (name_1.startsWith('x-')) {
                if (name_1 === 'x-text') {
                    this.xTextDirective(node, attributes[i]);
                }
            }
        }
    };
    Xue.prototype.xTextDirective = function (node, attr) {
        node.textContent = this.data[attr.value];
    };
    Xue.prototype.initReactive = function () {
        var _this = this;
        var render = this.renderDom.bind(this);
        Object.keys(this.data).forEach(function (propName) {
            var propVal = _this.data[propName];
            Object.defineProperty(_this.data, propName, {
                get: function () {
                    return propVal;
                },
                set: function (val) {
                    propVal = val;
                    console.log('Reactive', propVal);
                    render();
                }
            });
        });
    };
    return Xue;
}());
new Xue('#summator', {
    data: {
        someTitle: 'some text',
        a: 1
    }
});
