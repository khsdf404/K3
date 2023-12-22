const log = console.log.bind(document);
const clear = console.clear.bind(document);
const forEach = (list, callback) => {
	if(!list) return;
	if (!list.length) {
		// list is an {} object case;
		let keys = Object.keys(list);
		if (!keys) return;

		for (let i = 0; i < keys.length; i++)
        	callback(list[keys[i]], i);
		return;
	}
    for (let i = 0; i < list.length; i++)
        callback(list[i], i);
}
const syncEach = async (list, callback) => {
    for (const elem of list)
        await callback(elem);
}
// jquery-like-funcs
const $jsf = (str = null) => {
    return new JSFeatures(str);
};
class JSFeatures {
	list;

	constructor(elem = undefined) {
		if (elem == undefined) return this;
		if (elem == null) return null;

		if (typeof(elem) != 'string') {
			if (!elem[0]) {
				this.list = Array.from(Array.isArray(elem) ? elem : [elem]);
				if (this.list[0] && this.list[0][Symbol.toStringTag] == 'HTMLCollection') {
					this.list = null;
					return this;
				}
			}
			else
				this.list = Array.from(elem);
			return this;
		}
		elem = elem.trim();
		if (elem.indexOf(',') > -1) {
			let strSplit = elem.split(',');
			this.list = [];
			for (let i = 0; i <  strSplit.length; i++) {
				this.#New(strSplit[i]).each(e => this.list.push(e))
			}
			return this;
		}
		while (elem.indexOf(' ') > -1) {
			return this.find(elem, true)
		}
		if (elem.indexOf('#') > -1)
			elem = [document.getElementById(elem.replace('#', ''))];
		else if (elem.indexOf('.') > -1)
			elem = document.getElementsByClassName(elem.replace('.', ''));
		else
			elem = document.getElementsByTagName(elem);
		this.list = Array.from(elem);
	}
	find(elem, fromConstructor = false) {
		let a = [];
		while (elem.indexOf(' ') > -1) {
			let nextDeepthParent = this.find(elem.replace(/\s+[\S\s]+/g, ''), fromConstructor);
			elem = elem.replace(/^\S+\s+/g, '')
			for(let i = 0; i < nextDeepthParent.size(); i++) {
				let p = nextDeepthParent.getJSF(i, false);
				let childArr = p.find(elem, false);
				for (let k = 0; k < childArr.size(); k++)
					a.push(childArr.get(k));
			}
			return this.#New(a);
		}

		let deepthElem = this.list && this.list[0] || document;
		if (elem.indexOf('#') > -1)
			elem = [document.getElementById(elem.replace('#', ''))];
		else if (elem.indexOf('.') > -1)
			elem = deepthElem.getElementsByClassName(elem.replace('.', ''));
		else
			elem = deepthElem.getElementsByTagName(elem);

		return this.#New(elem);
	}
    not(elem) {
		let excluded = this.#New(elem.list || elem);
		let output = [];
		let passed = false;
		for (let i = 0; i < this.size(); i++) {
			passed = true;
			for(let j = 0; j < excluded.size(); j++) {
				if (excluded.get(j) == this.get(i)) {
					passed = false;
					break;
				}
			}
			if (passed)
				output.push(this.get(i))
		}
		this.list = output;
		return this;
	}





	size() {
		return this.list && this.list.length || 0;
	}

	get(indexes = 0) {
		if (!this.size()) return null;
		if (typeof(indexes) == 'number') return this.list[indexes] || null;
		// case when index is array
		let subArray = [];
		for (let i = 0; i < indexes.length; i++)
			subArray.push(this.list[indexes[i]]);
		return subArray;
	}
	getAll() {
		return this.list;
	}

	getJSF(indexes = 0) {
		if (!this.size()) return null;
		if (typeof(indexes) == 'number' && indexes != -1)
			return this.#New(this.get(indexes)) || null;
		let subArray = this.get(indexes);
		let $jsfArray = [];
		for (let i = 0; i < subArray.length; i++)
			$jsfArray.push(this.#New(subArray[i]));
		return $jsfArray;
	}

	index(obj = null) {
		if (!this.size()) return null;
		if (!obj) {
			let parentChilds = this.get().parentElement.children;
			for (let i = 0; i < parentChilds.length; i++)
				if (parentChilds[i] == this.get())
					return i;
			return -1;
		}
		if (typeof(obj) == 'string') obj = this.#New(obj).get();
		else if (obj.list) obj = obj.get()
		for (let i = 0; i < obj.length; i++)
			if (obj[i] == this.get())
			return i;
		return -1;
	}

	rect() {
		if (!this.size()) return this.#Exception(`[getRect] jsf is empty`);
		return this.get().getBoundingClientRect();
	}

	parent(str = null) {
		if (!this.size()) return this.#Exception('[parent] jsf is empty');
		if (!str) return this.#New([this.get().parentNode]);
		return this.#New(this.get().closest(str));
	}










	appendChild(child) {
		if (!this.size()) return this;
		if (typeof(child) == 'string') {
			let newNode = document.createElement('div');

			this.get().appendChild(newNode);

			newNode.outerHTML = child;

			return this;
		}
	}
	empty() {
		if (!this.size()) return this;
		this.each(e => {
			while(e.firstElementChild)
				e.firstElementChild.remove();
		})
		return this;
	}
	css(obj) {
		if (!this.list || !this.size()) return this;
		if (!obj) return this.#Exception('Invalid css object')
		// obj is key-value css;
		let keys = Object.keys(obj);
		let styles =  Object.values(obj);
		if (this.size() > 1)
			this.each(e => {
				this.#CSS_Single(e, keys, styles);
			})
		else
			this.#CSS_Single(this.get(), keys, styles);
		return this;
	}
	animate(obj, transition, callback = null) {
		if (!this.list || !this.size()) return this;
		if (!obj) return this.#Exception('Invalid css object')
		if (transition == undefined) return this.#Exception('Invalid transition')

		obj['transition'] = typeof(transition) == 'number' ?
			`all ${transition}ms ease 0s` :
			transition;
		let duration = parseFloat(obj['transition'].split(/\D+/g)[1])
		if (this.size() > 1) {
			this.each(e => {
				this.#Animate_Single(e, duration, callback)
			})
		}
		else
			this.#Animate_Single(this.get(), duration, callback)

		this.css(obj)
		return this;
	}

	fadeIn(duration, display = 'initial', callback = null) {
		if (!this.list || !this.size()) return this;
		if (duration == undefined) return this.#Exception('Invalid duration')


		this.css({'display': display})
		this.css({'opacity': '0'})
		setTimeout(() => {
			this.animate({
				'opacity': '1'
			}, duration, callback)
		}, 1);
		return this;
	}

	fadeOut(duration, callback) {
		if (!this.list || !this.size()) return this;
		if (duration == undefined) return this.#Exception('Invalid duration')

		this.css({
			'opacity': '1'
		})
		setTimeout(() => {
			this.animate({
				'opacity': '0'
			}, duration, callback)
			setTimeout(() => {
				this.css({'display': 'none'})
			}, duration);
		}, 1);

		return this;
	}

	scroll(y = null, duration = 0) {
		if (!this.size()) return this;
		if (y == null) return this.get().scrollTop;

		let startTime = new Date().getTime();
		if (this.size() > 1)
			this.each(e => {
				this.#Scroll_Single(e, startTime, y, duration);
			})
		else
			this.#Scroll_Single(this.get(), startTime, y, duration)
		return this;
	}










    // getters & setters
	text(value = null) {
		if (value == null) {
			if (!this.list || !this.size())
				return this.#Exception('Object is empty');
			return this.get().innerText;
		}
		if (!this.size())
			return this;
		if (this.size() > 1)
			this.each(e => { e.innerText = value });
		else
			this.get().innerText = value;
		return this;
	}

	value(value = null) {
		if (value == null) {
			if (!this.size())
				return this.#Exception('Object is empty');
			return this.get().value;
		}
		if (!this.size())
			return this;
		if (this.size() > 1)
			this.each(e => { e.value = value })
		else
			this.get().value = value;
		return this;
	}

	ihtml(value = null) {
		if (value == null) {
			if (!this.size())
				return this.#Exception('Object is empty');
			return this.get().innerHTML;
		}
		if (!this.size())
			return this;
		if (this.size() > 1)
			this.each(e => { e.innerHTML = value })
		else
			this.get().innerHTML = value;
		return this;
	}

	ohtml(value = null) {
		if (value == null) {
			if (!this.size())
				return this.#Exception('Object is empty');
			return this.get().outerHTML;
		}
		if (!this.size())
			 return this;
		if (this.size() > 1)
			this.each(e => { e.outerHTML = value })
		else
			this.get().outerHTML = value;
		return this;
	}

	attr(attr, value = null) {
		if (value == null) {
			if (!this.size())
				return this.#Exception('Object is empty');
			return this.get().getAttribute(attr);
		}
		if (!this.size())
			return this;
		if (!attr)
			return this.#Exception('Invaid attr name');
		if (this.size() > 1)
			this.each((e) => { e.setAttribute(attr, value) })
		else
			this.get().setAttribute(attr, value);
		return this;
	}

	id(value = null) {
		return this.attr('id', value);
	}

	classList(value = null) {
		return this.attr('class', value);
	}

	addClass(value) {
		return this.each(e => e.classList.add(value));
	}

	removeClass(value = null) {
		return this.each(e => {
			if (value != null)
				e.classList.remove(value);
			else
				e.className = ' ';
		});
	}

	toggleClass(classname) {
		return this.each(e => this.list[i].classList.toggle(classname));
	}

	hasClass(classname) {
		if (!this.size()) return this.#Exception('Object is empty');
		return this.get().classList.contains(classname);
	}



    // EVENTS
	onEvent(type, f) {
		if (!this.size()) return this;
		if (!type) return this.#Exception('[onEvent] empty event type');
		if (!f) return this.#Exception('[onEvent] empty function');
		if (typeof(type) != 'string')
			return this.#Exception('[onEvent] invalid event value')
		if ( typeof(f) != 'function')
			return this.#Exception('[onEvent] invalid function value')

		if (this.size() > 1)
			this.each((elem, i) => {
				elem.addEventListener(type, (event) => {
					f(this.#New(elem), event, i)
			});
		})
		else
			this.get().addEventListener(type, (event) => {
				f(this.#New(this.get()), event, 0)
			});
		return this;
	}

	onClick(f) {
		if (!f) return this.#Exception('[onClick] empty function');
		if (typeof(f) != 'function')
			return this.#Exception('[onClick] argument must be a function');


		return this.onEvent('click', f)
	}

	trigger(event) {
		if (!event) return this.#Exception('[trigger] empty event type');
		if (typeof(event) != 'string') 
			return this.#Exception('[trigger] invalid event type');
		if (!this.size()) return this;


		if (this.size() > 1)
			this.each(e => { e.dispatchEvent(new Event(event)) })
		else
			this.get().dispatchEvent(new Event(event));
		return this;
	}







	each(f) {
		for (let i = 0; i < this.size(); i++)
			f(this.get(i), i)
		return this;
	}

	eachJSF(f) {
		for(let i = 0; i < this.size(); i++)
			f(new JSFeatures([this.get(i)]), i)
		return this;
	}
	extend(obj, removeDuplicates = false) {
		if (!obj) return this.#Exception('[extend]: empty object');


		if (obj[0] || obj.list) {
			let $tmp = obj;
			if (obj[0])
				$tmp = this.#New(obj);
			$tmp.each(e => this.list.push(e));
		}
		else
			this.list.push(obj);

		if (removeDuplicates)
			this.list = Array.from(new Set(this.list));
		return this;
	}
	exclude(obj) {
		if (obj == undefined) return this.#Exception('[extend]: empty object');

		let $tmp;
		if (obj.list)
			$tmp = obj;
		else if (typeof(obj) == 'number')
			$tmp = this.getJSF(obj);
		else if (typeof(obj[0]) == 'number')
			$tmp = this.#New(this.get(obj))
		else
			$tmp = this.#New(obj);
		let arr = $tmp.getAll();
		let output = [];
		for (let i = 0; i < this.size(); i++) {
			let item = this.get(i)
			if (arr.indexOf(item) == -1)
				output.push(item)
		}
		this.list = output;


		return this;
	}





	toJSF(index = null) {
		let arr = [];
		if (index == null)
			this.eachJSF(($e, i) => { arr.push($e)});
		else if (typeof(index) == 'number')
			arr.push( new JSFeatures([this.get(index)]) )
		else if (typeof(index) == 'object') {
			for(let i = 0; i < index.length; i++)
				arr.push(new JSFeatures([this.get(index[i])]));
		}
		return new JSFeatures(arr);
	}




    // private
    #Exception(text) {
        throw 'JSF: ' + text;
    }

	#New(obj) {
		return new JSFeatures(obj)
	}

    #CSS_Single(e, keys, styles) {
        let cssText = e.style.cssText;
        for (let i = 0; i < keys.length; i++) {
            if (cssText.indexOf(keys[i]) > -1) {
                cssText = cssText.replace(keys[i], '&%%');
                cssText = cssText.replace(/&%%[^;]+/g, `${keys[i]}: ${styles[i]}`);
            }
            else {
                cssText += `${keys[i]}: ${styles[i]};`;
            }
        }
        e.style.cssText = cssText;
    }

    #Animate_Single(e, duration, f) {
        let saved = '';
        let cssText = e.style.cssText;
        if (cssText.indexOf('transition') > -1)
            saved = cssText.split(/(transition:\s*[a-zA-Z0-9-\s.,]+;)/g)[1];

        setTimeout(() => {
            if (f) f()
            e.style.cssText = e.style.cssText.replace(/transition:\s*[a-zA-Z0-9-\s.,]+;/g, saved);
        }, duration + 1);
    }

    #Scroll_Single(e, startTime, y, duration) {
        let startScroll = e.scrollTop < 0 ? 0 : e.scrollTop;
        let delta = (y - startScroll);
        let timer = setInterval(() => {
            let current = new Date().getTime() - startTime;
            e.scrollTop = startScroll + current/duration * delta;
            if (current >= duration)
                clearInterval(timer)
        }, 1)
    }
}
