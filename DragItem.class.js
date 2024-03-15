class DragItem {
    constructor(data, dragContainer) {
        this.id = data.id
        this.data = data
        this.x = 0;
        this.y = 0;
        this.width = 80;
        this.height = 48;
        this.dom = null
        this.dragContainer = dragContainer
        this.minX = 0
        this.maxX = 0
        this.minY = 0
        this.maxY = 0
        this.collideItem = null
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._updatePosition =  this._updatePosition.bind(this)
        this.action = "REORDER" || "ADD_ITEM"
        this.isThrottled = false
        this.listenersAdded = {
            mouse: false,
            touch: false,
        }
        this.isTouchActive = false;
        this.touchEndTimeout = null
        this._init()
    }

    setIsTouchActive(val) {
        this.isTouchActive = val
    }

    setAction(action) {
        this.action = action
    }

    sizeInit() {
        console.log(document.body.clientWidth)
        this.maxX = document.body.clientWidth - this.width - 32
        this.maxY = document.body.clientHeight - this.height
    }

    setId(id) {
        this.id = id
    }

    setData(data) {
        this.data = data
        this._setDomContent(data.content)
    }

    setupEventListeners() {
        if (!this.listenersAdded.mouse) {
            document.addEventListener('mousemove', this._onMouseMove);
            document.addEventListener('mouseup', this._onMouseUp);
            this.listenersAdded.mouse = true; // Mark as added
        }

        // Touch event listeners
        if (!this.listenersAdded.touch) {
            document.addEventListener('touchmove', this._onTouchMove, { passive: false });
            document.addEventListener('touchend', this._onTouchEnd);
            this.listenersAdded.touch = true; // Mark as added
        }
    }

    _updatePosition() {
        // Check if there's an event to process
        if (!this.lastEvent) return;
    
        // Extract event specifics depending on type (touch or mouse)
        const event = this.lastEvent;
        let x, y;
        if (event.type.startsWith('touch')) {
            const touch = event.touches[0];
            x = touch.clientX;
            y = touch.clientY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const {top : containerTop, left: containerLeft} = this.dragContainer
        x = x - containerLeft
        y = y - containerTop + scrollTop
        this.x = Math.max(0, Math.min(x  - this.width / 2, this.maxX));
        this.y = Math.max(0, Math.min(y - this.height / 2, this.maxY));
        this.checkCollision()
        
        this.lastEvent = null;
    }

    _render() {
        this.dom.style.left = `${this.x}px`
        this.dom.style.top = `${this.y}px`
    }

    _setDomContent(string) {
        this.dom.innerText = string
    }

    _show() {
        this.dom.style.display = 'block'
    }

    _hide() {
        this.dom.style.display = 'none'
    }

    _onMouseMove(event) {
        if(this.isTouchActive) return
        this._show()
        this.lastEvent = event;
        if (!this.isThrottled) {
            this.isThrottled = true;
            requestAnimationFrame(() => {
                this._updatePosition();
                this._render()
                this.isThrottled = false;
            });
        }
    }

    _onMouseUp() {
        this._hide()
        this._executeAction()
        this.id = ""
        this.collideItem = null
        this.setAction("")
        this.cleanup()
    }

    _onTouchMove(event) {
        if (event.cancelable) {
            event.preventDefault();
            this._show()
            this.lastEvent = event;
            if (!this.isThrottled) {
                this.isThrottled = true;
                requestAnimationFrame(() => {
                    this._updatePosition();
                    this._render()
                    this.isThrottled = false;
                });
            }
            clearTimeout(this.touchEndTimeout);
            this.touchEndTimeout = setTimeout(() => {
                this.isTouchActive = false;
            }, 150); // Adjust the timeout duration as needed
            
        }
    }

    _onTouchEnd() {
        this._hide()
        this._executeAction()
        this.id = ""
        this.collideItem = null
        this.setAction("")
        this.setIsTouchActive(false)
        this.cleanup()
    }

    _executeAction() {
        if(!this.collideItem) return
        if(this.action === 'REORDER') {
            this.dragContainer.reorder(this.collideItem.id)
        }
        if(this.action === 'ADD_ITEM') {
            console.log('add')
            this.dragContainer.addItemBefore(this.collideItem.id, {id: this.id, content: 'newItem'})
        }
    }

    deleteMouseMove() {
        if (this.listenersAdded.mouse) {
            document.removeEventListener('mousemove', this._onMouseMove);
            this.listenersAdded.mouse = false; // Mark as removed
        }
    }

    deleteMouseUp() {
        if (this.listenersAdded.mouse) {
            document.removeEventListener('mouseup', this._onMouseUp);
            // No need to change the flag here if you're removing both mousemove and mouseup together
        }
    }

    deleteTouchMove() {
        if (this.listenersAdded.touch) {
            document.removeEventListener('touchmove', this._onTouchMove);
            this.listenersAdded.touch = false; // Mark as removed
        }
    }

    deleteTouchEnd() {
        if (this.listenersAdded.touch) {
            document.removeEventListener('touchend', this._onTouchEnd);
            // No need to change the flag here if you're removing both touchmove and touchend together
        }
    }

    cleanup() {
        this.deleteMouseMove();
        this.deleteMouseUp();
        this.deleteTouchMove();
        this.deleteTouchEnd();
        // Perform any other cleanup needed for this instance
    }

    _createDom() {
        const itemDom = document.createElement('div')
        itemDom.dataset.id = this.id
        itemDom.className = "drag-item"
        itemDom.innerText = this.data.content
        this.dom = itemDom
        return this.dom
    }

    _init() {
        this._createDom()
    }

    checkCollision() {
        const { itemList } = this.dragContainer;
        this.collideItem = itemList.find(item => {
            if (item.id === this.id) return false; // Skip self to avoid self-collision

            // Calculate the horizontal and vertical distances between the centers of the two items
            const horizontalDistance = Math.abs((this.x) - (item.x));
            const verticalDistance = Math.abs((this.y) - (item.y));

            // Calculate the minimum distance for a collision to occur in both dimensions
            const minHorizontalDistance = 20; // Added 20px for proximity
            const minVerticalDistance = 20; // Added 20px for proximity

            // Check if the actual distance between items is less than the minimum for a collision
            const isCollidingHorizontal = horizontalDistance < minHorizontalDistance;
            const isCollidingVertical = verticalDistance < minVerticalDistance;

            return isCollidingHorizontal && isCollidingVertical;
        });
    }

}