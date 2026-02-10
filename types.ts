export interface Trip {
  id: string;
  title: string;
  price: number;
  date: string;
  description: string;
  image_url: string;
  is_completed: boolean;
  program?: string; // Detailed program with day-by-day itinerary
  created_at?: string;
}

export type TripFormData = Omit<Trip, 'id' | 'created_at'>;

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  display_order: number;
  created_at?: string;
}

export type PartnerFormData = Omit<Partner, 'id' | 'created_at'>;

export interface Feedback {
  id: string;
  trip_id: string;
  user_name: string;
  user_email?: string;
  rating: number; // 1-5 stars
  comment: string;
  likes: number;
  created_at?: string;
}

export type FeedbackFormData = Omit<Feedback, 'id' | 'created_at' | 'likes'>;

export interface TripWithStats extends Trip {
  average_rating?: number;
  total_feedbacks?: number;
}

export interface CompanyTestimonial {
  id: string;
  customer_name: string;
  customer_location?: string;
  rating: number; // 1-5 stars
  testimonial: string;
  avatar_url?: string;
  is_featured: boolean;
  created_at?: string;
}

export type CompanyTestimonialFormData = Omit<CompanyTestimonial, 'id' | 'created_at'>;

// Trip Departure Dates - Multiple dates for the same trip
export interface TripDeparture {
  id: string;
  trip_id: string;
  departure_date: string;
  available_seats?: number;
  is_available: boolean;
  created_at?: string;
}

export type TripDepartureFormData = Omit<TripDeparture, 'id' | 'created_at'>;

// Extended Trip interface with departures
export interface TripWithDepartures extends Trip {
  departures?: TripDeparture[];
  next_departure?: string; // Next available departure date
  available_dates_count?: number;
}
