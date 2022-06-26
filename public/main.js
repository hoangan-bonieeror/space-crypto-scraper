
const divRoot = document.getElementById('root')
const properties = [
    'name',
    'id',
    'price',
    'day',
    'week',
    'market_cap',
    'volume',
    'circulating_supply',
    'createat',
    'updateat'
];

window.onload = () => {
    const socket = io();

    const divContainer = document.createElement('div')
    divContainer.classList.add('mt-5', 'mx-8', 'rounded-2xl', 'border-2', 'border-indigo-600')

    const tableElement = document.createElement('table')
    tableElement.classList.add('table-auto', 'border-collapse', 'w-full', 'mt-1', 'mb-6')
    tableElement.style.fontSize = '15px'

    const headerTable = document.createElement('thead')
    headerTable.classList.add('bg-transparent', 'text-indigo-900')
    const trElement = document.createElement('tr')

    properties.forEach((prop, index) => {
        let thElement = document.createElement('th')

        thElement.classList.add('border-b-2', 'border-indigo-600' ,'pt-3', 'p-2')
        thElement.textContent = prop.charAt(0).toUpperCase() + prop.slice(1)
        trElement.appendChild(thElement)
    });

    headerTable.appendChild(trElement)
    tableElement.appendChild(headerTable)

    let bodyTable = document.createElement('tbody')
    bodyTable.classList.add('bg-white')

    socket.on('loadData', (data) => {
        data.forEach((item) => {
            const rowElement = document.createElement('tr')
            rowElement.classList.add('border-b', 'border-indigo-600')

            for (let [key, value] of Object.entries(item)) {
                const column = document.createElement('td')
                column.classList.add('p-2', 'text-center', 'text-indigo-900')

                if (key == 'createat' || key == 'updateat') {
                    let dateObj = new Date(value)
                    column.textContent = [dateObj.getDate(), dateObj.getMonth(), dateObj.getFullYear()].join('/')
                }
                else { column.textContent = value }

                rowElement.appendChild(column)
            }

            bodyTable.appendChild(rowElement)
        });

        tableElement.appendChild(bodyTable)
        divContainer.appendChild(tableElement)
        divRoot.appendChild(divContainer)
    })

    socket.on('refreshData', (data) => {
        [...bodyTable.children].forEach((row, index) => {
            row.querySelectorAll('td').forEach((pros, keyIdx) => {
                if (properties[keyIdx] == 'createat' || properties[keyIdx] == 'updateat') {
                    let dateObj = new Date(data[index][properties[keyIdx]])
                    pros.textContent = [dateObj.getDate(), dateObj.getMonth(), dateObj.getFullYear()].join('/')
                } else {
                    pros.textContent = data[index][properties[keyIdx]]
                }
            })
        })
    })

    window.onresize = (e) => {
        if (window.innerWidth < 968) {
            [...bodyTable.querySelectorAll('td')].forEach(item => {
                tableElement.style.fontSize = 'unset'
                item.classList.add('text-xs')
            })
        } else {
            [...bodyTable.querySelectorAll('td')].forEach(item => {
                item.classList.contains('text-xs') && item.classList.remove('text-xs')
                tableElement.style.fontSize = '15px'
            })
        }
    }
}