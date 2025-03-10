// Example: Billing.tsx
import React from "react";

interface PurchasesProps {
    data: unknown; // Replace 'any' with a proper type
}
const Purchases: React.FC<PurchasesProps> = ({ data }) => {
    if (!data) return <div>No Purchases Data Available</div>;

    return (
        <div>
            <h3>Purchases Details</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default Purchases;