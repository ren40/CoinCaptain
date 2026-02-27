<template>
    <section class="charts-wrapper wrapper">
        <header>
            <h2>Графики</h2>
        </header>
        <main class="charts-container">
            <div class="chart-item">
                <h3>Доходы и расходы по времени</h3>
                <canvas ref="incomeExpenseChartRef"></canvas>
            </div>
            <div class="chart-item">
                <h3>Расходы по категориям</h3>
                <canvas ref="categoryChartRef"></canvas>
            </div>
            <div class="chart-item">
                <h3>Динамика баланса</h3>
                <canvas ref="balanceChartRef"></canvas>
            </div>
            <div class="chart-item">
                <h3>Сравнение доходов и расходов</h3>
                <canvas ref="comparisonChartRef"></canvas>
            </div>
        </main>
    </section>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useTransactions, useCategoryStore } from '@/entities'
import { storeToRefs } from 'pinia'

Chart.register(...registerables)

// Refs для canvas элементов
const incomeExpenseChartRef = ref<HTMLCanvasElement | null>(null)
const categoryChartRef = ref<HTMLCanvasElement | null>(null)
const balanceChartRef = ref<HTMLCanvasElement | null>(null)
const comparisonChartRef = ref<HTMLCanvasElement | null>(null)

// Chart instances
let incomeExpenseChart: Chart | null = null
let categoryChart: Chart | null = null
let balanceChart: Chart | null = null
let comparisonChart: Chart | null = null

const { getTransactionsFromArray } = storeToRefs(useTransactions())
const { getCategoriesFromArray, fetchAllCategories } = useCategoryStore()

// Получаем транзакции
const transactions = computed(() => getTransactionsFromArray.value)

// Фильтруем транзакции по типу
const incomeTransactions = computed(() => 
    transactions.value.filter(t => t.isIncome)
)

const expenseTransactions = computed(() => 
    transactions.value.filter(t => !t.isIncome)
)

// Группируем транзакции по датам для графика доходов/расходов
const getIncomeExpenseData = () => {
    const incomeByDate = new Map<string, number>()
    const expenseByDate = new Map<string, number>()
    
    incomeTransactions.value.forEach(t => {
        const date = new Date(t.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
        incomeByDate.set(date, (incomeByDate.get(date) || 0) + t.amount)
    })
    
    expenseTransactions.value.forEach(t => {
        const date = new Date(t.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
        console.log(expenseByDate.get(date), t.amount)
        expenseByDate.set(date, t.amount)
    })
    
    const allDates = Array.from(new Set([...incomeByDate.keys(), ...expenseByDate.keys()]))
        .sort((a, b) => {
            const [dayA, monthA] = a.split('.')
            const [dayB, monthB] = b.split('.')
            return new Date(2024, parseInt(monthA) - 1, parseInt(dayA)).getTime() - 
                   new Date(2024, parseInt(monthB) - 1, parseInt(dayB)).getTime()
        })
        console.log(allDates.map(date => expenseByDate.get(date) || 0))
    
    return {
        labels: allDates,
        income: allDates.map(date => incomeByDate.get(date) || 0),
        expense: allDates.map(date => expenseByDate.get(date) ?? 0)
    }
}

// Группируем расходы по категориям
const getCategoryData = () => {
    const categoryMap = new Map<string, number>()
    const categories = getCategoriesFromArray()
    
    expenseTransactions.value.forEach(t => {
        if (t.categoryId) {
            const categoryId = t.categoryId.toString()
            console.log(categoryId, t)
            categoryMap.set(categoryId, (categoryMap.get(categoryId) || 0) + t.amount)
        }
    })
    
    const labels: string[] = []
    const data: number[] = []
    const colors: string[] = []
    
    categoryMap.forEach((amount, categoryId) => {
        const category = categories.find(c => Number(c.id) === Number(categoryId))
        console.log(category, categories)
        if (category) {
            labels.push(category.name)
            data.push(amount)
            colors.push(category.color || `#${Math.floor(Math.random()*16777215).toString(16)}`)
        }
    })
    
    return { labels, data, colors }
}

// Данные для графика баланса
const getBalanceData = () => {
    const balanceByDate = new Map<string, number>()
    const sortedTransactions = [...transactions.value].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    console.log(sortedTransactions, 'getBalanceData')
    sortedTransactions.forEach(t => {
        const date = new Date(t.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
        console.log(date, 'getBalanceData', balanceByDate.size, t
        )
        balanceByDate.set(date, t.amount)
    })
    
    const dates = Array.from(balanceByDate.keys()).sort((a, b) => {
        const [dayA, monthA] = a.split('.')
        const [dayB, monthB] = b.split('.')
        return new Date(2024, parseInt(monthA) - 1, parseInt(dayA)).getTime() - 
               new Date(2024, parseInt(monthB) - 1, parseInt(dayB)).getTime()
    })
    
    return {
        labels: dates,
        balances: dates.map(date => balanceByDate.get(date) || 0)
    }
}

// Данные для сравнения доходов и расходов
const getComparisonData = () => {
    const totalIncome = incomeTransactions.value.reduce((sum, t) => Number(sum) + Number(t.amount), 0)
    const totalExpense = expenseTransactions.value.reduce((sum, t) => Number(sum) + Number(t.amount), 0)

    return {
        labels: ['Доходы', 'Расходы'],
        income: totalIncome,
        expense: totalExpense
    }
}

// Создание графика доходов/расходов
const createIncomeExpenseChart = () => {
    if (!incomeExpenseChartRef.value) return
    
    const data = getIncomeExpenseData()
    
    if (incomeExpenseChart) {
        incomeExpenseChart.destroy()
    }
    
    incomeExpenseChart = new Chart(incomeExpenseChartRef.value, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Доходы',
                    data: data.income,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                },
                {
                    label: 'Расходы',
                    data: data.expense,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    })
}

// Создание графика по категориям
const createCategoryChart = () => {
    if (!categoryChartRef.value) return
    
    const data = getCategoryData()
    
    if (categoryChart) {
        categoryChart.destroy()
    }
    
    if (data.labels.length === 0) {
        return
    }
    
    categoryChart = new Chart(categoryChartRef.value, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: data.colors,
                borderColor: '#1a1a1a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#fff',
                        padding: 15
                    }
                }
            }
        }
    })
}

// Создание графика баланса
const createBalanceChart = () => {
    if (!balanceChartRef.value) return
    
    const data = getBalanceData()
    
    if (balanceChart) {
        balanceChart.destroy()
    }
    
    if (data.labels.length === 0) {
        return
    }
    
    balanceChart = new Chart(balanceChartRef.value, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Баланс',
                data: data.balances,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    })
}

// Создание графика сравнения
const createComparisonChart = () => {
    if (!comparisonChartRef.value) return
    
    const data = getComparisonData()
    
    if (comparisonChart) {
        comparisonChart.destroy()
    }
    
    comparisonChart = new Chart(comparisonChartRef.value, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Сумма',
                data: [data.income, data.expense],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                ],
                borderColor: [
                    'rgb(75, 192, 192)',
                    'rgb(255, 99, 132)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    })
}

// Обновление всех графиков
const updateCharts = () => {
    createIncomeExpenseChart()
    createCategoryChart()
    createBalanceChart()
    createComparisonChart()
}

// Отслеживаем изменения транзакций
watch(transactions, () => {
    updateCharts()
}, { deep: true })

onMounted(async () => {
    // Загружаем категории, если они еще не загружены
    const categories = getCategoriesFromArray()
    if (categories.length === 0) {
        await fetchAllCategories()
    }
    updateCharts()
})

onBeforeUnmount(() => {
    if (incomeExpenseChart) incomeExpenseChart.destroy()
    if (categoryChart) categoryChart.destroy()
    if (balanceChart) balanceChart.destroy()
    if (comparisonChart) comparisonChart.destroy()
})
</script>

<style scoped>
.charts-wrapper {
    padding: 1.75rem;
    display: flex;
    border-radius: .5rem;
    flex-direction: column;
    overflow-y: auto;
    background-color: var(--black-tints-400);
    width: 100%;
    height: 100%;
}

.charts-wrapper header h2 {
    margin: 0 0 1.5rem 0;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
}

.charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.chart-item {
    background-color: var(--black-tints-500);
    border-radius: .5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.chart-item h3 {
    margin: 0 0 1rem 0;
    color: #fff;
    font-size: 1rem;
    font-weight: 500;
}

.chart-item canvas {
    max-height: 250px;
    flex: 1;
}

@media (max-width: 768px) {
    .charts-container {
        grid-template-columns: 1fr;
    }
}
</style>