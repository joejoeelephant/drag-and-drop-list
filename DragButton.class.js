class DragButton {
    constructor(dom, dragContainer) {
        this.dragContainer = dragContainer
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.isDragging = false;
        this.dom = dom
        this._init()
    }

    sizeInit() {
        const rect = this.dom.getBoundingClientRect()
        this.width = rect.width
        this.height = rect.height
        this.x = this.dom.offsetLeft
        this.y = this.dom.offsetTop
    }

    _init() {
        const onMouseDown = (event) => {
            if(this.dragContainer.dragItem.isTouchActive) return
            const newItemData = {id: Math.ceil(Math.random() * 10 + 10), content: 'newItem'}
            this.isDragging = true
            this.dragContainer.dragItem.setId(newItemData.id)
            this.dragContainer.dragItem.setAction("ADD_ITEM")
            this.dragContainer.dragItem.setData(newItemData)
            this.dragContainer.setDraggingId(this.id)
            this.dragContainer.dragItem.setupEventListeners()

        }

        const onTouchStart = () => {
            const newItemData = {id: Math.ceil(Math.random() * 10 + 10), content: 'newItem'}
            this.isDragging = true
            this.dragContainer.dragItem.setId(newItemData.id)
            this.dragContainer.dragItem.setAction("ADD_ITEM")
            this.dragContainer.dragItem.setData(newItemData)
            this.dragContainer.setDraggingId(this.id)
            this.dragContainer.dragItem.setIsTouchActive(true)
            this.dragContainer.dragItem.setupEventListeners()
        }

        const onClick = () => {
            this.dragContainer.addItem({id: Math.ceil(Math.random() * 10 + 10), content: 'newItem'})
        }

        this.dom.addEventListener('mousedown', onMouseDown)
        this.dom.addEventListener('touchstart', onTouchStart)
        this.dom.addEventListener('click', onClick)
    }
}