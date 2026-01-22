import { Building } from './buildings';

export interface RoomData {
    id: number;
    name: string;
    price: number;
    description: string;
    building_id: number;
    building: Building;
    images: string[];
}

export interface PaginationLink {
    active: boolean;
    label: string;
    url: string | null;
}

export interface PaginatedRoomData {
    current_page: number;
    data: RoomData[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
