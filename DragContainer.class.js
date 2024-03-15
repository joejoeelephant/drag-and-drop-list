class DragContainer {
    constructor(dom) {
        const rect = dom.getBoundingClientRect()
        this.itemList = []
        this.dataList = []
        this.draggingId = ''
        this.width = rect.width
        this.height = rect.height
        this.top = rect.top
        this.left = rect.left
        this.dom = dom
        this.dragItem = new DragItem({id: '', content: ''}, this)
    }

    _sizeInit() {
        const rect = this.dom.getBoundingClientRect()
        this.width = rect.width
        this.height = rect.height
    }

    reorder(id) {
        console.log(this.draggingId, id);
    
        // Create a copy of dataList to work with
        const dataList = [...this.dataList];
        
        // Find the index of the item to be moved
        const moveItemIndex = dataList.findIndex(item => item.id === Number(this.draggingId));
        
        // Reference the item directly; no need to copy or spread since objects are reference types
        const moveItem = dataList[moveItemIndex];
        
        // Remove the item from its current position
        dataList.splice(moveItemIndex, 1);
        
        // Find the new index where the item should be inserted
        const beforeItemIndex = dataList.findIndex(item => item.id === Number(id));
        
        // Insert the item at its new position
        dataList.splice(beforeItemIndex, 0, moveItem);
    
        // Update the dataList property
        this.dataList = dataList;
    
        this.render();
    
    }

    addItemBefore(id, newItem) {
        const dataList = [...this.dataList];
        const beforeItemIndex = dataList.findIndex(item => item.id === Number(id));
        dataList.splice(beforeItemIndex, 0, newItem);
        this.dataList = dataList;
        this.render();
    }

    addItem(newItem) {
        const dataList = [...this.dataList];
        dataList.push(newItem)
        this.dataList = dataList;
        this.render();
    }

    render() {
        this.dom.innerHTML = ''
        this.itemList = []
        this.dataList.forEach(item => {
            const dragItem = (new ListItem(item, this))
            this.itemList.push(dragItem)
            this.dom.appendChild(dragItem.dom)
        })
        this.dom.appendChild(this.dragItem.dom)
        this._sizeInit()

        this.dragItem.sizeInit()
        this.itemList.forEach(item => item.sizeInit())

    }

    setDraggingId(id) {
        this.draggingId = id
    }

    setDataList(list) {
        this.dataList = list
    }

}