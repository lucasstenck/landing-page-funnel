// JavaScript para sistema de progresso
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de progresso carregado');
    
    // Inicializar funcionalidades
    initProgressTracking();
    initCharts();
    initGoals();
});

// Função para inicializar tracking de progresso
function initProgressTracking() {
    // Carregar dados de progresso do localStorage ou servidor
    const progressData = loadProgressData();
    
    // Atualizar interface com dados
    updateProgressUI(progressData);
    
    // Configurar tracking automático
    setupAutoTracking();
}

// Função para carregar dados de progresso
function loadProgressData() {
    // Tentar carregar do servidor primeiro
    const serverData = loadFromServer();
    
    if (serverData) {
        return serverData;
    }
    
    // Fallback para localStorage
    const localData = JSON.parse(localStorage.getItem('progressData') || '{}');
    
    if (Object.keys(localData).length === 0) {
        // Dados padrão se não houver dados salvos
        return {
            startDate: new Date().toISOString(),
            currentWeight: 80,
            startWeight: 80,
            targetWeight: 65,
            measurements: {
                chest: 100,
                waist: 90,
                hips: 105,
                arms: 35,
                thighs: 60
            },
            goals: [
                { id: 1, title: 'Perder 5kg', target: 75, achieved: false },
                { id: 2, title: 'Perder 10kg', target: 70, achieved: false },
                { id: 3, title: 'Perder 15kg', target: 65, achieved: false }
            ],
            dailyLogs: []
        };
    }
    
    return localData;
}

// Função para carregar dados do servidor
function loadFromServer() {
    // Implementar chamada para API quando disponível
    return null;
}

// Função para atualizar interface de progresso
function updateProgressUI(data) {
    // Atualizar peso atual
    const currentWeightEl = document.querySelector('.current-weight');
    if (currentWeightEl) {
        currentWeightEl.textContent = `${data.currentWeight} kg`;
    }
    
    // Calcular e mostrar perda total
    const totalLost = data.startWeight - data.currentWeight;
    const totalLostEl = document.querySelector('.total-lost');
    if (totalLostEl) {
        totalLostEl.textContent = `${totalLost} kg`;
        totalLostEl.style.color = totalLost > 0 ? '#51cf66' : '#ff6b6b';
    }
    
    // Calcular e mostrar progresso para meta
    const progressToGoal = ((data.startWeight - data.currentWeight) / (data.startWeight - data.targetWeight)) * 100;
    const progressEl = document.querySelector('.progress-bar');
    if (progressEl) {
        progressEl.style.width = `${Math.max(0, Math.min(100, progressToGoal))}%`;
    }
    
    // Atualizar dias no programa
    const daysInProgram = Math.floor((new Date() - new Date(data.startDate)) / (1000 * 60 * 60 * 24));
    const daysEl = document.querySelector('.days-in-program');
    if (daysEl) {
        daysEl.textContent = daysInProgram;
    }
    
    // Atualizar metas
    updateGoals(data.goals);
    
    // Atualizar medições
    updateMeasurements(data.measurements);
}

// Função para atualizar metas
function updateGoals(goals) {
    const goalsContainer = document.querySelector('.goals-list');
    if (!goalsContainer) return;
    
    goalsContainer.innerHTML = '';
    
    goals.forEach(goal => {
        const goalEl = document.createElement('div');
        goalEl.className = `goal-item ${goal.achieved ? 'achieved' : ''}`;
        goalEl.innerHTML = `
            <div class="goal-info">
                <h4>${goal.title}</h4>
                <p>Meta: ${goal.target} kg</p>
            </div>
            <div class="goal-status">
                ${goal.achieved ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-clock"></i>'}
            </div>
        `;
        
        goalsContainer.appendChild(goalEl);
    });
}

// Função para atualizar medições
function updateMeasurements(measurements) {
    const measurementsContainer = document.querySelector('.measurements-grid');
    if (!measurementsContainer) return;
    
    const measurementTypes = [
        { key: 'chest', label: 'Peito', unit: 'cm' },
        { key: 'waist', label: 'Cintura', unit: 'cm' },
        { key: 'hips', label: 'Quadril', unit: 'cm' },
        { key: 'arms', label: 'Braços', unit: 'cm' },
        { key: 'thighs', label: 'Coxas', unit: 'cm' }
    ];
    
    measurementsContainer.innerHTML = '';
    
    measurementTypes.forEach(type => {
        const measurementEl = document.createElement('div');
        measurementEl.className = 'measurement-item';
        measurementEl.innerHTML = `
            <div class="measurement-label">${type.label}</div>
            <div class="measurement-value">${measurements[type.key]} ${type.unit}</div>
        `;
        
        measurementsContainer.appendChild(measurementEl);
    });
}

// Função para configurar tracking automático
function setupAutoTracking() {
    // Salvar progresso automaticamente a cada mudança
    const progressInputs = document.querySelectorAll('.progress-input');
    
    progressInputs.forEach(input => {
        input.addEventListener('change', function() {
            saveProgressData();
        });
    });
}

// Função para salvar dados de progresso
function saveProgressData() {
    const data = {
        currentWeight: parseFloat(document.getElementById('current-weight-input')?.value || 80),
        measurements: {
            chest: parseFloat(document.getElementById('chest-input')?.value || 100),
            waist: parseFloat(document.getElementById('waist-input')?.value || 90),
            hips: parseFloat(document.getElementById('hips-input')?.value || 105),
            arms: parseFloat(document.getElementById('arms-input')?.value || 35),
            thighs: parseFloat(document.getElementById('thighs-input')?.value || 60)
        },
        timestamp: new Date().toISOString()
    };
    
    // Salvar no localStorage
    const existingData = JSON.parse(localStorage.getItem('progressData') || '{}');
    const updatedData = { ...existingData, ...data };
    localStorage.setItem('progressData', JSON.stringify(updatedData));
    
    // Enviar para servidor
    sendToServer(updatedData);
}

// Função para enviar dados para servidor
function sendToServer(data) {
    fetch('database/progress_manager.php?action=update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            console.log('Progresso salvo com sucesso');
        } else {
            console.error('Erro ao salvar progresso:', result.message);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}

// Função para inicializar gráficos
function initCharts() {
    // Implementar gráficos com Chart.js ou similar
    console.log('Gráficos inicializados');
}

// Função para inicializar metas
function initGoals() {
    // Adicionar funcionalidade para criar/editar metas
    const addGoalBtn = document.querySelector('.add-goal-btn');
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', showAddGoalModal);
    }
}

// Função para mostrar modal de adicionar meta
function showAddGoalModal() {
    const modal = document.createElement('div');
    modal.className = 'goal-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Adicionar Nova Meta</h3>
            <form id="addGoalForm">
                <div class="form-group">
                    <label for="goalTitle">Título da Meta</label>
                    <input type="text" id="goalTitle" required>
                </div>
                <div class="form-group">
                    <label for="goalTarget">Peso Alvo (kg)</label>
                    <input type="number" id="goalTarget" min="40" max="200" step="0.1" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="cancel-btn" onclick="closeGoalModal()">Cancelar</button>
                    <button type="submit" class="submit-btn">Adicionar Meta</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar formulário
    const form = document.getElementById('addGoalForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewGoal();
    });
}

// Função para adicionar nova meta
function addNewGoal() {
    const title = document.getElementById('goalTitle').value;
    const target = parseFloat(document.getElementById('goalTarget').value);
    
    const newGoal = {
        id: Date.now(),
        title: title,
        target: target,
        achieved: false
    };
    
    // Adicionar à lista de metas
    const existingData = JSON.parse(localStorage.getItem('progressData') || '{}');
    if (!existingData.goals) {
        existingData.goals = [];
    }
    existingData.goals.push(newGoal);
    localStorage.setItem('progressData', JSON.stringify(existingData));
    
    // Atualizar interface
    updateGoals(existingData.goals);
    
    // Fechar modal
    closeGoalModal();
}

// Função para fechar modal de meta
function closeGoalModal() {
    const modal = document.querySelector('.goal-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Função para registrar entrada diária
function logDailyEntry() {
    const weight = parseFloat(document.getElementById('daily-weight-input')?.value);
    const notes = document.getElementById('daily-notes-input')?.value;
    
    if (!weight) {
        alert('Por favor, insira seu peso atual');
        return;
    }
    
    const entry = {
        date: new Date().toISOString(),
        weight: weight,
        notes: notes
    };
    
    // Adicionar à lista de logs
    const existingData = JSON.parse(localStorage.getItem('progressData') || '{}');
    if (!existingData.dailyLogs) {
        existingData.dailyLogs = [];
    }
    existingData.dailyLogs.push(entry);
    
    // Atualizar peso atual
    existingData.currentWeight = weight;
    
    localStorage.setItem('progressData', JSON.stringify(existingData));
    
    // Atualizar interface
    updateProgressUI(existingData);
    
    // Limpar formulário
    document.getElementById('daily-weight-input').value = '';
    document.getElementById('daily-notes-input').value = '';
    
    alert('Entrada registrada com sucesso!');
}

// Função para exportar dados
function exportProgressData() {
    const data = JSON.parse(localStorage.getItem('progressData') || '{}');
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'progresso-dietatransform.json';
    link.click();
}

// Função para resetar progresso
function resetProgress() {
    if (confirm('Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('progressData');
        location.reload();
    }
}

// Exportar funções para uso global
window.progress = {
    logDailyEntry: logDailyEntry,
    exportData: exportProgressData,
    resetProgress: resetProgress,
    addGoal: addNewGoal
}; 