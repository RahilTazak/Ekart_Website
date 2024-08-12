import { totalCents } from '../scripts/checkout/paymentSummary.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';


class OrderClass {
    //orderTime;
    //totalCostCents;
    //orderId;
    cart;
    constructor(orders) {
        //this.orderTime = dayjs().format('MMMM D');
        //this.totalCostCents = totalCents;
        //this.orderId = 123*100000;
        this.cart = orders;
    }

}

export default OrderClass;