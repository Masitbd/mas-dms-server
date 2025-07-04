import express from 'express';
import { StockController } from './stock.controller';

const router = express.Router();

router.post('/create-stock', StockController.createStock);
router.get('/', StockController.getAllStocks);
router.get('/:id', StockController.getSingleStock);
router.patch('/:id', StockController.updateStock);
router.delete('/:id', StockController.deleteStock);

export const StockRoutes = router;
