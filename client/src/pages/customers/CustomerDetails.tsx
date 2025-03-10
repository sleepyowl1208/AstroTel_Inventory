// import { Button, CircularProgress, Container, Typography } from "@mui/material";
// import Grid from '@mui/material/Grid2';
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Billing from "../../components/Billing/Billing";
// import Offers from "../../components/Offers/Offers";
// import Orders from "../../components/Orders/Orders";
// import Purchases from "../../components/Purchases/Purchases";
// import Spotlight from "../../components/Spotlight/Spotlight";
// import Timeline from "../../components/Timeline/Timeline";

// const data = {
//     billing: data?.billing || null,
//     spotlight: data?.spotlight || null,
//     purchases: data?.purchases || null,
//     orders: data?.orders || null,
//     timeline: data?.timeline || null,
//     offers: data?.offers || null,
// };

// interface Customer {
//     id: string;
//     name: string;
//     email: string;
//     phone: string;
// }

// const [customer, setCustomer] = useState<Customer | null>(null);

// const CustomerDetails = () => {
//     const { accountId } = useParams();
//     const navigate = useNavigate();
//     const [customer, setCustomer] = useState(null);
//     const [data, setData] = useState({
//         billing: null,
//         spotlight: null,
//         purchases: null,
//         orders: null,
//         timeline: null,
//         offers: null
//     });
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchCustomerData = async () => {
//             try {
//                 const customerResponse = await axios.get(`/customers/${accountId}`);
//                 setCustomer(customerResponse.data);

//                 const [billing, spotlight, purchases, orders, timeline, offers] = await Promise.all([
//                     axios.get(`/billing/${accountId}`),
//                     axios.get(`/spotlight/${accountId}`),
//                     axios.get(`/purchases/${accountId}`),
//                     axios.get(`/orders/${accountId}`),
//                     axios.get(`/timeline/${accountId}`),
//                     axios.get(`/offers/${accountId}`)
//                 ]);

//                 setData({
//                     billing: billing.data,
//                     spotlight: spotlight.data,
//                     purchases: purchases.data,
//                     orders: orders.data,
//                     timeline: timeline.data,
//                     offers: offers.data
//                 });
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCustomerData();
//     }, [accountId]);

//     if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

//     return (
//         <Container>
//             <Button onClick={() => navigate(-1)}>⬅ Back to Dashboard</Button>

//             <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
//                 Customer Details: {customer?.name} ({accountId})
//             </Typography>

//             <Grid container spacing={3}>
//                 <Grid size={12}><Billing data={data.billing} /></Grid>
//                 <Grid size={12}><Spotlight data={data.spotlight} /></Grid>
//                 <Grid size={12}><Purchases data={data.purchases} /></Grid>
//                 <Grid size={12}><Orders data={data.orders} /></Grid>
//                 <Grid size={12}><Timeline data={data.timeline} /></Grid>
//                 <Grid size={12}><Offers data={data.offers} /></Grid>
//             </Grid>
//         </Container>
//     );
// };

// export default CustomerDetails;


import { Button, CircularProgress, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Billing from "../../components/Billing/Billing";
import Offers from "../../components/Offers/Offers";
import Orders from "../../components/Orders/Orders";
import Purchases from "../../components/Purchases/Purchases";
import Spotlight from "../../components/Spotlight/Spotlight";
import Timeline from "../../components/Timeline/Timeline";

// Define Customer type
interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

// Define Data type
interface BillingData {
    id: string;
    amount: number;
    dueDate: string;
}

interface SpotlightData {
    id: string;
    issue: string;
    status: string;
}

interface PurchaseData {
    id: string;
    item: string;
    startDate: string;
    endDate: string;
}

interface OrderData {
    id: string;
    status: string;
    deliveryDate: string;
}

interface TimelineEvent {
    id: string;
    title: string;
    date: string;
    description: string;
}

interface OfferData {
    id: string;
    discount: number;
    validUntil: string;
}

interface CustomerData {
    billing: BillingData | null;
    spotlight: SpotlightData | null;
    purchases: PurchaseData[] | null;
    orders: OrderData[] | null;
    timeline: TimelineEvent[] | null;
    offers: OfferData[] | null;
}


const CustomerDetails = () => {
    const { accountId } = useParams();
    const navigate = useNavigate();

    // State for customer details
    const [customer, setCustomer] = useState<Customer | null>(null);

    // State for customer-related data
    const [data, setData] = useState<CustomerData>({
        billing: null,
        spotlight: null,
        purchases: null,
        orders: null,
        timeline: null,
        offers: null
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                // Fetch customer data
                const customerResponse = await axios.get(`http://127.0.0.1:8000/customers/${accountId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                console.log("Customer Data:", customerResponse.data);

                setCustomer(customerResponse.data);

                // Fetch all related data in parallel
                const [billing, spotlight, purchases, orders, timeline, offers] = await Promise.all([
                    axios.get(`/billing/${accountId}`),
                    axios.get(`/spotlight/${accountId}`),
                    axios.get(`/purchases/${accountId}`),
                    axios.get(`/orders/${accountId}`),
                    axios.get(`/timeline/${accountId}`),
                    axios.get(`/offers/${accountId}`)
                ]);

                // Store fetched data in state
                setData({
                    billing: billing.data,
                    spotlight: spotlight.data,
                    purchases: purchases.data,
                    orders: orders.data,
                    timeline: timeline.data,
                    offers: offers.data
                });

                return customerResponse.data;
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [accountId]);

    if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

    return (
        <Container>
            <Button onClick={() => navigate(-1)}>⬅ Back to Dashboard</Button>

            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                Customer Details: {customer?.name} ({accountId})
            </Typography>

            {/* Grid layout */}
            <Grid container spacing={3}>
                <Grid size={12}><Billing data={data.billing} /></Grid>
                <Grid size={12}><Spotlight data={data.spotlight} /></Grid>
                <Grid size={12}><Purchases data={data.purchases} /></Grid>
                <Grid size={12}><Orders data={data.orders} /></Grid>
                <Grid size={12}><Timeline data={data.timeline} /></Grid>
                <Grid size={12}><Offers data={data.offers} /></Grid>
            </Grid>
        </Container>
    );
};

export default CustomerDetails;
