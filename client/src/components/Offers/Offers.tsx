// Example: Billing.tsx
import React from "react";

interface OffersProps {
    data: unknown; // Replace 'any' with a proper type
}
const Offers: React.FC<OffersProps> = ({ data }) => {
    if (!data) return <div>No Offers Data Available</div>;

    return (
        <div>
            <h3>Offers Details</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default Offers;
