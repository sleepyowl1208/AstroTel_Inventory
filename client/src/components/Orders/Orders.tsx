// Example: Billing.tsx
import React from "react";

interface OrdersProps {
    data: unknown; // Replace 'any' with a proper type
}
const Orders: React.FC<OrdersProps> = ({ data }) => {
    if (!data) return <div>No Orders Data Available</div>;

    return (
        <div>
            <h3>Orders Details</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default Orders;
