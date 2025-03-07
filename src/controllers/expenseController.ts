import { Request, Response } from "express";
import { Expense } from "../models/Expense";
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid';

const FILE_PATH = './expenses.json';

const ReadFile = async () => {
    const data = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(data)
}

const WriteFile = async (expenses: Expense) => {
    await fs.writeFile(FILE_PATH, JSON.stringify(expenses, null, 2))
}

const ObtainExpenses = async (req: Request, res: Response): Promise<void>  => {
    // Lógica para obtener los gastos
    try {
        const expenses = await ReadFile();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los gastos' });
    }
};

const CreateExpense = async (req: Request, res: Response): Promise<void> => {
    const { title, amount, date, category } = req.body;

    if(!title && !amount && !date && !category) {
        res.status(400).json({ message: 'Debe ingresar todos los datos' })
        return
    }

    const newExpense: Expense = {
        id: uuidv4(),
        title,
        amount,
        date,
        category
    }

    const expenses = await ReadFile()
    expenses.push(newExpense)

    await WriteFile(expenses)

    res.status(200).json({ message: 'Nuevo gasto añadido' })
}

const EditExpense = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, amount, date, category } = req.body

    if(!title && !amount && !date && !category) {
        res.status(400).json({ message: 'Debe ingresar alguno de los datos' })
        return
    }

    const expenses = await ReadFile()
    const expensesIndex = expenses.findIndex((exp: Expense) => exp.id === id)

    if(expensesIndex === -1) {
        res.status(404).json({ message: 'No se encontro el gasto' })
        return
    }

    expenses[expensesIndex] = { id, title, amount, date, category }

    await WriteFile(expenses)

    res.status(200).json({ message: 'Gasto actualizado correctamente' })
}

const DeleteExpense = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const expenses = await ReadFile();
        const filteredExpenses = expenses.filter((exp: Expense) => exp.id !== id);

        if (filteredExpenses.length === expenses.length) {
            res.status(404).json({ message: 'Gasto no encontrado' });
            return 
        }

        await WriteFile(filteredExpenses);
        res.status(200).json({ message: 'Gasto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando el gasto', error: (error as any)?.message });
    }
};

export default { ObtainExpenses, CreateExpense, EditExpense, DeleteExpense };