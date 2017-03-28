export class Pool {
    components = []
    
    ImageCache = {}


    constructor() {
        if(typeof window === 'undefined') { //服务器端不作处理
            return;
        }

        this.defaultOpts = {
            HOffset: window.screen.width, //水平偏移
            VOffset: window.screen.height //垂直偏移, 默认为1屏距离
        }

        this.listen(window);
    }

    listen = (dom) => {
        if(typeof dom !== 'undefined') {
            dom.addEventListener('scroll', this.scrollHandler);
            dom.addEventListener('resize', this.scrollHandler);
        }
    }

    scrollHandler = () => {
        this.components.forEach((component) => {
            const node = component.node; //如果节点不存在了直接删除
            if(!node) {
                this.remove(component);
            }

            if(this.inViewPort(node)) {
                this.displayComponent(component);
            }
        });
    }

    displayComponent = (component) => {
        if(!component.node) {
            return false;
        }

        this.loadImage(component, ()=> {
            component.setVisable(true);
        }, () => {
            component.setVisable(false);
        })
    }

	inViewPort = (node) => {
        if(!node) {
            return false;
        }

        const rect = node.getBoundingClientRect();
        const {
            HOffset,
            VOffset
        } = this.defaultOpts;

        return rect.top >= -VOffset &&
            rect.top <= VOffset &&
            rect.left >= -HOffset &&
            rect.left <= HOffset;
	}

	add = (component) => {
        if(this.components.indexOf(component) > -1) {
            return false; //已经存在就不要添加了
        }

        if(this.inViewPort(component.node)) {
            this.displayComponent(component);
        } else {
            this.components.push(component);
        }

        return this.components.length;
	}

	remove = (component) => {
		const index = this.components.indexOf(component);
		if(index > -1) {
			return this.components.splice(index, 1);
		} else {
			return false;
		}
	}

    loadImage = (component, success, fail) => {
        const imgSrc = component.props.src;

        if(!imgSrc) {
            return;
        }

        const onload = () => {
            this.ImageCache[imgSrc] = true;
            success();
            if(component.props.onLoad) {
                component.props.onLoad(component);
            }

            if(this.onLoad) {
                this.onLoad(component);
            }
        }

        const onerror = (e) => {
            delete this.ImageCache[imgSrc];
            fail();
            if(component.props.onError) {
                component.props.onError(component);
            }

            if(this.onError) {
                this.onError(component, e);
            }
        }

        if(this.ImageCache[imgSrc]) {
            onload();
            return;
        }

        const img = new Image();

        img.onload = onload;
        img.onerror = onerror;
        img.src = imgSrc;
    }

    setOptions = (newOpts = {}) => {
        return Object.assign(this.defaultOpts, newOpts);
    }
}

export default new Pool();