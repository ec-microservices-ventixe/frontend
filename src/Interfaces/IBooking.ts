export interface IBooking {
    id: number,
    date: string,
    eventId: number,
    packageId: number;
    priceToPay: number;
    amountOfTickets: number;
}