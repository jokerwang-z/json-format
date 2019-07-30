function JSONFormatter(dom) {
  if (!this instanceof JSONFormatter) {
    return new JSONFormatter(dom);
  }

  this.structure = 'structure-';
  this.closeIcon = '<svg t="1564458467154" class="icon" viewBox="0 -200 1024 1224" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5087" width="16" height="16"><path d="M904 64c30.9 0 56 25.1 56 56v784c0 30.9-25.1 56-56 56H120c-30.9 0-56-25.1-56-56V120c0-30.9 25.1-56 56-56h784m0-64H120C53.7 0 0 53.7 0 120v784c0 66.3 53.7 120 120 120h784c66.3 0 120-53.7 120-120V120c0-66.3-53.7-120-120-120z" fill="#1296db" p-id="5088"></path><path d="M736 480H288c-17.7 0-32 14.3-32 32s14.3 32 32 32h448c17.7 0 32-14.3 32-32s-14.3-32-32-32z" fill="#1296db" p-id="5089"></path></svg>';
  this.openIcon = '<svg t="1564457800369" class="icon" viewBox="0 -200 1024 1224" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5092" width="16" height="16"><path d="M915.746268 0h-807.911811C48.273134 0 0 48.482772 0 107.834457v807.911811c0 59.561323 48.482772 107.834457 107.834457 107.834456h807.911811c59.561323 0 107.834457-48.482772 107.834456-107.834456v-807.911811c0-59.343622-48.482772-107.834457-107.834456-107.834457z m56.634456 915.746268c0 31.139276-25.495181 56.634457-56.634456 56.634456h-807.911811c-31.139276 0-56.634457-25.495181-56.634457-56.634456v-807.911811c0-31.139276 25.495181-56.634457 56.634457-56.634457h807.911811c31.139276 0 56.634457 25.495181 56.634456 56.634457v807.911811z m-267.288189-429.451087H537.293606V318.488189a25.688693 25.688693 0 0 0-25.704819-25.704819A25.688693 25.688693 0 0 0 485.875906 318.488189v167.806992H318.068913c-14.215055 0-25.704819 11.497827-25.704819 25.495181a25.688693 25.688693 0 0 0 25.704819 25.704819H485.875906v167.806992a25.688693 25.688693 0 0 0 25.704818 25.704819 25.688693 25.688693 0 0 0 25.704819-25.704819V537.495181H705.108661a25.688693 25.688693 0 0 0 25.704819-25.704819c0-14.206992-11.497827-25.495181-25.704819-25.495181z" fill="#1296db" p-id="5093"></path></svg>';
  this.dom = dom;

  this.clear();

  this.fragment = document.createDocumentFragment();
  this.box = document.createElement('div');
  this.dom.appendChild(this.box);

  this.listenExpand();
};

JSONFormatter.prototype.listenExpand = function () {
  const openIcon = this.openIcon;
  const closeIcon = this.closeIcon;
  this.box.addEventListener('click', function (e) {
    const nodeName = e.target.nodeName.toLowerCase();
    if (nodeName === 'svg' || nodeName === 'i') {
      const target = nodeName === 'svg' ? e.target.parentNode : e.target; // i
      const p = target.parentNode;
      const className = p.className;

      let div = document.createElement('div');
      let matched = [];


      function nextClose(node) {
        let currentNode = node.nextSibling;
        if (!currentNode) {
          return;
        }
        if (currentNode.className == className) {
          let frag = document.createDocumentFragment();
          let i = 0;
          while (i < matched.length) {
            frag.appendChild(matched[i]);
            i++;
          }
          div.style.cssText = 'display:none;!important';
          div.className = 'hidden';
          div.appendChild(frag);

          p.parentNode.insertBefore(div, currentNode);

          target.innerHTML = openIcon;
        } else {
          matched.push(currentNode);
          nextClose(currentNode);
        }
      }
      function nextOpen(node) {
        let currentNode = p.nextSibling;
        if (!currentNode) {
          return;
        }
        currentNode.outerHTML = currentNode.innerHTML;
        target.innerHTML = closeIcon;
      }

      if (p && p.nextSibling && p.nextSibling.className == 'hidden') {
        // open
        nextOpen(p);
      } else {
        // close
        nextClose(p);
      }

    }
  }, false);
}

JSONFormatter.prototype.getTag = function (value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return Object.prototype.toString.call(value)
}
JSONFormatter.prototype.isObject = function (value) {
  return this.getTag(value) === '[object Object]';
}
JSONFormatter.prototype.isArray = function (value) {
  return this.getTag(value) === '[object Array]';
}
JSONFormatter.prototype.appendToFragment = function (type, text, noBr, className, icon) {
  let dom = document.createElement(type);
  dom.innerHTML = text;

  if (icon) {
    let i = document.createElement('i');
    i.innerHTML = icon;
    i.style.cssText = 'cursor:pointer;font-style:normal;';
    dom.appendChild(i);
  }

  if (className) {
    dom.className = className;
  }

  this.fragment.appendChild(dom);
  if (noBr) {
    return;
  }
  let br = document.createElement('br');
  this.fragment.appendChild(br);
}
JSONFormatter.prototype.getKeyValueStr = function (key, value, padding, nbsp) {
  let str = '';
  // 边距
  for (let k = 0; k < padding; k++) {
    str += nbsp;
  }
  //
  str += "\"" + key + "\"" + ':';
  if (this.getTag(value) === '[object String]') {
    str += "\"" + value + "\"";
  } else {
    str += value;
  }

  return str;
}
JSONFormatter.prototype.getKeyStr = function (key, padding, nbsp) {
  let str = '';
  // 边距
  for (let k = 0; k < padding; k++) {
    str += nbsp;
  }
  //
  str += "\"" + key + "\"" + ':';

  return str;
}
JSONFormatter.prototype.getValue = function (value, padding, nbsp) {
  let str = '';
  // 边距
  for (let k = 0; k < padding; k++) {
    str += nbsp;
  }
  //
  if (this.getTag(value) === '[object String]') {
    // if ((value+'').length) {
    str += "\"" + value + "\""
    // }
  } else {
    str += value;
  }
  return str;
}
JSONFormatter.prototype.getSign = function (sign, padding, nbsp) {
  let str = '';
  // 边距
  for (let k = 0; k < padding; k++) {
    str += nbsp;
  }
  str += sign;
  return str;
}
JSONFormatter.prototype.format = function (json) {
  const nbsp = '&nbsp;&nbsp;';
  let padding = 0;
  // 处理 {[]} 问题
  const OBJECT_NEXT_ARRAY = 'object-next-array';
  // 处理 [{}] 问题
  const ARRAY_NEXT_OBJECT = 'array-next-object';
  // 处理 [[],[]] 问题
  const ARRAT_SIBLING_DOT = 'array-sibling-dot';
  // 处理 {{},{}} 问题
  const OBJECT_SIBLING_DOT = 'object-sibling-dot';
  //
  const FIRST_ARRAY = 'first-array';
  const FIRST_OBJECT = 'first-object';
  //
  let increment = 0;

  let fun = (json, hack, isLast) => {
    if (this.isArray(json)) {
      // []该情况
      if (json.length == 0) {
        // json.push('');
        if (hack === OBJECT_NEXT_ARRAY) {
          if (isLast) {
            this.appendToFragment('span', '[]', false, '');
          } else {
            this.appendToFragment('span', '[],', false, '');
          }
        } else if (hack === ARRAT_SIBLING_DOT) {
          this.appendToFragment('span', this.getSign('', padding - 2, nbsp), true, '');
          this.appendToFragment('span', '[],', false, '');
        } else {
          this.appendToFragment('span', this.getSign('', padding - 2, nbsp), true, '');
          this.appendToFragment('span', '[]', false, '');
        }
        padding -= 2;
      }
      for (let i = 0; i < json.length; i++) {
        const value = json[i];
        // 增加左括号
        if (i == 0) {
          increment++;
          if (hack === OBJECT_NEXT_ARRAY) {
            this.appendToFragment('span', '[', false, this.structure + increment, this.closeIcon);
          } else {
            this.appendToFragment('span', this.getSign('', padding - 2, nbsp), true, '');
            this.appendToFragment('span', '[', false, this.structure + increment, this.closeIcon);
          }
        }

        if (hack === FIRST_ARRAY && i == 0) {
          padding += 2;
        }

        if (this.isArray(value)) {
          padding += 2;
          if (i < json.length - 1) {
            fun(value, ARRAT_SIBLING_DOT);
          } else {
            fun(value);
          }
        } else if (this.isObject(value)) {
          padding += 2;
          fun(value, ARRAY_NEXT_OBJECT);
        } else {
          // 增加值
          let str = this.getValue(value, padding, nbsp);
          if (i < json.length - 1) {
            str += ',';
          }
          this.appendToFragment('span', str, false);
        }
        // 增加右括号
        if (i == json.length - 1) {
          padding -= 2;
          this.appendToFragment('span', this.getSign('', padding, nbsp), true, '');
          if (hack === ARRAT_SIBLING_DOT) {
            this.appendToFragment('span', ']', true, this.structure + increment);
            this.appendToFragment('span', ',', false, '');
          } else {
            this.appendToFragment('span', ']', false, this.structure + increment);
          }
          increment--;
        }
      }
    } else if (this.isObject(json)) {
      const keys = Object.keys(json);
      // {}该情况
      if (keys.length === 0) {
        if (hack === OBJECT_SIBLING_DOT) {
          this.appendToFragment('span', '{},', false, '');
        } else if (hack === ARRAY_NEXT_OBJECT) {
          this.appendToFragment('span', this.getSign('{},', padding - 2, nbsp), false, '');
          padding -= 2;
        } else {
          this.appendToFragment('span', '{}', false, '');
        }

      }
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = json[key];

        // 增加左大括号
        if (i == 0) {
          increment++;
          if (hack === ARRAY_NEXT_OBJECT) {
            this.appendToFragment('span', this.getSign('', padding - 2, nbsp), true, '');
            this.appendToFragment('span', '{', false, this.structure + increment, this.closeIcon);
          } else {
            this.appendToFragment('span', '', true, '');
            this.appendToFragment('span', '{', false, this.structure + increment, this.closeIcon);
          }
        }

        //
        if (hack === FIRST_OBJECT && i === 0) {
          padding += 2;
        }

        if (this.isObject(value)) {

          let str = this.getKeyStr(key, padding, nbsp);
          this.appendToFragment('span', str, true);

          // {} 该情况不加padding
          if (Object.keys(value).length) {
            padding += 2;
          }

          if (i < keys.length - 1) {
            fun(value, OBJECT_SIBLING_DOT)
          } else {
            fun(value);
          }

        } else if (this.isArray(value)) {

          let str = this.getKeyStr(key, padding, nbsp);
          this.appendToFragment('span', str, true);

          padding += 2;
          if (i === keys.length - 1) {
            fun(value, OBJECT_NEXT_ARRAY, true); // 处理 {arr:    []} 问题
          } else {
            fun(value, OBJECT_NEXT_ARRAY); // 处理 {arr:    []} 问题
          }

        } else {
          // 增加键值
          let str = this.getKeyValueStr(key, value, padding, nbsp);
          if (i < keys.length - 1) {
            str += ',';
          }
          this.appendToFragment('span', str, false);
        }

        // 增加右大括号
        if (i == keys.length - 1) {
          padding -= 2;
          if (hack === OBJECT_SIBLING_DOT) {
            this.appendToFragment('span', this.getSign('', padding, nbsp), true, '');
            this.appendToFragment('span', '}', true, this.structure + increment);
            this.appendToFragment('span', ',', false, '');
          } else {
            this.appendToFragment('span', this.getSign('', padding, nbsp), true, '');
            this.appendToFragment('span', '}', false, this.structure + increment);
          }
          increment--;
        }

      }
    }
  }

  if (this.isArray(json)) {
    fun.call(this, json, FIRST_ARRAY);
  } else if (this.isObject(json)) {
    fun.call(this, json, FIRST_OBJECT);
  } else {
    fun.call(this, json);
  }

  this.box.appendChild(this.fragment);
}
JSONFormatter.prototype.clear = function () {
  this.dom.innerHTML = '';
}


if (window) {
  window.JSONFormatter = JSONFormatter;
}

export default JSONFormatter;

