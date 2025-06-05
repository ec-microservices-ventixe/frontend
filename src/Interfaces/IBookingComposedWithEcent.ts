export interface IBookingComposedWithEvent {
  bookingId: number;
  date: string;
  priceToPay: number;
  numberOfTickets: number;
  eventName: string;
  packageName: string | null | undefined;
  eventCategory: string
}