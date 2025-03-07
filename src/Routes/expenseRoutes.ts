import express from 'express';
import ExpenseController from '../controllers/expenseController';

const router = express.Router();

router.get('/', ExpenseController.ObtainExpenses);

router.post('/', ExpenseController.CreateExpense)

router.patch('/:id', ExpenseController.EditExpense)

router.delete('/:id', ExpenseController.DeleteExpense);

export default router;