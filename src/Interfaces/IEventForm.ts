export interface IEventForm {
  imageFile: File | null; 
  name: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  totalTickets: number;
  price: number;
  categoryId: number | null;
}

export interface IEventUpdateForm {
  id: number,
  imageUrl: string | null,
  imageFile: File | null; 
  name: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  totalTickets: number;
  price: number;
  categoryId: number | null;
}