export interface IBooking {
    id: number,
    date: string,
    eventId: number,
    eventPackageId: number;
    priceToPay: number;
    amountOfTickets: number;
}