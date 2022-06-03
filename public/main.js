
const divRoot = document.getElementById('root')
const properties = [
    'rank',
    'name',
    'price',
    '24h',
    '7d',
    'marketCap',
    'volume',
    'circulatingSupply'
];

window.onload = () => {
    const socket = io();

    const divContainer = document.createElement('div')
    divContainer.classList.add('container')

    const rowElement = document.createElement('div')
    rowElement.classList.add('row')
    divContainer.appendChild(rowElement)

    socket.on('loadData' , (data) => { 
        data.forEach((item) => {
            const itemElement = document.createElement('div')
            itemElement.classList.add('col-md-4')

            const cardContain = document.createElement('div')
            cardContain.classList.add('card')

            const listPropertiesData = document.createElement('ul')
            listPropertiesData.classList.add('list-group','list-group-flush')

            for(const [key, value] of Object.entries(item)) {
                const propertyElement = document.createElement('li')
                propertyElement.classList.add('list-group-item')
                propertyElement.textContent = value

                listPropertiesData.appendChild(propertyElement)
            }

            cardContain.appendChild(listPropertiesData)
            itemElement.appendChild(cardContain)
            rowElement.appendChild(itemElement)
        });

        divRoot.appendChild(divContainer)
    })

    socket.on('refreshData', (data) => {
        [...rowElement.children].forEach((row, index) => {
            row.querySelectorAll('li').forEach((pros, keyIdx) => {
                pros.textContent = data[index][properties[keyIdx]]
            })
        })
    })
}