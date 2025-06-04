export interface IBooking {
    id: number,
    eventId: number,
    packageId: number;
    priceToPay: number;
    amountOfTickets: number;
}