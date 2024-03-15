class ListItem {
    constructor(data, dragContainer) {
        this.id = data.id
        this.data = data
        this.dragContainer = dragContainer
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.isDragging = false;
        this.dom = null
        this._init()
    }

    sizeInit() {
        const rect = this.dom.getBoundingClientRect()
        this.width = rect.width
        this.height = rect.height
        this.x = this.dom.offsetLeft
        this.y = this.dom.offsetTop
    }

    _createDom() {
        const itemDom = document.createElement('div')
        itemDom.dataset.id = this.id
        itemDom.className = "list-item"
        itemDom.innerText = this.data.content
        this.dom = itemDom
        return this.dom
    }

    _init() {
        this._createDom()
        const onMouseDown = () => {
            if(this.dragContainer.dragItem.isTouchActive) return
            this.isDragging = true
            this.dragContainer.dragItem.setAction("REORDER")
            this.dragContainer.dragItem.setId(this.id)
            this.dragContainer.dragItem.setData(this.data)
            this.dragContainer.setDraggingId(this.id)
            
            this.dragContainer.dragItem.setupEventListeners()
        }

        const onTouchStart = () => {
            this.isDragging = true
            this.dragContainer.dragItem.setAction("REORDER")
            this.dragContainer.dragItem.setId(this.id)
            this.dragContainer.dragItem.setData(this.data)
            this.dragContainer.setDraggingId(this.id)
            this.dragContainer.dragItem.setIsTouchActive(true)
            this.dragContainer.dragItem.setupEventListeners()
        }

        this.dom.addEventListener('mousedown', onMouseDown)
        this.dom.addEventListener('touchstart', onTouchStart)
    }
}