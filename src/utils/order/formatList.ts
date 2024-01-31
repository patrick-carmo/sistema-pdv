import { Order, ProcessedOrder, ProductOrder } from '../../types/types';

const formatList = (data: ProcessedOrder[]): ProcessedOrder[] => {
  const formattedData = data.reduce((accumulator: ProcessedOrder[], order: any) => {
    const orderExists = accumulator.find((currentOrder: ProcessedOrder) => currentOrder.order.id === order.order_id);

    const product_order: ProductOrder = {
      id: order.product_order_id,
      product_qty: order.product_qty,
      product_value: order.product_value,
      order_id: order.p_product_order_id,
      product_id: order.p_product_product_id,
    };

    const orders: Omit<Order, 'product_order'> = {
      id: order.order_id,
      total_value: order.total_value,
      observation: order.observation,
      customer_id: order.customer_id,
    };

    if (orderExists) {
      orderExists.product_order.push(product_order);
    } else {
      accumulator.push({
        order: orders,
        product_order: [product_order],
      });
    }

    return accumulator;
  }, []);

  return formattedData;
};

export default formatList;
