document.addEventListener('DOMContentLoaded', function() {
    const queue = new PriorityQueue();
    const queueDiv = document.getElementById('queue');
    const currentCustomerDiv = document.getElementById('currentCustomer');
    const statsDiv = document.getElementById('stats');

    let counters = {
        P: 0,
        C: 0,
        N: 0
    };

    const priorities = {
        P: 3,
        C: 2,
        N: 1
    };

    const customerTypes = {
        P: 'Premium',
        C: 'Regular',
        N: 'Sin Cuenta'
    };

    function updateQueueVisualization() {
        while (queueDiv.firstChild) {
            queueDiv.removeChild(queueDiv.firstChild);
        }

        const queueArray = queue.toArray();
        let i = 0;
        while (i < queueArray.length) {
            const customerDiv = document.createElement('div');
            customerDiv.className = 'customer-item';
            
            const customerType = queueArray[i].charAt(0);
            
            customerDiv.classList.add(`customer-${customerType}`);
            
            const codeSpan = document.createElement('span');
            codeSpan.className = 'customer-code';
            codeSpan.textContent = queueArray[i];
            
            const typeSpan = document.createElement('span');
            typeSpan.className = 'customer-type-label';
            typeSpan.textContent = customerTypes[customerType];
            
            customerDiv.appendChild(codeSpan);
            customerDiv.appendChild(typeSpan);
            
            queueDiv.appendChild(customerDiv);
            i = i + 1;
        }
    }

    function updateStats() {
        const stats = [
            'Clientes Premium atendidos: ' + counters.P,
            'Clientes Regulares atendidos: ' + counters.C,
            'Clientes Sin Cuenta atendidos: ' + counters.N
        ];

        while (statsDiv.firstChild) {
            statsDiv.removeChild(statsDiv.firstChild);
        }

        let i = 0;
        while (i < stats.length) {
            const p = document.createElement('p');
            p.textContent = stats[i];
            statsDiv.appendChild(p);
            i = i + 1;
        }
    }

    function getSelectedType() {
        const radioButtons = document.getElementsByName('type');
        let i = 0;
        while (i < radioButtons.length) {
            if (radioButtons[i].checked) {
                return radioButtons[i].value;
            }
            i = i + 1;
        }
        return null;
    }

    async function animateCustomerEntry(customerCode, priority) {
        const tempCustomer = document.createElement('div');
        tempCustomer.className = 'customer-item customer-entering';
        
        const customerType = customerCode.charAt(0);
        tempCustomer.classList.add(`customer-${customerType}`);
        
        const codeSpan = document.createElement('span');
        codeSpan.className = 'customer-code';
        codeSpan.textContent = customerCode;
        
        const typeSpan = document.createElement('span');
        typeSpan.className = 'customer-type-label';
        typeSpan.textContent = customerTypes[customerType];
        
        const prioritySpan = document.createElement('span');
        prioritySpan.className = 'priority-label';
        prioritySpan.textContent = `Prioridad: ${priority}`;
        
        tempCustomer.appendChild(codeSpan);
        tempCustomer.appendChild(typeSpan);
        tempCustomer.appendChild(prioritySpan);
        
        document.querySelector('.controls').appendChild(tempCustomer);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        tempCustomer.remove();
        
        queue.enqueue(customerCode, priority);
        updateQueueVisualization();
        
        const customers = document.querySelectorAll('.customer-item');
        let targetIndex = -1;
        
        for (let i = 0; i < customers.length; i++) {
            const code = customers[i].querySelector('.customer-code').textContent;
            if (code === customerCode) {
                targetIndex = i;
                break;
            }
        }
        
        if (targetIndex >= 0) {
            customers[targetIndex].classList.add('highlight');
            await new Promise(resolve => setTimeout(resolve, 800));
            customers[targetIndex].classList.remove('highlight');
        }
    }

    async function animateCustomerService() {
        if (queue.isEmpty()) {
            currentCustomerDiv.textContent = 'No hay clientes en espera';
            return;
        }
        
        const customers = document.querySelectorAll('.customer-item');
        if (customers.length > 0) {
            const firstCustomer = customers[0];
            firstCustomer.classList.add('serving');
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const customer = queue.dequeue();
            
            currentCustomerDiv.innerHTML = '';
            
            const servedCustomer = document.createElement('div');
            servedCustomer.className = 'customer-item customer-served';
            
            const customerType = customer.charAt(0);
            servedCustomer.classList.add(`customer-${customerType}`);
            
            const codeSpan = document.createElement('span');
            codeSpan.className = 'customer-code';
            codeSpan.textContent = customer;
            
            const typeSpan = document.createElement('span');
            typeSpan.className = 'customer-type-label';
            typeSpan.textContent = customerTypes[customerType];
            
            const statusSpan = document.createElement('span');
            statusSpan.className = 'status-label';
            statusSpan.textContent = 'Atendiendo';
            
            servedCustomer.appendChild(codeSpan);
            servedCustomer.appendChild(typeSpan);
            servedCustomer.appendChild(statusSpan);
            
            currentCustomerDiv.appendChild(servedCustomer);
            
            updateQueueVisualization();
        }
    }

    document.getElementById('addCustomer').addEventListener('click', async function() {
        const selectedType = getSelectedType();
        let customerNumber;
        
        if (selectedType === 'P') {
            counters.P = counters.P + 1;
            customerNumber = counters.P;
        } else if (selectedType === 'C') {
            counters.C = counters.C + 1;
            customerNumber = counters.C;
        } else {
            counters.N = counters.N + 1;
            customerNumber = counters.N;
        }

        const customerCode = selectedType + customerNumber;
        await animateCustomerEntry(customerCode, priorities[selectedType]);
        updateStats();
    });

    document.getElementById('serveCustomer').addEventListener('click', async function() {
        await animateCustomerService();
    });

    updateQueueVisualization();
    updateStats();
    currentCustomerDiv.textContent = 'No hay clientes en espera';
});