
(function() {
    const dragDOMBox = document.querySelector('.drag-container-box')
    const dragButtonDom = document.querySelector('.drag-button')
    const dragContainer = new DragContainer(dragDOMBox)
    const dataList = [
        {
            id: 1,
            content: 1
        },
        {
            id: 2,
            content: 2
        },
        {
            id: 3,
            content: 3
        },
        {
            id: 4,
            content: 4
        },
        {
            id: 5,
            content: 5
        },
        {
            id: 6,
            content: 6
        },
        {
            id: 7,
            content: 7
        },
        {
            id: 8,
            content: 8
        }
    ]
    dragContainer.setDataList(dataList)
    dragContainer.render()
    new DragButton(dragButtonDom, dragContainer)


})()


