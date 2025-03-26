document.addEventListener('DOMContentLoaded', () => {
    const stack = new Stack();
    const infixInput = document.getElementById('infixInput');
    const convertBtn = document.getElementById('convertBtn');
    const stackDiv = document.getElementById('stack');
    const outputDiv = document.getElementById('output');
    const finalResultDiv = document.getElementById('finalResult');
    const infixExpressionDiv = document.getElementById('infixExpression');

    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '^': 3,
        '(': 0,
        ')': 0
    };

    function updateStackVisualization() {
        stackDiv.innerHTML = '';
        const stackArray = stack.toArray();
        let i = 0;
        while (i < stackArray.length) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'stack-item';
            itemDiv.textContent = stackArray[i];
            stackDiv.appendChild(itemDiv);
            i = i + 1;
        }
    }

    function addToOutput(char) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'output-item';
        itemDiv.textContent = char;
        outputDiv.appendChild(itemDiv);
    }

    function displayInfixExpression(expression) {
        infixExpressionDiv.innerHTML = '';
        let i = 0;
        while (i < expression.length) {
            const charDiv = document.createElement('div');
            charDiv.className = 'infix-char';
            charDiv.textContent = expression[i];
            charDiv.id = `infix-char-${i}`;
            infixExpressionDiv.appendChild(charDiv);
            i = i + 1;
        }
    }

    async function highlightInfixChar(index) {
        const chars = document.querySelectorAll('.infix-char');
        let i = 0;
        while (i < chars.length) {
            chars[i].classList.remove('active');
            i = i + 1;
        }
        
        if (index >= 0 && index < chars.length) {
            chars[index].classList.add('active');
        }
    }

    function evaluateInfix(expression) {
        const stack = new Stack();
        let processed = expression.replace(/\)\(/g, ')*(');
        processed = processed.replace(/(\d+)\(/g, '$1*(');
        processed = processed.replace(/\)(\d+)/g, ')*$1');
        
        const tokens = processed.match(/\d+|[+\-*/()]/g);
        const output = [];
        
        for (let token of tokens) {
            if (/\d+/.test(token)) {
                output.push(parseFloat(token));
            } else if (token === '(') {
                stack.push(token);
            } else if (token === ')') {
                while (!stack.isEmpty() && stack.peek() !== '(') {
                    const operator = stack.pop();
                    const b = output.pop();
                    const a = output.pop();
                    output.push(applyOperator(a, b, operator));
                }
                stack.pop();
            } else {
                while (!stack.isEmpty() && precedence[stack.peek()] >= precedence[token]) {
                    const operator = stack.pop();
                    const b = output.pop();
                    const a = output.pop();
                    output.push(applyOperator(a, b, operator));
                }
                stack.push(token);
            }
        }
        
        while (!stack.isEmpty()) {
            const operator = stack.pop();
            const b = output.pop();
            const a = output.pop();
            output.push(applyOperator(a, b, operator));
        }
        
        return output[0];
    }

    function applyOperator(a, b, operator) {
        switch (operator) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            default: return 0;
        }
    }

    async function evaluatePostfixWithAnimation(postfix) {
        let evaluationDiv = document.getElementById('postfixEvaluation');
        if (!evaluationDiv) {
            let evaluationContainer = document.querySelector('.evaluation-container');
            if (!evaluationContainer) {
                const visualizationDiv = document.querySelector('.visualization');
                if (visualizationDiv) {
                    visualizationDiv.className = 'visualization-container';
                    
                    const stackContainer = visualizationDiv.querySelector('.stack-container');
                    const expressionContainer = visualizationDiv.querySelector('.expression-container');
                    
                    evaluationContainer = document.createElement('div');
                    evaluationContainer.className = 'evaluation-container';
                    
                    if (expressionContainer) {
                        visualizationDiv.insertBefore(evaluationContainer, expressionContainer);
                    } else {
                        visualizationDiv.appendChild(evaluationContainer);
                    }
                } else {
                    const container = document.querySelector('.container');
                    evaluationContainer = document.createElement('div');
                    evaluationContainer.className = 'evaluation-container';
                    container.appendChild(evaluationContainer);
                }
            }
            
            evaluationDiv = document.createElement('div');
            evaluationDiv.id = 'postfixEvaluation';
            evaluationDiv.className = 'postfix-evaluation';
            
            const title = document.createElement('h4');
            title.textContent = 'Evaluación Postfija';
            
            const stackContainer = document.createElement('div');
            stackContainer.id = 'evaluationStack';
            stackContainer.className = 'evaluation-stack';
            
            evaluationDiv.appendChild(title);
            evaluationDiv.appendChild(stackContainer);
            
            evaluationContainer.appendChild(evaluationDiv);
        }
        
        const evaluationStack = document.getElementById('evaluationStack');
        evaluationStack.innerHTML = '';
        
        const operationsContainer = document.createElement('div');
        operationsContainer.className = 'operations-container';
        evaluationDiv.appendChild(operationsContainer);
        
        const evalStack = new Stack();
        const tokens = postfix.split(' ').filter(token => token.trim() !== '');
        
        for (let token of tokens) {
            const postfixItems = document.querySelectorAll('.output-item');
            let tokenIndex = -1;
            for (let i = 0; i < postfixItems.length; i++) {
                if (postfixItems[i].textContent === token) {
                    tokenIndex = i;
                    break;
                }
            }
            
            if (tokenIndex >= 0) {
                postfixItems[tokenIndex].classList.add('active');
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            if (/\d+/.test(token)) {
                evalStack.push(parseFloat(token));
                updateEvaluationStack(evaluationStack, evalStack);
                await new Promise(resolve => setTimeout(resolve, 200));
            } else {
                const b = evalStack.pop();
                updateEvaluationStack(evaluationStack, evalStack);
                await new Promise(resolve => setTimeout(resolve, 200));
                
                const a = evalStack.pop();
                updateEvaluationStack(evaluationStack, evalStack);
                await new Promise(resolve => setTimeout(resolve, 200));
                
                const operationDiv = document.createElement('div');
                operationDiv.className = 'operation';
                operationDiv.textContent = `${a} ${token} ${b} = ${applyOperator(a, b, token)}`;
                operationsContainer.innerHTML = '';
                operationsContainer.appendChild(operationDiv);
                await new Promise(resolve => setTimeout(resolve, 400));
                
                evalStack.push(applyOperator(a, b, token));
                updateEvaluationStack(evaluationStack, evalStack);
                await new Promise(resolve => setTimeout(resolve, 200));
                
                operationsContainer.innerHTML = '';
            }
            
            if (tokenIndex >= 0) {
                postfixItems[tokenIndex].classList.remove('active');
            }
        }
        
        return evalStack.peek() || 0;
    }
    
    function updateEvaluationStack(container, stack) {
        container.innerHTML = '';
        const stackArray = stack.toArray();
        
        for (let i = 0; i < stackArray.length; i++) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'evaluation-item';
            itemDiv.textContent = stackArray[i];
            container.appendChild(itemDiv);
        }
    }
    
    function evaluatePostfix(postfix) {
        const stack = new Stack();
        const tokens = postfix.match(/\d+|[+\-*/]/g);
        
        if (!tokens) return 0;
        
        for (let token of tokens) {
            if (/\d+/.test(token)) {
                stack.push(parseFloat(token));
            } else {
                const b = stack.pop();
                const a = stack.pop();
                if (a === null || b === null) return 0;
                const result = applyOperator(a, b, token);
                stack.push(result);
            }
        }
        return stack.peek() || 0;
    }

    async function convertToPostfix(infix) {
        stack.top = null;
        stackDiv.innerHTML = '';
        outputDiv.innerHTML = '';
        finalResultDiv.innerHTML = '';

        let processed = infix.replace(/\)\(/g, ')*(');
        processed = processed.replace(/(\d+)\(/g, '$1*(');
        processed = processed.replace(/\)(\d+)/g, ')*$1');

        displayInfixExpression(processed);
        
        let i = 0;
        while (i < processed.length) {
            const char = processed[i];
            
            await highlightInfixChar(i);
            await new Promise(resolve => setTimeout(resolve, 300));
            
            if (/[0-9]/.test(char)) {
                addToOutput(char);
                await new Promise(resolve => setTimeout(resolve, 200));
            } else if (char === '(') {
                stack.push(char);
                updateStackVisualization();
                await new Promise(resolve => setTimeout(resolve, 200));
            } else if (char === ')') {
                while (!stack.isEmpty() && stack.peek() !== '(') {
                    addToOutput(stack.pop());
                    updateStackVisualization();
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                stack.pop(); 
                updateStackVisualization();
            } else if (char in precedence) {
                while (!stack.isEmpty() && 
                        stack.peek() !== '(' &&
                        precedence[stack.peek()] >= precedence[char]) {
                    addToOutput(stack.pop());
                    updateStackVisualization();
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
                stack.push(char);
                updateStackVisualization();
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            i = i + 1;
        }

        await highlightInfixChar(-1);

        while (!stack.isEmpty()) {
            addToOutput(stack.pop());
            updateStackVisualization();
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        const postfix = Array.from(outputDiv.children)
                            .map(div => div.textContent)
                            .join(' ');
        
        const infixResult = evaluateInfix(infix);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const postfixResult = await evaluatePostfixWithAnimation(postfix);
        
        const infixResultElement = document.getElementById('infixResult');
        const postfixResultElement = document.getElementById('postfixResult');

        if (finalResultDiv) finalResultDiv.textContent = `Expresión Postfija: ${postfix}`;
        if (infixResultElement) infixResultElement.textContent = `Resultado Infijo: ${infixResult}`;
        if (postfixResultElement) postfixResultElement.textContent = `Resultado Postfijo: ${postfixResult}`;
    }

    function isValidExpression(expression) {
        const validChars = /^[0-9+\-*/().\s]+$/;
        if (!validChars.test(expression)) {
            return false;
        }
        
        let parenthesisCount = 0;
        for (let i = 0; i < expression.length; i++) {
            if (expression[i] === '(') {
                parenthesisCount++;
            } else if (expression[i] === ')') {
                parenthesisCount--;
                if (parenthesisCount < 0) {
                    return false;
                }
            }
        }
        
        const hasNumber = /[0-9]/.test(expression);
        
        return parenthesisCount === 0 && hasNumber;
    }

    function showErrorModal() {
        const errorModal = document.getElementById('errorModal');
        errorModal.style.display = 'flex';
    }
    
    function hideErrorModal() {
        const errorModal = document.getElementById('errorModal');
        errorModal.style.display = 'none';
    }

    convertBtn.addEventListener('click', () => {
        const infix = infixInput.value.trim();
        if (infix) {
            if (isValidExpression(infix)) {
                convertToPostfix(infix);
            } else {
                showErrorModal();
            }
        }
    });

    document.getElementById('closeModalBtn').addEventListener('click', hideErrorModal);
    
    document.getElementById('errorModal').addEventListener('click', function(event) {
        if (event.target === this) {
            hideErrorModal();
        }
    });

    function clearAll() {
        infixInput.value = '';
        stack.top = null;
        stackDiv.innerHTML = '';
        outputDiv.innerHTML = '';
        finalResultDiv.innerHTML = '';
        infixExpressionDiv.innerHTML = '';
        const infixResultElement = document.getElementById('infixResult');
        const postfixResultElement = document.getElementById('postfixResult');
        if (infixResultElement) infixResultElement.innerHTML = '';
        if (postfixResultElement) postfixResultElement.innerHTML = '';
    }

    document.getElementById('clearBtn').addEventListener('click', clearAll);
});