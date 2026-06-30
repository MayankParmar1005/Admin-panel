import { Injectable } from '@angular/core';
import {
    CustomerModel, ServiceModel, Appointment,
    Invoice, DashboardStats, RevenueData
} from '../models';

@Injectable({ providedIn: 'root' })
export class DataService {

    getStats(): DashboardStats {
        return {
            todaysAppointments: 12,
            todaysRevenue: 8450,
            totalCustomers: 348,
            totalEmployees: 8,
            appointmentsChange: 8.5,
            revenueChange: 12.3,
            customersChange: 4.1,
            employeesChange: 0,
            scheduled: '3'
        };
    }

    getRevenueData(): RevenueData[] {
        return [
            { month: 'Jan', revenue: 42000 },
            { month: 'Feb', revenue: 38500 },
            { month: 'Mar', revenue: 51000 },
            { month: 'Apr', revenue: 47800 },
            { month: 'May', revenue: 63200 },
            { month: 'Jun', revenue: 58900 },
            { month: 'Jul', revenue: 71400 },
            { month: 'Aug', revenue: 68000 },
            { month: 'Sep', revenue: 75300 },
            { month: 'Oct', revenue: 82100 },
            { month: 'Nov', revenue: 79500 },
            { month: 'Dec', revenue: 91200 },
        ];
    }

    // getCustomers(): CustomerModel[] {
    //     return [
    //         { id: 1, name: 'Priya Sharma', email: 'priya@email.com', phone: '9876543210', joinDate: '2024-01-15', totalVisits: 18, totalSpent: 14200, status: 'active' },
    //         { id: 2, name: 'Anita Patel', email: 'anita@email.com', phone: '9812345678', joinDate: '2024-02-20', totalVisits: 12, totalSpent: 9800, status: 'active' },
    //         { id: 3, name: 'Sunita Rao', email: 'sunita@email.com', phone: '9898989898', joinDate: '2023-11-05', totalVisits: 25, totalSpent: 22500, status: 'active' },
    //         { id: 4, name: 'Meera Nair', email: 'meera@email.com', phone: '9765432100', joinDate: '2024-03-10', totalVisits: 6, totalSpent: 4200, status: 'inactive' },
    //         { id: 5, name: 'Kavita Singh', email: 'kavita@email.com', phone: '9700001234', joinDate: '2023-08-22', totalVisits: 31, totalSpent: 28700, status: 'active' },
    //         { id: 6, name: 'Deepa Joshi', email: 'deepa@email.com', phone: '9611223344', joinDate: '2024-04-01', totalVisits: 4, totalSpent: 3100, status: 'active' },
    //         { id: 7, name: 'Rekha Gupta', email: 'rekha@email.com', phone: '9555667788', joinDate: '2023-06-14', totalVisits: 42, totalSpent: 38600, status: 'active' },
    //         { id: 8, name: 'Nisha Mehta', email: 'nisha@email.com', phone: '9444556677', joinDate: '2024-05-18', totalVisits: 2, totalSpent: 1500, status: 'active' },
    //         { id: 9, name: 'Pooja Verma', email: 'pooja@email.com', phone: '9333445566', joinDate: '2023-12-01', totalVisits: 9, totalSpent: 7600, status: 'inactive' },
    //         { id: 10, name: 'Ritu Malhotra', email: 'ritu@email.com', phone: '9222334455', joinDate: '2024-01-28', totalVisits: 14, totalSpent: 11300, status: 'active' },
    //     ];
    // }

    // getEmployees(): Employee[] {
    //     return [
    //         { id: 1, name: 'Swati Desai', email: 'swati@salon.com', phone: '9871234560', role: 'Senior Stylist', specialization: 'Hair Coloring & Cuts', joinDate: '2022-03-01', status: 'active', rating: 4.9 },
    //         { id: 2, name: 'Pallavi Kulkarni', email: 'pallavi@salon.com', phone: '9761234560', role: 'Beautician', specialization: 'Facial & Skincare', joinDate: '2022-06-15', status: 'active', rating: 4.7 },
    //         { id: 3, name: 'Rinku Shah', email: 'rinku@salon.com', phone: '9651234560', role: 'Nail Artist', specialization: 'Nail Extensions & Art', joinDate: '2023-01-10', status: 'active', rating: 4.8 },
    //         { id: 4, name: 'Dipika More', email: 'dipika@salon.com', phone: '9541234560', role: 'Junior Stylist', specialization: 'Hair Styling', joinDate: '2023-05-20', status: 'active', rating: 4.5 },
    //         { id: 5, name: 'Leena Patil', email: 'leena@salon.com', phone: '9431234560', role: 'Massage Therapist', specialization: 'Head & Body Massage', joinDate: '2022-09-01', status: 'on-leave', rating: 4.6 },
    //         { id: 6, name: 'Geeta Bhat', email: 'geeta@salon.com', phone: '9321234560', role: 'Senior Beautician', specialization: 'Bridal Makeup', joinDate: '2021-11-15', status: 'active', rating: 5.0 },
    //         { id: 7, name: 'Anushka Tiwari', email: 'anushka@salon.com', phone: '9211234560', role: 'Stylist', specialization: 'Hair & Makeup', joinDate: '2023-08-01', status: 'active', rating: 4.4 },
    //         { id: 8, name: 'Mohini Shetty', email: 'mohini@salon.com', phone: '9101234560', role: 'Receptionist', specialization: 'Customer Relations', joinDate: '2022-01-10', status: 'active', rating: 4.8 },
    //     ];
    // }

    getServices(): ServiceModel[] {
        return [
            { id: 1, name: 'Haircut & Blow Dry', category: 'Hair', duration: 45, price: 500, description: 'Professional haircut with blowdry finish', status: 'active' },
            { id: 2, name: 'Hair Coloring', category: 'Hair', duration: 120, price: 2500, description: 'Full hair coloring with premium colors', status: 'active' },
            { id: 3, name: 'Hair Highlights', category: 'Hair', duration: 90, price: 1800, description: 'Balayage / streaks highlights', status: 'active' },
            { id: 4, name: 'Deep Conditioning', category: 'Hair', duration: 60, price: 800, description: 'Deep repair conditioning treatment', status: 'active' },
            { id: 5, name: 'Basic Facial', category: 'Skin', duration: 60, price: 700, description: 'Cleansing, toning and moisturizing', status: 'active' },
            { id: 6, name: 'Gold Facial', category: 'Skin', duration: 75, price: 1500, description: 'Gold-infused anti-aging facial', status: 'active' },
            { id: 7, name: 'Threading (Full Face)', category: 'Skin', duration: 20, price: 150, description: 'Full face threading and grooming', status: 'active' },
            { id: 8, name: 'Waxing (Full Arms)', category: 'Waxing', duration: 30, price: 400, description: 'Soft wax full arm treatment', status: 'active' },
            { id: 9, name: 'Waxing (Full Legs)', category: 'Waxing', duration: 45, price: 600, description: 'Soft wax full leg treatment', status: 'active' },
            { id: 10, name: 'Nail Manicure', category: 'Nails', duration: 40, price: 450, description: 'Classic manicure with polish', status: 'active' },
            { id: 11, name: 'Nail Pedicure', category: 'Nails', duration: 45, price: 550, description: 'Classic pedicure with polish', status: 'active' },
            { id: 12, name: 'Gel Nail Extensions', category: 'Nails', duration: 90, price: 1200, description: 'UV gel nail extension set', status: 'inactive' },
            { id: 13, name: 'Head Massage', category: 'Massage', duration: 30, price: 400, description: 'Relaxing oil-based head massage', status: 'active' },
            { id: 14, name: 'Bridal Package', category: 'Special', duration: 300, price: 8500, description: 'Complete bridal makeup & hair', status: 'active' },
        ];
    }

    // getAppointments(): Appointment[] {
    //     return [
    //         { id: 1, name: 'Priya Sharma', mobile: '9876543210', email: 'priya@email.com', staff_id: 1, service_name: 'Haircut & Blow Dry', appointment_date: '2026-06-19', appointment_time: '10:00', total_amount: 500, status: 'scheduled' },
    //         { id: 2, name: 'Sunita Rao', mobile: '9898989898', email: 'sunita@email.com', staff_id: 2, service_name: 'Gold Facial', appointment_date: '2026-06-19', appointment_time: '11:00', total_amount: 1500, status: 'completed' },
    //         { id: 3, name: 'Kavita Singh', mobile: '9700001234', email: 'kavita@email.com', staff_id: 6, service_name: 'Bridal Package', appointment_date: '2026-06-19', appointment_time: '09:00', total_amount: 8500, status: 'scheduled' },
    //         { id: 4, name: 'Anita Patel', mobile: '9812345678', email: 'anita@email.com', staff_id: 3, service_name: 'Nail Manicure', appointment_date: '2026-06-19', appointment_time: '12:30', total_amount: 450, status: 'scheduled' },
    //         { id: 5, name: 'Rekha Gupta', mobile: '9555667788', email: 'rekha@email.com', staff_id: 4, service_name: 'Hair Coloring', appointment_date: '2026-06-19', appointment_time: '14:00', total_amount: 2500, status: 'cancelled' },
    //         { id: 6, name: 'Ritu Malhotra', mobile: '9222334455', email: 'ritu@email.com', staff_id: 1, service_name: 'Hair Highlights', appointment_date: '2026-06-20', appointment_time: '10:30', total_amount: 1800, status: 'scheduled' },
    //         { id: 7, name: 'Meera Nair', mobile: '9765432100', email: 'meera@email.com', staff_id: 2, service_name: 'Basic Facial', appointment_date: '2026-06-20', appointment_time: '11:00', total_amount: 700, status: 'scheduled' },
    //         { id: 8, name: 'Deepa Joshi', mobile: '9611223344', email: 'deepa@email.com', staff_id: 3, service_name: 'Nail Pedicure', appointment_date: '2026-06-20', appointment_time: '13:00', total_amount: 550, status: 'scheduled' },
    //         { id: 9, name: 'Nisha Mehta', mobile: '9444556677', email: 'nisha@email.com', staff_id: 7, service_name: 'Haircut & Blow Dry', appointment_date: '2026-06-18', appointment_time: '15:00', total_amount: 500, status: 'completed' },
    //         { id: 10, name: 'Pooja Verma', mobile: '9333445566', email: 'pooja@email.com', staff_id: 2, service_name: 'Threading (Full Face)', appointment_date: '2026-06-18', appointment_time: '16:00', total_amount: 150, status: 'completed' },
    //     ];
    // }

    getInvoices(): Invoice[] {
        return [
            { id: 1001, appointmentId: 2, customerName: 'Sunita Rao', services: ['Gold Facial'], subtotal: 1500, tax: 270, total: 1770, paidAt: '2026-06-19', paymentMethod: 'card', status: 'paid' },
            { id: 1002, appointmentId: 9, customerName: 'Nisha Mehta', services: ['Haircut & Blow Dry'], subtotal: 500, tax: 90, total: 590, paidAt: '2026-06-18', paymentMethod: 'cash', status: 'paid' },
            { id: 1003, appointmentId: 10, customerName: 'Pooja Verma', services: ['Threading (Full Face)'], subtotal: 150, tax: 27, total: 177, paidAt: '2026-06-18', paymentMethod: 'upi', status: 'paid' },
            { id: 1004, appointmentId: 5, customerName: 'Rekha Gupta', services: ['Hair Coloring'], subtotal: 2500, tax: 450, total: 2950, paidAt: '2026-06-19', paymentMethod: 'card', status: 'refunded' },
            { id: 1005, appointmentId: 3, customerName: 'Kavita Singh', services: ['Bridal Package'], subtotal: 8500, tax: 1530, total: 10030, paidAt: '2026-06-19', paymentMethod: 'card', status: 'pending' },
        ];
    }
}
