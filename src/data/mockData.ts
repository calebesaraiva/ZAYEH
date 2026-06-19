import type { Customer, Order } from '../store/useStore';

export const customers: Customer[] = [
  { id: 'c1', name: 'Ana Carolina Silva', email: 'ana@email.com', phone: '(11) 99999-0001', city: 'São Paulo', totalOrders: 12, totalSpent: 4820.50, lastOrder: '2026-06-14', status: 'vip', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 'c2', name: 'Beatriz Oliveira', email: 'bea@email.com', phone: '(21) 99999-0002', city: 'Rio de Janeiro', totalOrders: 7, totalSpent: 2340.00, lastOrder: '2026-06-10', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 'c3', name: 'Camila Ferreira', email: 'cami@email.com', phone: '(31) 99999-0003', city: 'Belo Horizonte', totalOrders: 3, totalSpent: 890.90, lastOrder: '2026-05-28', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 'c4', name: 'Daniela Santos', email: 'dani@email.com', phone: '(11) 99999-0004', city: 'São Paulo', totalOrders: 18, totalSpent: 7650.00, lastOrder: '2026-06-15', status: 'vip', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 'c5', name: 'Eduarda Lima', email: 'edu@email.com', phone: '(41) 99999-0005', city: 'Curitiba', totalOrders: 1, totalSpent: 279.90, lastOrder: '2026-04-10', status: 'inativo', avatar: 'https://i.pravatar.cc/150?img=20' },
  { id: 'c6', name: 'Fernanda Costa', email: 'fer@email.com', phone: '(85) 99999-0006', city: 'Fortaleza', totalOrders: 5, totalSpent: 1540.80, lastOrder: '2026-06-01', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=25' },
  { id: 'c7', name: 'Gabriela Mendes', email: 'gabi@email.com', phone: '(11) 99999-0007', city: 'São Paulo', totalOrders: 9, totalSpent: 3210.60, lastOrder: '2026-06-12', status: 'vip', avatar: 'https://i.pravatar.cc/150?img=32' },
  { id: 'c8', name: 'Helena Rocha', email: 'hel@email.com', phone: '(51) 99999-0008', city: 'Porto Alegre', totalOrders: 4, totalSpent: 1120.00, lastOrder: '2026-05-20', status: 'ativo', avatar: 'https://i.pravatar.cc/150?img=44' },
];

export const orders: Order[] = [
  { id: '#10234', customerId: 'c1', customerName: 'Ana Carolina Silva', items: [{ productName: 'Vestido Noite Encantada', quantity: 1, price: 389.90, size: 'M' }], total: 389.90, status: 'entregue', date: '2026-06-14', paymentMethod: 'Cartão de Crédito' },
  { id: '#10235', customerId: 'c4', customerName: 'Daniela Santos', items: [{ productName: 'Blazer Alfaiataria Luxo', quantity: 1, price: 549.90, size: 'P' }, { productName: 'Calça Wide Leg Veludo', quantity: 1, price: 319.90, size: '38' }], total: 869.80, status: 'enviado', date: '2026-06-15', paymentMethod: 'PIX' },
  { id: '#10236', customerId: 'c2', customerName: 'Beatriz Oliveira', items: [{ productName: 'Saia Midi Plissada', quantity: 2, price: 229.90, size: 'M' }], total: 459.80, status: 'pago', date: '2026-06-15', paymentMethod: 'Cartão de Débito' },
  { id: '#10237', customerId: 'c7', customerName: 'Gabriela Mendes', items: [{ productName: 'Maxi Casaco Caramelo', quantity: 1, price: 879.90, size: 'G' }], total: 879.90, status: 'pendente', date: '2026-06-16', paymentMethod: 'PIX' },
  { id: '#10238', customerId: 'c3', customerName: 'Camila Ferreira', items: [{ productName: 'Blusa Off-Shoulder Seda', quantity: 1, price: 199.90, size: 'P' }], total: 199.90, status: 'entregue', date: '2026-06-12', paymentMethod: 'Cartão de Crédito' },
  { id: '#10239', customerId: 'c6', customerName: 'Fernanda Costa', items: [{ productName: 'Jaqueta Couro Vegano', quantity: 1, price: 689.90, size: 'M' }], total: 689.90, status: 'enviado', date: '2026-06-13', paymentMethod: 'Boleto' },
  { id: '#10240', customerId: 'c8', customerName: 'Helena Rocha', items: [{ productName: 'Conjunto Linho Premium', quantity: 1, price: 459.90, size: 'G' }, { productName: 'Top Cropped Ilhós', quantity: 1, price: 149.90, size: 'M' }], total: 609.80, status: 'pago', date: '2026-06-16', paymentMethod: 'Cartão de Crédito' },
  { id: '#10241', customerId: 'c5', customerName: 'Eduarda Lima', items: [{ productName: 'Vestido Floral Verão', quantity: 1, price: 279.90, size: 'PP' }], total: 279.90, status: 'cancelado', date: '2026-06-11', paymentMethod: 'PIX' },
];

export const salesData = [
  { month: 'Jan', vendas: 18500, pedidos: 47, meta: 20000 },
  { month: 'Fev', vendas: 22300, pedidos: 58, meta: 22000 },
  { month: 'Mar', vendas: 19800, pedidos: 51, meta: 22000 },
  { month: 'Abr', vendas: 28400, pedidos: 73, meta: 25000 },
  { month: 'Mai', vendas: 32100, pedidos: 82, meta: 30000 },
  { month: 'Jun', vendas: 37800, pedidos: 97, meta: 35000 },
];

export const categoryData = [
  { name: 'Vestidos', value: 35, color: '#d946ef' },
  { name: 'Blazers', value: 22, color: '#9333ea' },
  { name: 'Calças', value: 18, color: '#ec4899' },
  { name: 'Saias', value: 12, color: '#a855f7' },
  { name: 'Blusas', value: 8, color: '#e879f9' },
  { name: 'Outros', value: 5, color: '#6b21a8' },
];

export const topProducts = [
  { name: 'Vestido Noite Encantada', sales: 89, revenue: 34701.10, growth: 24 },
  { name: 'Blazer Alfaiataria Luxo', sales: 64, revenue: 35193.60, growth: 18 },
  { name: 'Conjunto Linho Premium', sales: 71, revenue: 32652.90, growth: 31 },
  { name: 'Maxi Casaco Caramelo', sales: 38, revenue: 33436.20, growth: 45 },
  { name: 'Saia Couro Midi', sales: 55, revenue: 19244.50, growth: 12 },
];
