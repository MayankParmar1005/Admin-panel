export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

export interface CustomerModel {
    id: number;
    name: string;
    email: string;
    mobile: string;
    created_at: string;
    visits: number;
    total_spent: number;
    last_visit: string;
    status: 'active' | 'inactive';
    avatar?: string;
    total_visits: string;
}

export interface EmployeeModel {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    specialization: string;
    join_date: string;
    status: 'active' | 'inactive' | 'on-leave';
    avatar?: string;
    rating: number;
}

export interface ServiceModel {
    id: number;
    name: string;
    category: string;
    duration: number; // minutes
    price: number;
    description: string;
    status: 'active' | 'inactive';
    created_at?: string;
}

// export interface Appointment {
//     id: number;
//     customerId: number;
//     customerName: string;
//     employeeId: number;
//     employeeName: string;
//     serviceId: number;
//     serviceName: string;
//     date: string;
//     time: string;
//     duration: number;
//     price: number;
//     status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
//     notes?: string;
// }

export interface Appointment {
    id: number;

    // Customer payload properties
    customer_name: string;             // Matches backend const { name }
    mobile: string;           // Matches backend const { mobile }
    email?: string;           // Matches backend const { email }

    // Table specific underscore properties
    staff_id: number | null;        // Matches backend const { staff_id }
    service_id: number;            // Matches backend const { service_id }
    appointment_date: string;      // Matches backend const { appointment_date }
    appointment_time: string;      // Matches backend const { appointment_time }
    total_amount: number;          // Matches backend const { total_amount }
    service_name: string;

    status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Invoice {
    id: number;
    appointmentId: number;
    customerName: string;
    services: string[];
    subtotal: number;
    tax: number;
    total: number;
    paidAt: string;
    paymentMethod: 'cash' | 'card' | 'upi';
    status: 'paid' | 'pending' | 'refunded';
}

export interface DashboardStats {
    todaysAppointments: number;
    todaysRevenue: number;
    totalCustomers: number;
    totalEmployees: number;
    appointmentsChange: number;
    revenueChange: number;
    customersChange: number;
    employeesChange: number;
    scheduled: string;
}

export interface TodayOverviewModel {
    scheduled: number;
    completed: number;
    cancelled: number;
    revenueCollected: number;
  }

export interface RevenueData {
    month: string;
    revenue: number;
}
