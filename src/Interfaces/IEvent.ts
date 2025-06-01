export interface IEvent {
    id: number;
    imageUrl: string;
    name: string;
    description: string;
    location: string;
    date: string;
    startTime: string;
    endTime: string;
    totalTickets: number; 
    price: number;
    category: ICategory;
    scheduleSlots: IScheduleSlot[];
    packages: IPackage[];
}

export interface ICategory {
    id: number;
    name: string;
}

export interface IScheduleSlot {
    id: number;
    eventId: number;
    name: string;
    startTime: string;
    endTime: string;
}

export interface IPackage {
    id: number;
    eventId: number;
    name: string;
    isSeating: boolean;
    benefits: string;
    extraFeeInProcent: number;
}