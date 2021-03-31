type TXueElement = HTMLElement;

class Xue {
  $el: HTMLElement | null;
  data: any;
  
  constructor(elId: string, data: any) {
    this.$el = document.getElementById(elId);
    if(!this.$el) {
      throw new Error('Element not defined');
    } else {
      this.data = data.data;
      this.initReactive();
      this.renderDom();
    }
    
    // Demo двухстороннее связывание
    document.getElementById('test')?.addEventListener('input', (e: Event) => {
      // @ts-ignore
      this.data.someTitle = e.target.value;
    })
  }

  private renderDom(): void {
    console.log('render DOM');
    // wtf typescript? i am already checked $el
    // @ts-ignore
    this.eachNodes(this.$el);
  }

  private eachNodes(node: HTMLElement | Element) {
    if((node).nodeType === 1 && node.children) {
      for(let i=0; i < node.children.length; i++) {
        this.initDirectives(node.children[i]);
        this.eachNodes(node.children[i]);
      }
    } 
  }

  private initDirectives(node: Element) {
    const { attributes } = node;

    for(let i=0; i < attributes.length; i++) {
      const { name } = attributes[i];
      // wtf typescript?? tsc error
      if(name.startsWith('x-')) {
        if(name === 'x-text') {
          this.xTextDirective(node, attributes[i]);
        }
      }
    }
  }

  private xTextDirective(node: any, attr: any) {
    node.textContent = this.data[attr.value]
  }

  private initReactive() {
    let render = this.renderDom.bind(this);

    Object.keys(this.data).forEach(propName => {
      let propVal = this.data[propName];

      Object.defineProperty(this.data, propName, {
        get: function() {
          return propVal;
        },
        set: function(val) {
          propVal = val;
          console.log('Reactive', propVal);
          render();
        }
      });
    })
  }
}

new Xue('#summator', {
  data: {
    someTitle: 'some text',
    a: 1,
  }
})