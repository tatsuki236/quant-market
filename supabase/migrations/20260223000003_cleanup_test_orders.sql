-- テスト注文データの削除
DELETE FROM order_items WHERE order_id IN ('QM-1771790284080-I0E7ZQ', 'QM-1771790560204-PYRGVU');
DELETE FROM orders WHERE order_id IN ('QM-1771790284080-I0E7ZQ', 'QM-1771790560204-PYRGVU');

-- テスト用顧客の削除
DELETE FROM customers WHERE email IN ('test@example.com', 'test15@example.com');
