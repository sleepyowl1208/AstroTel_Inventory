// Example: Billing.tsx
import React from "react";

interface TimelineProps {
    data: unknown; // Replace 'any' with a proper type
}
const Timeline: React.FC<TimelineProps> = ({ data }) => {
    if (!data) return <div>No Timeline Data Available</div>;

    return (
        <div>
            <h3>TimeLine Details</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default Timeline;
