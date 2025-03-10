// Example: Billing.tsx
import React from "react";

interface BillingProps {
    data: unknown; // Replace 'any' with a proper type
}
const Billing: React.FC<BillingProps> = ({ data }) => {
    if (!data) return <div>No Billing Data Available</div>;

    return (
        <div>
            <h3>Billing Details</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default Billing;
